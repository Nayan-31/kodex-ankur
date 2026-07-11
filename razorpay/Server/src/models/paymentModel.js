import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        value: {
            type: Number,
            required: true,
            min: 0
        },
        currency: {
            type: String,
            required: true,
            trim: true,
            default: 'INR'
        }
    },
    status: {
        type: String,
        enum: [ 'pending', 'completed', 'failed' ],
        default: 'pending'
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
                default: 1
            }
        }
    ],
    razorpayDetails: {
        orderId: {
            type: String,
            trim: true
        },
        paymentId: {
            type: String,
            trim: true
        },
        signature: {
            type: String,
            trim: true
        }
    }
}, {
    timestamps: true
})

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;