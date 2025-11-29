import mongoose, { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: String,
  images: [String],
  variations: [{
    color: String,
    size: String,
    stock: Number
  }]
}, { timestamps: true });

const Product = models.Product || model('Product', ProductSchema);
export default Product;