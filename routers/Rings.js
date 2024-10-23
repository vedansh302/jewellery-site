const express = require('express')
const app = express()
const router = express.Router()
const productModel = require('../models/Products')
const getuser = require('../middlewares/getuser')
const cookieParser = require("cookie-parser")
app.use(cookieParser())

router.get('/',getuser,async(req,res)=>{
    try{
        const rings = await productModel.find({category:"Rings"})
        res.render("rings",{products:rings,user:req.account})
        // console.log(req.account)    
    }
    catch(error){
        console.log(error)
        req.status(500).send("Internal Server Error")
    }
})

module.exports = router