const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce');

const products = [
  { name: 'Smartphone X', description: 'Celular top de linha', price: 999, category: 'Eletrônicos', images: ['img1.jpg'], variations: [{color: 'Preto', size: 'M', stock: 10}] },
  { name: 'Notebook Pro', description: 'Laptop para trabalho', price: 2999, category: 'Eletrônicos', images: ['img2.jpg'], variations: [{color: 'Prata', size: 'L', stock: 5}] },
  // Adicione mais 8 produtos de exemplo para nicho genérico (eletrônicos)
  { name: 'Fone Bluetooth', description: 'Áudio sem fios', price: 199, category: 'Eletrônicos', images: ['img3.jpg'], variations: [{color: 'Branco', size: 'S', stock: 20}] },
  { name: 'Tablet 10"', description: 'Para entretenimento', price: 799, category: 'Eletrônicos', images: ['img4.jpg'], variations: [{color: 'Azul', size: 'M', stock: 15}] },
  { name: 'Câmera Digital', description: 'Fotografia profissional', price: 1499, category: 'Eletrônicos', images: ['img5.jpg'], variations: [{color: 'Preto', size: 'L', stock: 8}] },
  { name: 'Smartwatch', description: 'Monitor de saúde', price: 499, category: 'Eletrônicos', images: ['img6.jpg'], variations: [{color: 'Verde', size: 'S', stock: 12}] },
  { name: 'Teclado Mecânico', description: 'Para gamers', price: 299, category: 'Eletrônicos', images: ['img7.jpg'], variations: [{color: 'RGB', size: 'M', stock: 25}] },
  { name: 'Mouse Gamer', description: 'Precisão alta', price: 129, category: 'Eletrônicos', images: ['img8.jpg'], variations: [{color: 'Preto', size: 'S', stock: 30}] },
  { name: 'Headset', description: 'Som surround', price: 399, category: 'Eletrônicos', images: ['img9.jpg'], variations: [{color: 'Vermelho', size: 'L', stock: 18}] },
  { name: 'Monitor 27"', description: 'Tela 4K', price: 899, category: 'Eletrônicos', images: ['img10.jpg'], variations: [{color: 'Preto', size: 'XL', stock: 6}] }
];

Product.insertMany(products).then(() => {
  console.log('Seed completo! 10 produtos adicionados.');
  mongoose.disconnect();
});