const mongose = require('mongoose')

const userSchema = new mongose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    resetToken:String,
    expireToken:Date,
    profilePic:{
        type:String,
        default:"https://res.cloudinary.com/kalpesh-uddesh/image/upload/v1616680380/user_rvxjke.png"
    }
})

mongose.model("User", userSchema)