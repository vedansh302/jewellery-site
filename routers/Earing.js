const express = require('express')
const app = express()
const productModel = require('../models/Products')
const router = express.Router()
const getuser = require('../middlewares/getuser') 
const cookieParser = require("cookie-parser")
app.use(cookieParser())


router.get('/',getuser ,async (req,res)=>{
    try{
        const earring = await productModel.find({ category:"Earings"})
        res.render("earing",{products : earring ,user: req.account})
    }catch(error){
        console.log(error)
        res.status(500).send("Internal Server Error")
    }
})

module.exports = router