const mongoose = require('mongoose');

const pharmacySchema = mongoose.Schema({
    UserName:{
        type: String,
        required: true,
    },
    itemName: {
        type: String,
        required: true,
    },
    quantity: {
        type: String,
        required: true,
    },
    totalPrice: {
        type: String,
        required: true,
    },
    modeCOD: {
        type: Boolean,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Order Received'],
        default: 'Pending' 
      }
}, {
    timestamps: true
});

module.exports = mongoose.model('Purchase', pharmacySchema);
