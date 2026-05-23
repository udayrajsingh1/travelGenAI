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

userSchema.pre("save", async function (){
    if(!this.isModified("password")){
        return;
    }    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
    
})

userSchema.methods.matchPassword = async function (candidatePassword){
    return await bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model("User", userSchema)
export default User;