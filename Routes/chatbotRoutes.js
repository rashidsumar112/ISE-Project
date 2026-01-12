import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import jwt from "jsonwebtoken";
import foodModel from "../models/foodmodel.js";
import orderModel from "../models/ordermodel.js";
import authMiddleware from "../middleware/Auth.js";

dotenv.config();
const router = express.Router();

const geminiKey = process.env.GEMINI_API_KEY;
console.log("Loaded Gemini Key:", geminiKey ? "✅ Key found" : "❌ Missing key");

const genAI = geminiKey ? new GoogleGenerativeAI(geminiKey) : null;

let resolvedModelName = null;
let resolvedApiVersion = null; // "v1" or "v1beta"
async function resolveModelName() {
  if (!geminiKey) return null;
  // Try v1 first, then v1beta
  const endpoints = [
    { base: "https://generativelanguage.googleapis.com/v1/models", version: "v1" },
    { base: "https://generativelanguage.googleapis.com/v1beta/models", version: "v1beta" }
  ];
  for (const { base, version } of endpoints) {
    try {
      const resp = await fetch(`${base}?key=${encodeURIComponent(geminiKey)}`);
      if (!resp.ok) continue;
      const data = await resp.json();
      const models = Array.isArray(data.models) ? data.models : [];
      const candidates = models.filter((m) => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes("generateContent"));
      // Prefer 1.5 flash/pro variants if present
      const preferred = candidates.find((m) => m.name.includes("gemini-1.5-flash"))
        || candidates.find((m) => m.name.includes("gemini-1.5-pro"))
        || candidates[0];
      if (preferred) {
        return { name: preferred.name.replace("models/", ""), version };
      }
    } catch (_) {
      // ignore and try next
    }
  }
  return null;
}

// Kick off model resolution at startup (non-blocking)
(async () => {
  try {
    const resolved = await resolveModelName();
    if (resolved) {
      resolvedModelName = resolved.name;
      resolvedApiVersion = resolved.version;
      console.log("Chatbot model resolved:", resolvedModelName);
      console.log("Chatbot API version:", resolvedApiVersion);
    } else {
      console.log("Chatbot model resolution failed — will try fallbacks at request time.");
    }
  } catch (_) {}
})();

// Helper function to analyze user preferences from order history
const analyzeUserPreferences = (orders) => {
  if (!orders || orders.length === 0) {
    return null;
  }

  const itemFrequency = {};
  const categoryFrequency = {};
  let totalOrders = orders.length;
  let allOrderedItems = [];

  // Analyze each order
  orders.forEach((order) => {
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach((item) => {
        // Count item frequency
        const itemName = item.name || "";
        itemFrequency[itemName] = (itemFrequency[itemName] || 0) + (item.quantity || 1);
        
        // Count category frequency
        const category = item.category || "";
        if (category) {
          categoryFrequency[category] = (categoryFrequency[category] || 0) + (item.quantity || 1);
        }

        // Collect all ordered items for analysis
        allOrderedItems.push({
          name: itemName,
          category: category,
          quantity: item.quantity || 1
        });
      });
    }
  });

  // Find top items and categories
  const topItems = Object.entries(itemFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  const topCategories = Object.entries(categoryFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([category, count]) => ({ category, count }));

  return {
    totalOrders,
    topItems,
    topCategories,
    itemFrequency,
    categoryFrequency
  };
};

// Helper: map Open-Meteo weather codes to human-readable conditions
function mapOpenMeteoCodeToCondition(code) {
  const c = Number(code);
  if (c === 0) return "Clear";
  if (c === 1) return "Mainly Clear";
  if (c === 2) return "Partly Cloudy";
  if (c === 3) return "Overcast";
  if (c === 45 || c === 48) return "Fog";
  if (c === 51 || c === 53 || c === 55) return "Drizzle";
  if (c === 56 || c === 57) return "Freezing Drizzle";
  if (c === 61 || c === 63 || c === 65) return "Rain";
  if (c === 66 || c === 67) return "Freezing Rain";
  if (c === 71 || c === 73 || c === 75) return "Snow";
  if (c === 77) return "Snow Grains";
  if (c === 80 || c === 81 || c === 82) return "Rain Showers";
  if (c === 85 || c === 86) return "Snow Showers";
  if (c === 95) return "Thunderstorm";
  if (c === 96 || c === 99) return "Thunderstorm with Hail";
  return "Unknown";
}

