const mongoose= require("mongoose");
const CartModel= mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    products:[{
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product",
        },
        quantity:{
            type:Number,
            default:1,
        },
    }],
    totalPrice:{
        type:Number,
        default:0,
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

module.exports= mongoose.model("Cart", CartModel)