// frontend/scripts/seed.js
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' }); // Carrega variáveis do .env.local

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce';

// Definição do Schema inline para evitar problemas com importação de TS no Node puro
const productSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Ajustado para 'title' para bater com o frontend
  description: String,
  price: { type: Number, required: true },
  category: { type: String, index: true },
  images: [String],
  stock: { type: Number, default: 10 },
  featured: { type: Boolean, default: false },
  averageRating: { type: Number, default: 0 },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const electronics = [
  {
    title: "Smartphone Galaxy S23 Ultra",
    description: "O smartphone mais potente com câmera de 200MP e processador de última geração.",
    price: 5999.90,
    category: "Smartphones",
    images: ["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=500&q=60"],
    stock: 15,
    featured: true,
    averageRating: 4.8
  },
  {
    title: "Notebook MacBook Pro M2",
    description: "Potência e portabilidade com o novo chip Apple Silicon M2.",
    price: 12499.00,
    category: "Notebooks",
    images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=60"],
    stock: 5,
    featured: true,
    averageRating: 5.0
  },
  {
    title: "Fone de Ouvido Sony WH-1000XM5",
    description: "Cancelamento de ruído líder da indústria e som de alta resolução.",
    price: 1899.00,
    category: "Áudio",
    images: ["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=500&q=60"],
    stock: 20,
    featured: false,
    averageRating: 4.7
  },
  {
    title: "Monitor Gamer 27'' 144Hz",
    description: "Taxa de atualização ultra-rápida para jogos competitivos.",
    price: 1499.90,
    category: "Monitores",
    images: ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=500&q=60"],
    stock: 8,
    featured: false,
    averageRating: 4.5
  },
  {
    title: "Teclado Mecânico RGB",
    description: "Switches azuis táteis e iluminação RGB personalizável.",
    price: 349.90,
    category: "Periféricos",
    images: ["https://images.unsplash.com/photo-1587829741301-dc798b91a603?auto=format&fit=crop&w=500&q=60"],
    stock: 50,
    featured: true,
    averageRating: 4.6
  },
  {
    title: "Mouse Sem Fio Ergonômico",
    description: "Conforto para longas horas de trabalho e precisão DPI ajustável.",
    price: 129.90,
    category: "Periféricos",
    images: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=500&q=60"],
    stock: 40,
    featured: false,
    averageRating: 4.3
  },
  {
    title: "Smartwatch Series 8",
    description: "Monitore sua saúde, sono e atividades físicas com precisão.",
    price: 2999.00,
    category: "Wearables",
    images: ["https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=500&q=60"],
    stock: 25,
    featured: true,
    averageRating: 4.9
  },
  {
    title: "Tablet Tab S8",
    description: "Tela imersiva e caneta inclusa para criatividade e produtividade.",
    price: 3599.00,
    category: "Tablets",
    images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=500&q=60"],
    stock: 12,
    featured: false,
    averageRating: 4.7
  },
  {
    title: "Câmera DSLR Profissional",
    description: "Capture momentos incríveis com qualidade de imagem superior.",
    price: 4500.00,
    category: "Câmeras",
    images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&q=60"],
    stock: 4,
    featured: false,
    averageRating: 4.8
  },
  {
    title: "Caixa de Som Bluetooth Portátil",
    description: "Som potente e à prova d'água para levar a festa a qualquer lugar.",
    price: 499.90,
    category: "Áudio",
    images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=500&q=60"],
    stock: 30,
    featured: true,
    averageRating: 4.5
  },
  {
    title: "Console de Videogame Next-Gen",
    description: "Jogue os títulos mais recentes em 4K com carregamento rápido.",
    price: 4499.00,
    category: "Games",
    images: ["https://images.unsplash.com/photo-1486401899868-0e435ed85128?auto=format&fit=crop&w=500&q=60"],
    stock: 7,
    featured: true,
    averageRating: 4.9
  },
  {
    title: "Carregador Portátil 20000mAh",
    description: "Nunca fique sem bateria. Carregamento rápido para múltiplos dispositivos.",
    price: 199.90,
    category: "Acessórios",
    images: ["https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=500&q=60"],
    stock: 100,
    featured: false,
    averageRating: 4.4
  }
];

async function seed() {
  try {
    console.log('🔌 Conectando ao MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado!');

    console.log('🧹 Limpando produtos antigos...');
    await Product.deleteMany({});

    console.log('🌱 Inserindo novos produtos...');
    await Product.insertMany(electronics);

    console.log('✨ Sucesso! 12 produtos criados.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao rodar seed:', error);
    process.exit(1);
  }
}

seed();