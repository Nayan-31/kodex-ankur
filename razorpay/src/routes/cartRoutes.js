import { Router } from 'express';

import {
  addItemToCart,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem
} from '../controllers/cartController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/', getCart);
router.post('/items', addItemToCart);
router.patch('/items/:productId', updateCartItem);
router.delete('/items/:productId', removeCartItem);
router.delete('/', clearCart);

export default router;