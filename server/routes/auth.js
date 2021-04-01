const express = require("express");
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")

const crypto = require("crypto")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} =require('../keys') 
const requireLogin = require('../middleware/requireLogin')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:"SG.FTBuY-wYQReg-BIlvtj9lQ.KEYviXqfjKen1tvpBH5A4NDGIf5TXOGRxfsfTYidTOkaPI"
    }
}))

router.post('/signup', (req,res) => {
    const {name, email, password, profilePic} = req.body
    if(!email || !password || !name){
        // console.log(res.status(422))
       return res.status(422).json({error:"Please add the fields"})
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"user already exixts"})
        }
        bcrypt.hash(password,12)
        .then(hashedpassword => {
            const user = new User({
                email,
                password:hashedpassword,
                name,
                profilePic
            })
    
            user.save()
            .then(user => {
                transporter.sendMail({
                    to:user.email,
                    from: "007uddeshsonawane@gmail.com",
                    subject:"Signup success",
                    html:"<h2>Welcome to Discussion Forum</h2>"
                })
                res.json({message:"Saved successfully"})
            })
            .catch(err => {
                console.log(err)
            })
        })  
    })
    .catch(err => {
        console.log(err)
    })
})

router.post('/signin', (req,res)=>{
    const {email, password} = req.body
    if(!email ||!password){
        res.status(422).json({error:"Please enter email or password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"Invalid email or password"})
        }
        bcrypt.compare(password, savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                // res.json({message:"Successfuly signed in"})
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                const {_id, name,email, profilePic} = savedUser
                res.json({token, user:{_id, name, email, profilePic}})
            }
            else{
                res.status(422).json({error:"Invalid email or password"})
            }
        })
        .catch(err => {
            console.log(err)
        })
    })
})


router.post('/reset-password', (req,res)=>{
    crypto.randomBytes(32, (err,buffer)=>{
        if(err){
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.status(422).json({err: "User does not exists"})
            }
            user.resetToken = token
            user.expireToken = Date.now()+ 3600000  //1sec = 1000
            user.save().then((result)=>{
                transporter.sendMail({
                    to:user.email,
                    from:"007uddeshsonawane@gmail.com",
                    subject:"Reset password",
                    html:`<p>As per your request to reset password</P>
                        <h5>click the <a href="http://localhost:3000/reset/${token}">link </a> to reset password<h5>
                    `
                })
                res.json({message:"check your email"})
                

            })
        })
    })
})

router.post('/new-password',(req, res)=>{
    const newPasword = req.body.password
    const sentToken = req.body.token
    User.findOne({resetToken:sentToken, expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.sendStatus(422).json({eror:"Session expired. Try again"})
        }
        bcrypt.hash(newPasword,12).then(hashedpassword=>{
            user.password=hashedpassword
            user.resetToken = undefined
            user.expireToken = undefined
            user.save().then((savedUser)=>{
                res.json({message:"Password updated successfully"})
            })
        })
    }).catch(err=>{
        console.log(err)
    })
})


module.exports = router
