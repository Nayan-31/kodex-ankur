import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  return cart;
};

export const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.userId }).populate('items.product');

    if (!cart) {
      return res.json({ user: req.userId, items: [] });
    }

    return res.json(cart);
  } catch (error) {
    return next(error);
  }
};

export const addItemToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'productId is required' });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const cart = await getOrCreateCart(req.userId);
    const existingItem = cart.items.find((item) => item.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      cart.items.push({ product: productId, quantity: Number(quantity) });
    }

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate('items.product');
    return res.status(200).json(updatedCart);
  } catch (error) {
    return next(error);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find((entry) => entry.product.toString() === req.params.productId);

    if (!item) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    item.quantity = Number(quantity);
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate('items.product');
    return res.json(updatedCart);
  } catch (error) {
    return next(error);
  }
};

export const removeCartItem = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== req.params.productId);
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate('items.product');
    return res.json(updatedCart);
  } catch (error) {
    return next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();

    return res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    return next(error);
  }
};