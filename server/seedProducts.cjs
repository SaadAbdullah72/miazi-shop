const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/productModel');
const Category = require('./models/categoryModel');

dotenv.config();

const products = [
    {
        name: 'iPhone 15 Pro Max - Titanium Grey',
        price: 245000,
        description: 'Experience the cutting edge of mobile technology with the 15 Pro Max. Aerospace-grade titanium design.',
        brand: 'Apple',
        category: 'Smartphones',
        countInStock: 10,
        rating: 4.9,
        numReviews: 124,
        images: ['https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&w=800&q=80']
    },
    {
        name: 'MacBook Pro 16" M3 Max',
        price: 580000,
        description: 'The ultimate powerhouse for creative professionals. 128GB Unified Memory.',
        brand: 'Apple',
        category: 'Laptops & Computers',
        countInStock: 5,
        rating: 5.0,
        numReviews: 45,
        images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80']
    },
    {
        name: 'Sony WH-1000XM5 Noise Cancelling',
        price: 75000,
        description: 'Industry-leading noise cancellation and premium audio quality.',
        brand: 'Sony',
        category: 'Audio',
        countInStock: 25,
        rating: 4.8,
        numReviews: 890,
        images: ['https://images.unsplash.com/photo-1618366712277-7407a5180ae4?auto=format&fit=crop&w=800&q=80']
    },
    {
        name: 'ASUS ROG Zephyrus G14',
        price: 320000,
        description: 'Powerful gaming laptop in a compact 14-inch form factor.',
        brand: 'ASUS',
        category: 'Laptops & Computers',
        countInStock: 8,
        rating: 4.7,
        numReviews: 56,
        images: ['https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=800&q=80']
    },
    {
        name: 'Samsung Galaxy S24 Ultra',
        price: 215000,
        description: 'Galaxy AI is here. Experience the ultimate Android flagship.',
        brand: 'Samsung',
        category: 'Smartphones',
        countInStock: 15,
        rating: 4.8,
        numReviews: 312,
        images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80']
    },
    {
        name: 'DJI Mavic 3 Pro',
        price: 450000,
        description: 'Triple camera system for professional aerial cinematography.',
        brand: 'DJI',
        category: 'Gadgets',
        countInStock: 4,
        rating: 4.9,
        numReviews: 28,
        images: ['https://images.unsplash.com/photo-1473968512253-9097d6435384?auto=format&fit=crop&w=800&q=80']
    },
    {
        name: 'Bose QuietComfort Ultra',
        price: 82000,
        description: 'World-class noise cancelling and spatial audio experience.',
        brand: 'Bose',
        category: 'Audio',
        countInStock: 12,
        rating: 4.7,
        numReviews: 145,
        images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80']
    },
    {
        name: 'PlayStation 5 Slim Console',
        price: 110000,
        description: 'The future of gaming is here. Ultra-high speed SSD.',
        brand: 'Sony',
        category: 'Video Games',
        countInStock: 30,
        rating: 4.9,
        numReviews: 2450,
        images: ['https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=800&q=80']
    },
    {
        name: 'Logitech MX Master 3S',
        price: 18500,
        description: 'The ultimate productivity mouse for designers and coders.',
        brand: 'Logitech',
        category: 'Gadgets',
        countInStock: 50,
        rating: 4.8,
        numReviews: 1240,
        images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80']
    },
    {
        name: 'Dell UltraSharp 32" 4K',
        price: 145000,
        description: 'Color-accurate 4K monitor for professional photo and video editing.',
        brand: 'Dell',
        category: 'Laptops & Computers',
        countInStock: 10,
        rating: 4.9,
        numReviews: 67,
        images: ['https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?auto=format&fit=crop&w=800&q=80']
    }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        const allCategories = await Category.find();
        
        for (const p of products) {
            const category = allCategories.find(c => c.name === p.category);
            if (category) {
                p.category = category._id;
                await Product.create(p);
                console.log(`Created product: ${p.name}`);
            }
        }

        console.log('Seeding completed successfully!');
        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedData();
