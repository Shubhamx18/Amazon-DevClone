const bcrypt = require('bcryptjs');
const { User, Category, Product, Review } = require('../models');

const seedDatabase = async () => {
    try {
        const userCount = await User.count();
        if (userCount > 0) { console.log('📦 Database already seeded'); return; }
        console.log('🌱 Seeding database with full Amazon content...');

        // Users
        const admin = await User.create({ name: 'Admin User', email: 'admin@amazon.com', password: 'admin123', role: 'admin', isVerified: true });
        const s1 = await User.create({ name: 'ElectroHub India', email: 'seller@amazon.com', password: 'seller123', role: 'seller', isVerified: true, sellerName: 'ElectroHub India', sellerDescription: 'Premium electronics retailer', sellerRating: 4.5 });
        const s2 = await User.create({ name: 'Fashion Galaxy', email: 'fashion@amazon.com', password: 'seller123', role: 'seller', isVerified: true, sellerName: 'Fashion Galaxy', sellerDescription: 'Trendy fashion for everyone', sellerRating: 4.3 });
        const s3 = await User.create({ name: 'BookVerse', email: 'books@amazon.com', password: 'seller123', role: 'seller', isVerified: true, sellerName: 'BookVerse Express', sellerDescription: 'Books delivered fast', sellerRating: 4.7 });
        const s4 = await User.create({ name: 'HomeStyle Living', email: 'home@amazon.com', password: 'seller123', role: 'seller', isVerified: true, sellerName: 'HomeStyle Living', sellerDescription: 'Premium home & kitchen products', sellerRating: 4.4 });
        const s5 = await User.create({ name: 'SportsPro', email: 'sports@amazon.com', password: 'seller123', role: 'seller', isVerified: true, sellerName: 'SportsPro India', sellerDescription: 'Sports & fitness gear', sellerRating: 4.2 });
        const customer = await User.create({ name: 'John Doe', email: 'john@test.com', password: 'test123', role: 'customer', isVerified: true });

        // Main Categories
        const electronics = await Category.create({ name: 'Electronics', slug: 'electronics', description: 'Mobiles, Laptops, Cameras & More', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400', sortOrder: 1 });
        const fashion = await Category.create({ name: 'Fashion', slug: 'fashion', description: 'Clothing, Shoes & Accessories', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400', sortOrder: 2 });
        const books = await Category.create({ name: 'Books', slug: 'books', description: 'Fiction, Non-Fiction & More', image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400', sortOrder: 3 });
        const home = await Category.create({ name: 'Home & Kitchen', slug: 'home-kitchen', description: 'Furniture, Appliances & Decor', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', sortOrder: 4 });
        const sports = await Category.create({ name: 'Sports & Fitness', slug: 'sports-fitness', description: 'Equipment & Sportswear', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400', sortOrder: 5 });
        const beauty = await Category.create({ name: 'Beauty & Health', slug: 'beauty-health', description: 'Skincare, Makeup & Wellness', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', sortOrder: 6 });
        const toys = await Category.create({ name: 'Toys & Games', slug: 'toys-games', description: 'Toys, Board Games & Puzzles', image: 'https://images.unsplash.com/photo-1558060318-8c239cbdb799?w=400', sortOrder: 7 });
        const grocery = await Category.create({ name: 'Grocery & Gourmet', slug: 'grocery', description: 'Food, Beverages & Snacks', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400', sortOrder: 8 });

        // Sub-categories
        await Category.bulkCreate([
            { name: 'Smartphones', slug: 'smartphones', parentId: electronics.id, sortOrder: 1 },
            { name: 'Laptops', slug: 'laptops', parentId: electronics.id, sortOrder: 2 },
            { name: 'Headphones', slug: 'headphones', parentId: electronics.id, sortOrder: 3 },
            { name: 'Cameras', slug: 'cameras', parentId: electronics.id, sortOrder: 4 },
            { name: 'Tablets', slug: 'tablets', parentId: electronics.id, sortOrder: 5 },
            { name: 'Smartwatches', slug: 'smartwatches', parentId: electronics.id, sortOrder: 6 },
            { name: "Men's Clothing", slug: 'mens-clothing', parentId: fashion.id, sortOrder: 1 },
            { name: "Women's Clothing", slug: 'womens-clothing', parentId: fashion.id, sortOrder: 2 },
            { name: 'Footwear', slug: 'footwear', parentId: fashion.id, sortOrder: 3 },
            { name: 'Watches', slug: 'watches', parentId: fashion.id, sortOrder: 4 },
            { name: 'Bags & Luggage', slug: 'bags-luggage', parentId: fashion.id, sortOrder: 5 },
            { name: 'Fiction', slug: 'fiction', parentId: books.id, sortOrder: 1 },
            { name: 'Non-Fiction', slug: 'non-fiction', parentId: books.id, sortOrder: 2 },
            { name: 'Academic', slug: 'academic', parentId: books.id, sortOrder: 3 },
            { name: 'Kitchen Appliances', slug: 'kitchen-appliances', parentId: home.id, sortOrder: 1 },
            { name: 'Home Decor', slug: 'home-decor', parentId: home.id, sortOrder: 2 },
            { name: 'Furniture', slug: 'furniture', parentId: home.id, sortOrder: 3 },
            { name: 'Exercise Equipment', slug: 'exercise-equipment', parentId: sports.id, sortOrder: 1 },
            { name: 'Sportswear', slug: 'sportswear', parentId: sports.id, sortOrder: 2 },
        ]);

        // Load products from separate file
        const productData = require('./products');
        const sellers = { s1, s2, s3, s4, s5 };
        const cats = { electronics, fashion, books, home, sports, beauty, toys, grocery };

        const products = await Product.bulkCreate(
            productData.map(p => ({
                ...p,
                sellerId: sellers[p.seller].id,
                categoryId: cats[p.category].id,
            }))
        );

        // Create reviews
        const titles = ['Excellent!', 'Great value!', 'Highly recommended!', 'Amazing quality', 'Worth every penny', 'Good product', 'Love it!', 'Perfect purchase', 'Fantastic!', 'Very satisfied'];
        const comments = [
            'Absolutely love this product! Quality is outstanding and delivery was fast.',
            'Great value for money. Exceeds expectations in every way.',
            'Been using it for a week now and I am thoroughly impressed. Highly recommend!',
            'Premium quality, exactly as described. Would buy again without hesitation.',
            'Perfect! Just what I needed. The build quality is top-notch.',
            'Good product overall. Minor issues but nothing major. Happy with purchase.',
            'Incredible product at this price point. Amazon delivered on time too!',
            'My family loves it. We use it every day. Five stars!',
            'Solid construction and works perfectly. Very happy customer here.',
            'Arrived well packaged. Product quality is excellent. Recommended!',
        ];

        for (const product of products) {
            const numReviews = 2 + Math.floor(Math.random() * 3);
            for (let i = 0; i < numReviews; i++) {
                try {
                    await Review.create({
                        userId: customer.id,
                        productId: product.id,
                        rating: 3 + Math.floor(Math.random() * 3),
                        title: titles[Math.floor(Math.random() * titles.length)],
                        comment: comments[Math.floor(Math.random() * comments.length)],
                        isVerifiedPurchase: Math.random() > 0.3,
                        helpfulCount: Math.floor(Math.random() * 100)
                    });
                } catch (e) { break; }
            }
        }

        console.log(`✅ Seeded: ${products.length} products, 8 categories, 7 users`);
        console.log('👤 Admin: admin@amazon.com / admin123');
        console.log('🏪 Seller: seller@amazon.com / seller123');
        console.log('🛍️ Customer: john@test.com / test123');
    } catch (error) {
        console.error('❌ Seed error:', error.message);
    }
};

module.exports = seedDatabase;
