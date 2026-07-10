import bcrypt from 'bcryptjs';

import { connectDatabase } from '../config/db.js';
import { env } from '../config/env.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

const sampleProducts = [
    {
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse with silent clicks',
        price: 999,
        stock: 25,
        category: 'accessories',
        imageUrl: 'https://example.com/products/wireless-mouse.png',
        active: true
    },
    {
        name: 'Mechanical Keyboard',
        description: 'Compact mechanical keyboard with blue switches',
        price: 3499,
        stock: 15,
        category: 'accessories',
        imageUrl: 'https://example.com/products/mechanical-keyboard.png',
        active: true
    },
    {
        name: 'USB-C Charger',
        description: '65W fast charger for phones and laptops',
        price: 2499,
        stock: 40,
        category: 'electronics',
        imageUrl: 'https://example.com/products/usb-c-charger.png',
        active: true
    }
];

const seed = async () => {
    await connectDatabase();

    await Promise.all([
        Product.deleteMany({}),
        Cart.deleteMany({}),
        User.deleteMany({})
    ]);

    const demoPassword = await bcrypt.hash('demo1234', 10);
    const user = await User.create({
        name: 'Demo User',
        email: 'demo@example.com',
        password: demoPassword
    });

    const products = await Product.insertMany(sampleProducts);

    await Cart.create({
        user: user._id,
        items: [
            {
                product: products[0]._id,
                quantity: 2
            }
        ]
    });

    console.log('Seed completed successfully');
    console.log('Demo login: demo@example.com / demo1234');
    console.log(`JWT secret in use: ${env.jwtSecret ? 'configured' : 'missing'}`);
    process.exit(0);
};

seed().catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
});