const express = require('express');
const router = express.Router()
const mongoose = require('mongoose');
const Post = mongoose.model("Post")
const requireLogin = require('../middlwares/requireLogin')

router.post('/createpost',requireLogin,(req,res) => {
    const {title,body} = req.body
    if(!title || !body){
        return res.status(401).json({error:"Add all fields"})
    }
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        postedBy:req.user
    })
    post.save().then( result =>{
        res.json({post:result})
    })
    .catch(err =>{
        console.log(err);
        
    })
})

router.get('/allposts',requireLogin,(req,res) => {
    Post.find().populate("postedBy","_id name")
    .then( posts =>{
        res.json({posts})
    })
    .catch(err =>{
        console.log(err);
        
    })
})

router.get('/mypost',requireLogin,(req,res) => {
    Post.find({postedBy:req.user._id}).
    populate("postedBy","_id name")
    .then(myposts =>{
        res.json({myposts})
    })
    .catch(err =>{
        console.log(err);
        
    })
})
module.exports = router; 