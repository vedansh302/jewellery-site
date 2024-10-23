const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'registration', 
        required: true 
    },
    items: [
        {
            productId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Products', 
                required: true 
            },
            name: { 
                type: String, 
                required: true 
            },
            price: { 
                type: Number, 
                required: true 
            },
            quantity: { 
                type: Number, 
                default: 1 
            },
            totalPrice: {
                type: Number,
                required: true
            }
        },
    ],
});

module.exports = mongoose.model('Cart', cartSchema);
