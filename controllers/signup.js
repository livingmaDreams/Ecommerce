

const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//const Razorpay = require('razorpay');

exports.getSignupPage =(req,res,next) =>{
    if(req.originalUrl == '/signup')
     res.sendFile(path.join(__dirname,`../views${req.originalUrl}.html`));
}

const User = require('../models/users.js');

exports.addUser =  async (req,res,next) => {
    
    const name = req.body.name;
    const mail = req.body.mail;
    const password = req.body.password;
try{
    bcrypt.hash(password,10,async (err,hash) => {
       let user = await User.findOne({mail : mail});
       if(user){
        res.status(200).json({existingUser: 'found'});
       }
       else {
         user = new User({
            name: name,
            mail: mail,
            password: hash
         })
         const data = await user.save();
          res.status(201).json({newUseradded: 'success'});
       }
    })
}  
catch(err){
    res.status(500).json({status:'failure'});
}
}

exports.getLoginPage = (req,res,next) =>{
    if(req.originalUrl == '/login')
    res.sendFile(path.join(__dirname,`../views${req.originalUrl}.html`));
}

function generateToken(id){
    return jwt.sign({userid: id},process.env.JWT_TOKEN);
}

exports.loginUser = async (req,res,next) =>{
    const mail = req.body.mail;
    const password = req.body.password;
    try{
        const data = await User.findOne({mail:mail});
        bcrypt.compare(password,data.password,(err,result) =>{
            if(err)
              res.status(500).json({status:'something went wrong'});
            if(result === false)
            res.status(401).json({status:'wrongpassword'});
            else
            res.status(200).json({status:'userfound',token: generateToken(data._id),cart: data.cart});
        })        
      }
    catch(err){
        res.status(404).json({status:'usernotfound'})
    }
}




