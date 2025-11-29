const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const stripe = require('stripe')(process.env.STRIPE_SECRET || 'sk_test_...'); // Use chave teste
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Conexão DB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce');

// Middleware Auth
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (e) { res.status(401).json({ msg: 'Invalid token' }); }
};

// Importe models aqui (User, Product, etc.) - adicione no topo se necessário

// Rotas AUTH
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  const user = new User({ name, email, password });
  await user.save();
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token, user: { id: user._id, name, email } });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !await bcrypt.compare(password, user.password)) return res.status(400).json({ msg: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token, user: { id: user._id, name: user.name, email } });
});

// Rotas PRODUTOS (como no anterior)
app.get('/api/products', async (req, res) => {
  const { category, priceMin, priceMax, sort } = req.query;
  let query = {};
  if (category) query.category = category;
  if (priceMin || priceMax) query.price = {};
  if (priceMin) query.price.$gte = priceMin;
  if (priceMax) query.price.$lte = priceMax;
  let products = await Product.find(query).populate('reviews.user');
  if (sort === 'price') products.sort((a, b) => a.price - b.price);
  res.json(products);
});

app.get('/api/products/:id', async (req, res) => {
  const product = await Product.findById(req.params.id).populate('reviews.user');
  res.json(product);
});

app.post('/api/products/:id/reviews', auth, async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  product.reviews.push({ user: req.user.id, rating, comment });
  await product.save();
  res.json(product);
});

// Outras rotas (categorias, orders, shipping, payment, coupons, admin) - copie do anterior aqui para brevidade

app.listen(5000, () => console.log('Server rodando na porta 5000'));