const mongoose= require("mongoose");
const OrderModel= mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    products:[{
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product",
            required:true,
        },
        quantity:{
            type:Number,
            required:true,
        },
    }],
    totalPrice:{
        type:Number,
        required:true,
    },
    shippingAddress:{
        address:{
            type:String,
            required:true,
        },
        city:{
            type:String,
            required:true,
        },
        state:{
            type:String,
            required:true,
        },
        country:{
            type:String,
            required:true,
        },
        zipCode:{
            type:String,
            required:true,
        },
    },
    paymentMethod:{
        type:String,
        enum:["Credit Card", "PayPal", "Cash on Delivery"],
        default:"Credit Card",
    },
    orderStatus:{
        type:String,
        enum:["Pending", "Shipped", "Delivered", "Cancelled"],
        default:"Pending",
    },
}, {
    timestamps:true
})
module.exports= mongoose.model("Order", OrderModel)