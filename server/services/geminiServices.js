import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


const itinerarySchema = {
  type: "object",
  properties: {
    title: {
      type: "string",
      description: "Catchy trip title e.g. '7 Days of Magic in Kyoto'",
    },
    summary: {
      type: "string",
      description: "2-3 sentence overview of the trip experience",
    },
    bestTimeToVisit: {
      type: "string",
      description: "Best season/month to visit this destination",
    },
    localTips: {
      type: "array",
      items: { type: "string" },
      description: "3-5 practical local insider tips",
    },
    budgetBreakdown: {
      type: "object",
      properties: {
        accommodation: { type: "number", description: "Total accommodation cost in USD" },
        food:          { type: "number", description: "Total food cost in USD" },
        activities:    { type: "number", description: "Total activities cost in USD" },
        transport:     { type: "number", description: "Total local transport cost in USD" },
        total:         { type: "number", description: "Sum of all costs in USD" },
        currency:      { type: "string" },
        notes:         { type: "string", description: "Budget notes or caveats" },
      },
      required: ["accommodation", "food", "activities", "transport", "total", "currency"],
    },
    itinerary: {
      type: "array",
      description: "One entry per day of the trip",
      items: {
        type: "object",
        properties: {
          day:   { type: "number" },
          theme: { type: "string", description: "Theme for the day e.g. 'Temples & History'" },
          morning: {
            type: "array",
            items: {
              type: "object",
              properties: {
                time:          { type: "string" },
                name:          { type: "string" },
                description:   { type: "string" },
                estimatedCost: { type: "number" },
                category:      { type: "string" },
                tips:          { type: "string" },
              },
              required: ["time", "name", "description", "estimatedCost", "category"],
            },
          },
          afternoon: {
            type: "array",
            items: {
              type: "object",
              properties: {
                time:          { type: "string" },
                name:          { type: "string" },
                description:   { type: "string" },
                estimatedCost: { type: "number" },
                category:      { type: "string" },
                tips:          { type: "string" },
              },
              required: ["time", "name", "description", "estimatedCost", "category"],
            },
          },
          evening: {
            type: "array",
            items: {
              type: "object",
              properties: {
                time:          { type: "string" },
                name:          { type: "string" },
                description:   { type: "string" },
                estimatedCost: { type: "number" },
                category:      { type: "string" },
                tips:          { type: "string" },
              },
              required: ["time", "name", "description", "estimatedCost", "category"],
            },
          },
        },
        required: ["day", "theme", "morning", "afternoon", "evening"],
      },
    },
  },
  required: [
    "title", "summary", "bestTimeToVisit", "localTips",
    "budgetBreakdown", "itinerary",
  ],
};

// ─── PROMPT BUILDER ───────────────────────────────────────────────────────────
/**
 * buildPrompt()
 * Converts the raw form data into a detailed, unambiguous instruction string.
 *
 * Prompt Engineering Principles used here:
 *  1. ROLE ASSIGNMENT  — Tell the model what expert it is ("You are a luxury travel planner")
 *  2. CONTEXT INJECTION— Inject all user inputs clearly, labeled
 *  3. EXPLICIT RULES   — Tell it exactly what to do AND what NOT to do
 *  4. FORMAT LOCK      — Reinforce the JSON contract in the prompt text too
 *  5. CALIBRATION      — Give it anchor examples for budget tiers and pace
 *
 * @param {Object} formData 
 * @returns {string}        
 */
