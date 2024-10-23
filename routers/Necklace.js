const express = require('express');
const app = express()
const ProductModel = require('../models/Products');
const router = express.Router();
const getuser = require('../middlewares/getuser') 
const cookieParser = require("cookie-parser")
app.use(cookieParser())


router.get("/", getuser, async (req, res) => {
    try {
        const necklaceProducts = await ProductModel.find({ category: "Necklace" });
        res.render("necklace", { products: necklaceProducts, user: req.account });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
