const express = require('express');
const router = express.Router()
const mongoose = require('mongoose');
const User = mongoose.model("User")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../keys');
const requireLogin= require('../middlwares/requireLogin')


router.get('/protected',requireLogin,(req,res) =>{
    res.send("Hello")
})
router.post('/signup',(req,res) => {
    const {name,email,password} = req.body
    if(!email || !password || !name ){
        return res.status(422).json({error:"Please add all the fields"})
    }
    User.findOne({email:email})
    .then((savedUser) => {
        if(savedUser){
            return res.status(422).json({error:"user already exists"})
        }
        bcrypt.hash(password,12)
        .then( hashedPassword => {
            const user = new User({
                email,
                name,
                password:hashedPassword
            })
            user.save()
            .then( user =>{
                res.json({message:"saved succesfully"})
            })
        .   catch( err => {
                console.log(err);

            })
        })
        
    })
    .catch(err => {
        console.log(err);
        
    })
})

router.post('/signin',(req,res) =>{
    const {email,password} = req.body
    if(!email || !password){
        return res.status(422).json({error:"Add email and password"})
    }
    User.findOne({email:email})
    .then( savedUser =>{
        if(!savedUser){
            return res.status(422).json({error:"Invalid email and password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(matchPassword =>{
            if(matchPassword){
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                res.json({token})
            }
            else{
                return res.status(422).json({error:"Invalid email and password"})

            }
        })
        .catch( err =>{
            console.log(err)
        })
    })
})
module.exports = router