const buildPrompt = (formData) => {
  const {
    destination,
    duration,
    budgetTier,
    travelers,
    travelPace,
    interests,
    dietaryRestrictions,
  } = formData;

  
  const budgetAnchors = {
    budget: {
      accommodation: "hostels, guesthouses, budget hotels (₹600–₹1000/night)",
      food: "street food, local eateries, markets (₹200–₹500/meal)",
      activities: "free sights, self-guided walks, cheap entry museums",
    },
    moderate: {
      accommodation: "3-star hotels, boutique guesthouses (₹1100–₹2500/night)",
      food: "casual restaurants, local favorites, occasional nice dinner (₹400–₹800/meal)",
      activities: "guided tours, popular attractions, day trips (₹0–₹2000/activity)",
    },
    luxury: {
      accommodation: "4-5 star hotels, luxury resorts, premium stays (₹2600–₹5000+/night)",
      food: "fine dining, celebrity chef restaurants, curated experiences (₹600–₹1000+/meal)",
      activities: "private guides, exclusive experiences, VIP access (₹0–₹3000+/activity)",
    },
  };

  
  const paceGuide = {
    relaxed: "2-3 activities per time slot (morning/afternoon/evening). Include rest time, slow mornings, long lunches.",
    active:  "3-4 activities per time slot. Balanced mix of sightseeing and exploration.",
    packed:  "4-5 activities per time slot. Maximize every hour. Early starts, late evenings.",
  };

  const anchor = budgetAnchors[budgetTier];
  const pace   = paceGuide[travelPace] || paceGuide["active"];
  const interestList = Array.isArray(interests) && interests.length > 0
    ? interests.join(", ")
    : "general sightseeing";

  return `
You are an expert travel planner with 20 years of experience crafting personalized itineraries worldwide.
Your task is to create a complete, realistic, and highly detailed travel itinerary.

TRIP PARAMETERS:
- Destination: ${destination}
- Duration: ${duration} days
- Budget Tier: ${budgetTier}
- Travelers: ${travelers}
- Travel Pace: ${travelPace}
- Primary Interests: ${interestList}
- Dietary Restrictions: ${dietaryRestrictions || "none"}

BUDGET CALIBRATION FOR THIS TRIP:
- Accommodation: ${anchor.accommodation}
- Food: ${anchor.food}
- Activities: ${anchor.activities}

PACE CALIBRATION:
- ${pace}

STRICT RULES — follow every one:
1. Every activity MUST have a realistic estimatedCost in INR (use 0 for free activities).
2. Recommend REAL, SPECIFIC places — actual restaurant names, real monument names, real neighborhoods. No generic placeholders like "visit a local restaurant".
3. Food recommendations MUST respect the dietary restriction: "${dietaryRestrictions || "none"}".
4. Each day MUST have a distinct theme that reflects that day's character.
5. The budgetBreakdown.total MUST equal the sum of accommodation + food + activities + transport.
6. Budget numbers must be realistic and consistent with the ${budgetTier} tier.
7. Tailor ALL recommendations to ${travelers} travelers — a solo traveler and a family get completely different experiences.
8. The localTips array must contain practical, actionable tips specific to ${destination} — not generic travel advice.
9. Generate exactly ${duration} day objects in the itinerary array — no more, no less.
10. Return ONLY valid JSON matching the provided schema. No markdown, no explanation, no code fences.
`.trim();
};

// ─── MAIN EXPORTED FUNCTION ───────────────────────────────────────────────────
/**
 * generateItinerary()
 *
 * This is the single function the controller calls.
 * It orchestrates: build prompt → call Gemini → parse response → return data.
 *
 * @param {Object} formData 
 * @returns {Object}        
 * @throws {Error}          
 */
export const generateItinerary = async (formData) => {
  const prompt = buildPrompt(formData);

  const response = await genAI.models.generateContent({
    model: "gemini-2.5-flash",       
    contents: prompt,
    config: {
      temperature: 0.8,             
      maxOutputTokens: 8192,        
      responseMimeType: "application/json",
      responseSchema: itinerarySchema,
    },
  });

  
  const rawText = response.text;

  if (!rawText) {
    throw new Error("Gemini returned an empty response");
  }

  
  let itinerary;
  try {
    itinerary = JSON.parse(rawText);
  } catch {
    throw new Error(`Gemini response was not valid JSON: ${rawText.slice(0, 200)}`);
  }

  return itinerary;
};