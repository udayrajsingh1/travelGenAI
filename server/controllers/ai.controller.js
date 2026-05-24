
import asyncHandler from "express-async-handler";
import { generateItinerary } from "../services/geminiServices.js";
import Trip from "../models/trip.model.js";
import User from "../models/user.model.js";

export const generate = asyncHandler(async (req, res) => {
  
  const {
    destination,
    duration,
    budgetTier,
    travelers,
    travelPace,
    interests,
    dietaryRestrictions,
  } = req.body;
 
  
  if (!destination || !duration || !budgetTier || !travelers) {
    res.status(400);
    throw new Error("destination, duration, budgetTier, and travelers are required");
  }
 
  
  const durationNum = parseInt(duration, 10);
  if (isNaN(durationNum) || durationNum < 1 || durationNum > 30) {
    res.status(400);
    throw new Error("duration must be a number between 1 and 30");
  }
 

  const validBudgets   = ["budget", "moderate", "luxury"];
  const validTravelers = ["solo", "couple", "family", "group"];
  const validPaces     = ["relaxed", "active", "packed"];
 
  if (!validBudgets.includes(budgetTier)) {
    res.status(400);
    throw new Error(`budgetTier must be one of: ${validBudgets.join(", ")}`);
  }
  if (!validTravelers.includes(travelers)) {
    res.status(400);
    throw new Error(`travelers must be one of: ${validTravelers.join(", ")}`);
  }
 
  
  const trip = await Trip.create({
    owner: req.user._id,
    destination:         destination.trim(),
    duration:            durationNum,
    budgetTier,
    travelers,
    travelPace:          travelPace || "active",
    interests:           Array.isArray(interests) ? interests : [],
    dietaryRestrictions: dietaryRestrictions || "none",
    status:              "generating",
  });
 
  
  let aiData;
  try {
    aiData = await generateItinerary({
      destination: destination.trim(),
      duration: durationNum,
      budgetTier,
      travelers,
      travelPace: travelPace || "active",
      interests:  Array.isArray(interests) ? interests : [],
      dietaryRestrictions: dietaryRestrictions || "none",
    });
  } catch (aiError) {
    
    await Trip.findByIdAndUpdate(trip._id, { status: "failed" });
    throw new Error(`AI generation failed: ${aiError.message}`);
  }
 
  
  const updatedTrip = await Trip.findByIdAndUpdate(
    trip._id,
    {
      title:           aiData.title,
      summary:         aiData.summary,
      bestTimeToVisit: aiData.bestTimeToVisit,
      localTips:       aiData.localTips,
      itinerary:       aiData.itinerary,
      budgetBreakdown: aiData.budgetBreakdown,
      status:          "completed",
    },
    { new: true }
  );
 
  
  await User.findByIdAndUpdate(req.user._id, {
    $push: { savedTrips: updatedTrip._id },
  });
 
  
  res.status(201).json({
    success: true,
    data: updatedTrip,
  });
});
 

