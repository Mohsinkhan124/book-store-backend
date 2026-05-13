import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Bina next ke - direct function
userSchema.pre("save", function() {
  if (!this.isModified("password")) {
    return;
  }
  
  const salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const userModel = mongoose.model("bookstore_user", userSchema);
export default userModel;

//  Admin kaise banega?
// Ya fir terminal mein (MongoDB shell):
// db.bookstore_users.updateOne(
//   { email: "mohsins@test.com" },
//   { $set: { role: "admin" } }
// )