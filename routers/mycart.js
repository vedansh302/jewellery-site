const express = require("express")
const app = express()
const router = express.Router()
const CartModel = require('../models/Cart')
const productModel = require('../models/Products')

const authmiddleware = require('../middlewares/auth')
const getuser = require('../middlewares/getuser')

const cookieParser = require("cookie-parser")
app.use(cookieParser())


router.get("/", getuser, authmiddleware, async (req, res) => {
    const userId = req.user


    try {
        const cart = await CartModel.findOne({ userId })
        res.render("mycart", { products: cart, user: req.account })
    } catch (error) {

    }
})


router.post('/add', getuser, authmiddleware, async (req, res) => {
    const userId = req.user;
    const { productId } = req.body;

    try {
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let cart = await CartModel.findOne({ userId: userId });
        if (!cart) {
            cart = new CartModel({
                userId: userId,
                items: [{
                    productId: product._id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    totalPrice: product.price * 1 
                }]
            });
        } else {
            // Check if the product already exists in the cart
            const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
            if (itemIndex > -1) {
                // If product exists, increase its quantity and recalculate totalPrice
                cart.items[itemIndex].quantity += 1;
                cart.items[itemIndex].totalPrice = cart.items[itemIndex].price * cart.items[itemIndex].quantity;
            } else {
                // If product doesn't exist, add it with price, quantity 1, and calculate totalPrice
                cart.items.push({
                    productId: product._id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    totalPrice: product.price * 1 
                });
            }
        }
        await cart.save();

        res.status(200).send("Your product was added successfully. Please check your cart.");
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;
