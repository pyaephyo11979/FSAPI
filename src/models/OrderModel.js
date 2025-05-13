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
        enum:["K-pay","Wave Pay","Aya pay", "Cash on Delivery"],
        default:"K-pay",
    },
    orderStatus:{
        type:String,
        enum:["Pending", "Shipped", "Delivered", "Cancelled"],
        default:"Pending",
    },
    orderNumber:{
        type:String,
        unique:true,
        required:true,
    },
}, {
    timestamps:true
})
module.exports= mongoose.model("Order", OrderModel)