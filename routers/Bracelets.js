const express = require('express');
const app = express()
const ProductModel = require('../models/Products');
const router = express.Router();
const getuser = require('../middlewares/getuser')
const cookieParser = require("cookie-parser")
app.use(cookieParser())


router.get("/", getuser, async (req, res) => {
    try {
        const braceletProduct = await ProductModel.find({ category: "Bracelets" });
        res.render("bracelets", { products: braceletProduct, user: req.account });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});


module.exports = router;
