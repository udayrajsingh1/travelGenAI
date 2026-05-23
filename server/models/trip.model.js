import mongoose, { Mongoose } from "mongoose";

const activitySchema = new mongoose.Schema(
    {
        time: { type: String },
        name: { type: String },
        description: { type: String },
        estimatedCost: { type: Number }, 
        category: { type: String },    
        tips: { type: String },

    },
    {
        _id: false
    }
)

const dayPlanSchema = mongoose.Schema(
    {
        day: { type: Number },
        theme: { type: String },
        morning: [activitySchema],
        afternoon: [activitySchema],
        evening: [activitySchema]
    },
    {
        _id: false
    }
)

const budgetBreakdownSchema = new mongoose.Schema(
  {
    accommodation: { type: Number, default: 0 },
    food: { type: Number, default: 0 },
    activities: { type: Number, default: 0 },
    transport: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },
    notes: { type: String },
  },
  { _id: false }
);


const tripSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        destination: {
            type: String,
            required: [true, "Destination is required"]
        },
        duration: {
            type: Number,
            required: true,
            min: [1, "Trip must be at least 1 day"],
            max: [30, "Trip cannot exceed 30 days"],
        },
        budgetTier: {
            type: String,
            enum: ["budget", "moderate", "luxury"],
            required: true,
        },
        travelers: {
            type: String,
            enum: ["Solo", "couple", "family", "group"],
            required: true,
        },


        title: { type: String },        
        summary: { type: String },      
        bestTimeToVisit: { type: String },
        localTips: { type: [String], default: [] },
        itinerary: [dayPlanSchema],     
        budgetBreakdown: budgetBreakdownSchema,

        status: {
            type: String,
            enum: ["generating", "completed", "failed"],
            default: "generating",
        },

        isFavorited: {
            type: Boolean,
            default: false,
        },


    }
);

tripSchema.index({ owner: 1, createdAt: -1 });
tripSchema.index({ owner: 1, status: 1 });


const Trip = mongoose.model("Trip", tripSchema);
export default Trip;