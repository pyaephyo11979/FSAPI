const mongoose= require("mongoose");
const ProductModel= mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    images:{
        type:[String],
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    category:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
    }],
    stock:{
        type:Number,
        required:true,
    },
    isAvailable:{
        type:Boolean,
        default:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    updatedAt:{
        type:Date,
        default:Date.now,
    },
})

module.exports= mongoose.model("Product", ProductModel)
