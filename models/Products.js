// const { number } = require('joi');
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    }
    ,description:{
        type:String,
        required:true
    },
    richDescription:{
        type:String,
        default:''
    },
    image:{
        type:String,
        default:'',
        data:Buffer
    },
    countInStock:{
        type:Number,
        required:true
    },
    brand:{
        type:String,
        default:''
    },
    price:{
        type:Number,
        default:0
    },
    makingCharges:{
        type:Number,
        default:0
    },
    category:{
        type:String,
        required:true
    },


})

const productModel = mongoose.model('Products', ProductSchema);
module.exports = productModel