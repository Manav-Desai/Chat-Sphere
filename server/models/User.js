import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({

    name: {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password: {
        type : String,
        required : true,
    },
    pic : {
        type : String,
        default : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    }
  },
  { timestamps: true }
);

userSchema.pre("save" , async function (next) {

    if(!this.isModified("password"))
    {
        return next();
    }
    console.log("Enrypting the password : ");

    this.password = await bcrypt.hash(this.password , 10);
    console.log("Encrypted Password : " + this.password);
});

userSchema.methods.isPasswordCorrect = async function (password){

    // becrypt.compare(userpassword,encryptedpassword) will return true or false .
    /*
    It will return the value true or false based on comparing the userpassword with that
    of stored in db in encrypted form .

    this.password refers to stored in db and password is provided by user along with request
    */
    
    const result = await bcrypt.compare(password , this.password);
    return result;
}

export const User = mongoose.model("User", userSchema);