// Helper: fetch weather using Open‑Meteo (no API key required)
async function fetchWeatherByLatLon(lat, lon) {
  console.log("🌤️ fetchWeatherByLatLon called with:", { lat, lon });
  if (lat == null || lon == null || isNaN(lat) || isNaN(lon)) {
    console.error("❌ Invalid lat/lon provided:", { lat, lon });
    return null;
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&current=temperature_2m,weather_code`;
  console.log("🌐 Fetching weather from Open‑Meteo...");

  try {
    const resp = await fetch(url);
    console.log("📡 Weather API response status:", resp.status);
    if (!resp.ok) {
      const txt = await resp.text().catch(() => "");
      console.error("❌ Open‑Meteo API error:", resp.status);
      console.error("   Response:", txt.substring(0, 300));
      return null;
    }

    const data = await resp.json();
    console.log("📊 Open‑Meteo response data:", JSON.stringify(data).substring(0, 200));

    const tempC = data?.current?.temperature_2m;
    const code = data?.current?.weather_code;
    const condition = mapOpenMeteoCodeToCondition(code);

    if (tempC == null) {
      console.error("❌ Weather data missing temperature");
      return null;
    }

    console.log("✅ Weather data retrieved successfully:", { tempC, condition });
    return { tempC, condition, description: condition, city: "" };
  } catch (error) {
    console.error("❌ Weather fetch network error:", error.message);
    console.error("   Error stack:", error.stack?.substring(0, 200));
    return null;
  }
}

router.post("/", async (req, res) => {
  const { message, location } = req.body;
  const { token } = req.headers;
  
  console.log("=== Chatbot Request ===");
  console.log("Message:", message);
  console.log("Token provided:", token ? "Yes" : "No");
  console.log("Location received in body:", JSON.stringify(location));
  console.log("Full request body:", JSON.stringify(req.body));

  if (!geminiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY is missing on the server" });
  }

  try {
    const dishes = await foodModel.find().select("name category price description");
    
    let userPreferences = null;
    let userId = null;
    let weather = null;

    // If token is provided, try to get user preferences from order history
    if (token) {
      try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        userId = token_decode.id;
        
        // Fetch user's order history
        const userOrders = await orderModel.find({ userId: userId }).sort({ date: -1 }).limit(50);
        
        if (userOrders.length > 0) {
          userPreferences = analyzeUserPreferences(userOrders);
          console.log("User preferences analyzed:", {
            totalOrders: userPreferences.totalOrders,
            topItems: userPreferences.topItems.map(i => i.name),
            topCategories: userPreferences.topCategories.map(c => c.category)
          });
        }
      } catch (authError) {
        // If token is invalid, just proceed without user preferences
        console.log("Auth error (continuing without preferences):", authError.message);
      }
    }

    // Weather: use provided geolocation if available
    console.log("Checking location:", {
      location: location,
      isObject: typeof location === "object",
      hasLat: location?.lat != null,
      hasLon: location?.lon != null,
      latValue: location?.lat,
      lonValue: location?.lon
    });
    
    if (location && typeof location === "object" && location.lat != null && location.lon != null) {
      console.log("✅ Location valid, fetching weather for:", { lat: location.lat, lon: location.lon });
      weather = await fetchWeatherByLatLon(location.lat, location.lon);
      if (weather) {
        console.log("✅ Weather fetched successfully:", { temp: weather.tempC, condition: weather.condition, city: weather.city });
      } else {
        console.log("❌ Weather fetch returned null - check API key or network");
      }
    } else {
      console.log("⚠️ No valid location provided in request");
      if (location) {
        console.log("Location object structure:", Object.keys(location));
      }
    }

    // Build context with user preferences
    let context = `You are a friendly food recommendation assistant. Be concise and helpful.\n\nAvailable dishes: ${dishes
      .map((d) => `${d.name} (${d.category}) - $${d.price}`)
      .join(", ")}.\n\n`;

    // Add weather context if available
    if (weather && typeof weather.tempC === "number") {
      const temp = Math.round(weather.tempC);
      const condition = weather.condition;
      const city = weather.city;

      // Simple seasonal guidance
      let climateAdvice = "";
      const isHot = temp >= 30;
      const isCold = temp <= 15;
      const isRainy = /Rain|Thunderstorm|Drizzle/i.test(condition);

      if (isHot) {
        climateAdvice += "Focus on cool, refreshing items (iced drinks, salads, smoothies, frozen desserts). ";
      } else if (isCold) {
        climateAdvice += "Focus on warm, hearty items (soups, stews, spicy curries, hot beverages). ";
      } else {
        climateAdvice += "Balanced climate: suggest a mix; avoid extremes. ";
      }
      if (isRainy) {
        climateAdvice += "Rainy weather: comfort foods and warm snacks pair well.";
      }

      context += `Current weather near the user${city ? ` (${city})` : ""}: ${temp}°C, ${condition}.\nGuidance based on weather: ${climateAdvice}\n\n`;
    }
    // Note: Don't mention weather if unavailable - just proceed with other recommendations

    // Add personalized context based on user's order history
    if (userPreferences && userPreferences.totalOrders > 0) {
      const topItemsStr = userPreferences.topItems.map(i => `${i.name} (ordered ${i.count} times)`).join(", ");
      const topCategoriesStr = userPreferences.topCategories.map(c => `${c.category} (ordered ${c.count} times)`).join(", ");
      
      context += `User's Order History & Preferences:
- Total orders placed: ${userPreferences.totalOrders}
- Most frequently ordered items: ${topItemsStr}
- Favorite categories: ${topCategoriesStr}

Based on this order history, the user seems to prefer these types of food. When making recommendations, consider suggesting:
1. Items from their favorite categories: ${userPreferences.topCategories.map(c => c.category).join(", ")}
2. Similar dishes to their frequently ordered items: ${userPreferences.topItems.slice(0, 3).map(i => i.name).join(", ")}
3. New items that match their taste profile

\n\n`;
    } else {
      context += `The user hasn't placed orders yet or isn't logged in. Make general recommendations.\n\n`;
    }

    context += `User asked: "${message}"\n\nProvide helpful, personalized food recommendations based on the available dishes and user preferences (if available).`;

    // Try resolved model first, then common fallbacks, and try both v1 and v1beta
    const candidateModels = [
      resolvedModelName,
      "gemini-1.5-flash-8b",
      "gemini-1.5-flash",
      "gemini-1.5-pro"
    ].filter(Boolean);

    // Force v1 first to avoid v1beta 404s; only try v1
    const candidateVersions = ["v1"]; // if needed we can add v1beta later

    let reply = null;
    let lastError = null;
    outer:
    for (const modelName of candidateModels) {
      for (const version of candidateVersions) {
        try {
          const endpoint = `https://generativelanguage.googleapis.com/${version}/models/${modelName}:generateContent?key=${encodeURIComponent(geminiKey)}`;
          console.log("Chatbot trying:", { modelName, version });
          const resp = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [{ text: context }]
                }
              ]
            })
          });
          if (!resp.ok) {
            const text = await resp.text();
            throw new Error(`HTTP ${resp.status}: ${text}`);
          }
          const data = await resp.json();
          reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) break outer;
        } catch (modelErr) {
          lastError = modelErr;
          const msg = String(modelErr?.message || "");
          // Try next combo on 404/model unsupported or rate limit
          if (
            msg.includes("Not Found") ||
            msg.includes("not found") ||
            msg.includes("is not supported") ||
            msg.includes("Too Many Requests") ||
            msg.includes("quota") ||
            msg.includes("exceeded your current quota")
          ) {
            continue;
          }
          // Otherwise, rethrow immediately
          throw modelErr;
        }
      }
    }

    if (!reply) {
      if (lastError) {
        const msg = String(lastError?.message || "");
        if (
          msg.includes("Too Many Requests") ||
          msg.includes("quota") ||
          msg.includes("exceeded your current quota")
        ) {
          return res.status(429).json({ error: "AI rate limit reached. Please wait a moment and try again." });
        }
        throw lastError;
      }
      reply = "Sorry, I could not generate a reply.";
    }

    res.json({ reply });
  } catch (error) {
    console.error("🧠 Chatbot Error Occurred!");
    console.error("➡️ Error Name:", error?.name);
    console.error("➡️ Error Message:", error?.message);
    // Avoid printing full secret or long stack
    const message = String(error?.message || "");
    if (message.includes("API key expired") || message.includes("API_KEY_INVALID")) {
      return res.status(500).json({ error: "AI API key is invalid or expired. Please update GEMINI_API_KEY on the server." });
    }
    console.error("➡️ Stack Trace:", error?.stack);

    res.status(500).json({ error: "Internal Server Error — Failed to generate chatbot response." });
  }
});

// Optional: Route that requires authentication (if you want a separate endpoint)
router.post("/personalized", authMiddleware, async (req, res) => {
  // This route uses the same logic but requires authentication
  // For now, the main route handles both authenticated and non-authenticated users
  const { message } = req.body;
  // Reuse the main route logic (could refactor later if needed)
  // For now, just redirect to main handler
  return res.status(501).json({ error: "Use the main /api/chatbot endpoint with token in headers" });
});

export default router;
