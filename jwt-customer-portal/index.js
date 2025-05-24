//index.js
const express = require('express');
const jwt = require('jsonwebtoken')
const app = express()
const secretKey = 'yourSecretKey'//Replace with  your own secret key 

app.use(express.json());
//sample user data
const users =[];

//Endpoint for user registration
app.post('/register',(req,res)=>{
    const {username,password} =req.body;

    //check if the username already exits
    const existingUser = users.find((u)=>u.username === username);
    if(existingUser){
        return res.status(400).json({message:'Username already exits'});   
    }
    //Add new users to the database
    const newUser = {
        id: users.length +1,
        username,
        password,
    };
    users.push(newUser);
    res.status(201).json({message:'User registered successfully'});
});

//EndPoint logic of userlogin
app.post('/login',(req,res)=>{
    const {username,password} =req.body;

    //Find User by UserName and Password
    const user = users.find((u)=>u.username === username && u.password === password);

    if(user){
        //use authenticated,generate token 
        const token = jwt.sign({id:user.id,username:user.username},secretKey);
        res.json({token});
    }else{
        res.status(401).json({message:'Invalid credentials'});
    }
});

//Protected route example (dashboard access)
app.get('/dashboard',verifyToken,(req,res)=>{
    //Return dashboard data or user-specific information
   res.json({message:"welcome to the Customer Portal!"});
});

//Middleware to verify token
function verifyToken(req,res,next){
    const token = req.headers['authorization'];

    if(typeof token !== 'undefined'){
        jwt.verify(token,secretKey,(err,authData)=>{
            if(err){
                res.sendStatus(403);
            }else{
                req.authData =authData;
                next();
            }
        });
    }else{
        res.sendStatus(401);
    }
}

//Start server
const PORT = 3000;
app.listen(PORT,()=>{
    console.log(`Server Running on the port ${PORT} `);
});

