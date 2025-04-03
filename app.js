require('dotenv').config();

const express=require('express');
const app=express();
const mongoose=require('mongoose');
const cors=require('cors');

const UserRouter=require('./routes/UserRouter');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/user',UserRouter);

const port=process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI).then(()=>{
    app.listen(port,()=>{
        console.log(`Server is running on port ${port}`);
    });
}).catch((err)=>{
    console.log(err);
})