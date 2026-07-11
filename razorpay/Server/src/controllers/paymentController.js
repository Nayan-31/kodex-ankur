import { createOrder } from '../services/payement.js';
import Cart from '../models/Cart.js';
import Payment from '../models/paymentModel.js';
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";

/**
 * POST /api/payments
 * @description Create a Payment for the user's cart using Razorpay API
 */
export const createPayment = async (req, res) => {

    const user = req.userId;

    const cart = await Cart.findOne({ user }).populate('items.product');


    const totalAmount = cart.items.reduce((total, item) => {
        return total + item.product.price * item.quantity;
    }, 0);

    const order = await createOrder(totalAmount, "INR");

    const payment = Payment.create({
        user,
        amount: {
            value: totalAmount,
            currency: "INR"
        },
        razorpayDetails: {
            orderId: order.id
        },
        products: cart.items.map(item => ({
            product: item.product._id,
            quantity: item.quantity
        }))
    })

    return res.status(201).json({
        message: 'Payment created successfully',
        data: {
            order
        }
    });
}


/**
 * POST /api/payments/verify
 * @description Verify the payment using Razorpay API
 */
export const verifyPayment = async (req, res) => {

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;


    const isPaymentValid = await validatePaymentVerification({
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
    }, razorpay_signature, process.env.RAZORPAY_KEY_SECRET);

    if (!isPaymentValid) {
        return res.status(400).json({ message: 'Payment verification failed' });
    }

    const payment = await Payment.findOne({ 'razorpayDetails.orderId': razorpay_order_id, status: 'pending' });

    if (!payment) {
        return res.status(404).json({ message: 'Payment not found or already verified' });
    }

    payment.status = 'completed';
    payment.razorpayDetails.paymentId = razorpay_payment_id;
    payment.razorpayDetails.signature = razorpay_signature;
    await payment.save();

    /**
     * TODO: Clear the user's cart after successful payment
     * TODO: Update the stock of the purchased products
     * TODO: Start Shipping process for the purchased products
     */

    return res.status(200).json({
        message: 'Payment verified successfully',
        data: {
            payment
        }
    });
}