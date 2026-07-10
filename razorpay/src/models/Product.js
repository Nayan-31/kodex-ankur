import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    category: {
      type: String,
      trim: true,
      default: 'general'
    },
    imageUrl: {
      type: String,
      trim: true,
      default: ''
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);