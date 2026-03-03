const mongoose=require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userName: { type: String, reuired:true,
        trim:true },
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        trim:true,
        required:true,
        select: false
    },

    refreshTokens: [
    {
      token: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
passwordResetToken: String
}, { timestamps: true })

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ userName: 1 }, { unique: true });

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password,12)
    next()
})

userSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password)
}
module.exports = mongoose.model("User", userSchema)