import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            maxlength: 50
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false
        },
        avatar: {
            type: String,
            default: ""
        },
        savedTrips: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Trip",
            }
        ]

    },
    {
        timestamps: true,
    }
)

userSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password);
    next();
})

userSchema.methods.matchPassword = async function (candidatePassword){
    return await bcrypt.compare(this.password, candidatePassword)
}

export const User = mongoose.model("User", userSchema)