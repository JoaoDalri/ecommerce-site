import mongoose, { Schema } from 'mongoose';

const ReviewSchema = new Schema({
  user: { type: String, required: true }, // Nome do usuário
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
}, { timestamps: true });

const ProductSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  oldPrice: Number,
  category: { type: String, index: true },
  images: [String],
  stock: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  reviews: [ReviewSchema],
  averageRating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
}, { timestamps: true });

// Índice de texto para busca
ProductSchema.index({ title: 'text', description: 'text' });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);