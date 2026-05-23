import asyncHandler from "express-async-handler";
import Trip from "../models/trip.model.js";
import User from "../models/user.model.js";



export const getMyTrips = asyncHandler((req, res) => {
    const trips = await Trip.find({ owner: req.user._id })
    .sort({ createdAt: -1 })
    .select("-itinerary") 
    .lean(); 
 
    res.status(200).json({
        success: true,
        count: trips.length,
        data: trips,
    });

})

export const getTripById = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);
 
  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }
 
  if (trip.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to access this trip");
  }
 
  res.status(200).json({
    success: true,
    data: trip,
  });
});


export const deleteTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);
 
  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }
 
  if (trip.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this trip");
  }
 
  
  await trip.deleteOne();

  await User.findByIdAndUpdate(req.user._id, {
    $pull: { savedTrips: trip._id },
  });
 
  res.status(200).json({
    success: true,
    message: "Trip deleted successfully",
  });
});


export const toggleFavorite = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);
 
  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }
 
  if (trip.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }
 
  
  trip.isFavorited = !trip.isFavorited;
  await trip.save();
 
  res.status(200).json({
    success: true,
    data: { isFavorited: trip.isFavorited },
  });
});
