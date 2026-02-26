const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();

// --- 1. MIDDLEWARE SETUP ---
app.use(express.json());
app.use(cors());

// Uploads folder auto create
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// --- 2. DATABASE CONNECTION ---
const dbURI = "mongodb+srv://manasiyaahmad345_db_user:sTare144faFDB0bV@cluster0.ioo5mmk.mongodb.net/meena_collection?retryWrites=true&w=majority";

mongoose.connect(dbURI)
    .then(() => console.log("MongoDB Connected! ✅ Meena Collection Live."))
    .catch(err => console.log("CRITICAL: Mongo Connection Error -> ", err.message));

// --- 3. MULTER CONFIG ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

// --- 4. SCHEMAS ---
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    imageUrl: { type: String, default: 'saree1.png' }
});
const Product = mongoose.model('Product', productSchema);

const orderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    productName: { type: String, required: true },
    price: Number,
    status: { type: String, default: "Pending" },
    address: { type: String, required: true },
    orderDate: {
        type: String,
        default: () => {
            const d = new Date();
            return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
        }
    }
});
const Order = mongoose.model('Order', orderSchema);

// --- 5. API ROUTES ---

// PRODUCTS GET
app.get('/api/products', async (req,res)=>{
    try{
        const products = await Product.find().sort({_id:-1});
        res.json(products);
    }catch(err){
        res.status(500).json({error:err.message});
    }
});

// PRODUCT UPLOAD
app.post('/api/products/upload', upload.single('image'), async (req,res)=>{
    try{
        const {name,price,description}=req.body;

        const newProduct=new Product({
            name,
            price,
            description,
            imageUrl:req.file ? req.file.filename : 'saree1.png'
        });

        await newProduct.save();

        res.status(201).json({message:"Product Saved ✅"});
    }catch(err){
        res.status(500).json({error:err.message});
    }
});

// DELETE PRODUCT
app.delete('/api/products/:id', async (req,res)=>{
    try{
        const id=req.params.id.trim();
        await Product.findByIdAndDelete(id);

        res.json({message:"Deleted 🗑️"});
    }catch{
        res.status(500).json({error:"Delete failed"});
    }
});

// SAVE ORDER
app.post('/api/orders', async (req,res)=>{
    try{
        console.log("Incoming Order:",req.body);

        const newOrder=new Order(req.body);

        await newOrder.save();

        res.status(201).json({message:"Order Placed ✅"});
    }catch(err){
        console.error(err.message);
        res.status(400).json({error:"Missing Fields "+err.message});
    }
});

// GET ORDERS
app.get('/api/orders', async (req,res)=>{
    try{
        const orders=await Order.find().sort({_id:-1});
        res.json(orders);
    }catch(err){
        res.status(500).json({error:err.message});
    }
});

// UPDATE ORDER STATUS
app.put('/api/orders/:id', async (req,res)=>{
    try{
        const id=req.params.id.trim();

        await Order.findByIdAndUpdate(id,{
            status:req.body.status
        });

        res.json({message:"Status Updated ✅"});
    }catch{
        res.status(500).json({error:"Update fail"});
    }
});

// DELETE ORDER
app.delete('/api/orders/:id', async (req,res)=>{
    try{
        const id=req.params.id.trim();

        await Order.findByIdAndDelete(id);

        res.json({message:"Order Deleted 🗑️"});
    }catch{
        res.status(500).json({error:"Delete fail"});
    }
});

// Static folders
app.use('/uploads',express.static(path.join(__dirname,'uploads')));
app.use('/images',express.static(path.join(__dirname,'images')));


// ✅ HOME ROUTE (Cannot GET / Fix)
app.get("/",(req,res)=>{
res.send("🚀 Meena Collection Backend Running Successfully");
});


// --- 6. START SERVER ---
const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
console.log(`🚀 Meena Backend Running on PORT ${PORT}`);
});