const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: { type: String, index: true },
  images: [String],
  stock: { type: Number, default: 10 },
  featured: { type: Boolean, default: false },
  averageRating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const electronics = [
  {
    title: "Smartphone Galaxy S23",
    description: "Smartphone topo de linha com câmera incrível.",
    price: 5999.90,
    category: "Eletrônicos",
    images: ["https://placehold.co/600x400/png?text=Galaxy+S23"],
    stock: 15,
    featured: true,
    averageRating: 4.8,
    numReviews: 10
  },
  {
    title: "MacBook Pro M2",
    description: "Notebook para profissionais criativos.",
    price: 12499.00,
    category: "Eletrônicos",
    images: ["https://placehold.co/600x400/png?text=MacBook+Pro"],
    stock: 5,
    featured: true,
    averageRating: 5.0,
    numReviews: 5
  },
  {
    title: "Fone Sony WH-1000XM5",
    description: "Cancelamento de ruído líder da indústria.",
    price: 1899.00,
    category: "Eletrônicos",
    images: ["https://placehold.co/600x400/png?text=Sony+Headphone"],
    stock: 20,
    featured: false,
    averageRating: 4.7,
    numReviews: 12
  },
  {
    title: "Camiseta Oversized",
    description: "Algodão 100% de alta qualidade.",
    price: 89.90,
    category: "Moda",
    images: ["https://placehold.co/600x400/png?text=T-Shirt"],
    stock: 100,
    featured: false,
    averageRating: 4.5,
    numReviews: 2
  },
  {
    title: "Tênis de Corrida",
    description: "Conforto e performance para seus treinos.",
    price: 299.90,
    category: "Moda",
    images: ["https://placehold.co/600x400/png?text=Running+Shoes"],
    stock: 30,
    featured: true,
    averageRating: 4.8,
    numReviews: 8
  }
];

async function seed() {
  try {
    console.log('🔌 Conectando ao MongoDB...');
    await mongoose.connect(MONGODB_URI);
    
    console.log('🧹 Limpando produtos antigos...');
    await Product.deleteMany({});

    console.log('🌱 Inserindo novos produtos...');
    await Product.insertMany(electronics);

    console.log('✨ Sucesso! Banco de dados populado.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

seed();