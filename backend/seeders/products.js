// Unsplash photo IDs by category
const imgs = {
    phones: ['1610945265064-0e34e5519bbf', '1598327105666-5b89351aff97', '1511707171634-5f897ff02aa9', '1592899677977-9c10ca588bbd', '1567581935884-3349723552ca', '1601784551446-20c9e07cdbdb', '1585060544812-6b45742d762f', '1695048133142-1a20484d2569', '1574944985070-8f3ebc6b79d2', '1512941937169-cb306e5e4ab3'],
    laptops: ['1517336714731-489689fd1ca8', '1496181133206-80ce9b88a853', '1588872657578-7efd1f1555ed', '1593642702821-c8da6771f0c6', '1603302576837-37561b2e2302', '1525547719571-a2d4ac8945e2', '1531297572550-e2735f4543c4', '1498050108023-c5249f4df085', '1541807084-5c52b6b3adef', '1611078489935-0cb964de46d6'],
    audio: ['1505740420928-5e560c06d30e', '1583394838336-acd977736f90', '1606220588913-b3aacb4d2f46', '1608043152269-423dbba4e7e1', '1590658268037-6bf12f032f55', '1545454675-3531b543be5d', '1546435770-a3e426bf472b', '1484704849700-f032a568e944', '1558089687-f282b8ee1f62', '1524678606370-a47ad25cb82a'],
    watches: ['1434493789847-2f02dc6ca35d', '1523275335684-37898b6baf30', '1508685096489-7aacd43bd3b1', '1524592094714-0f0654e20314', '1575311373937-040b8e1fd6b0', '1539874754764-5a96559165b0', '1542496204-0f36f6fa2c5e', '1533139502658-0198f920d8e8', '1609587312208-cea54be969e7', '1622434641406-a158123450f9'],
    tv: ['1593359677879-a4bb92f829d1', '1461151304267-38535e780c79', '1522869635100-9f4c5e86aa37', '1558618666-fcd25c85f82e', '1585399000684-d2f72660f092', '1601944179066-29786cb9d32a', '1574375927938-d5a98e8d6f2b', '1567690187548-114b3525024e', '1611532736597-de2d4265fba3', '1593784991095-a205069470b6'],
    cameras: ['1516035069371-29a1b244cc32', '1502920917128-1aa500764cbd', '1581591524425-c7e0978865fc', '1510127034890-ba27508e9f1c', '1495707902641-27d4349523d0', '1526170375885-4d8ecf77b99f', '1542567455-c3b4e25d9b4c', '1617005082133-518b2b0e09e6', '1452780212940-6f5c0d14d848', '1500634245200-4523b85ed3b4'],
    fashion: ['1542272604-787c3835535d', '1542291026-7eec264c27ff', '1608231387042-66d1773070a5', '1586363104862-3a5e2ab60d99', '1605348532760-6753d2c43329', '1596755094514-f87e34085b2c', '1553062407-98eeb64c6a62', '1524578271613-d550eacf6090', '1594938298603-c8148c4dae35', '1572804013309-59a88b7e92f1', '1596462502278-27bfdc403348', '1572635196237-14b3f281503f', '1594787318286-3d835c1d207f', '1581655353564-df123a1eb820', '1591047139829-d91aecb6caea', '1556228578-0d85b1a4d571', '1576566588028-4147f3842f27', '1620799140408-edc6dcb6d633', '1558171813-01ed3d25a6fb', '1602810319428-019690571b5b'],
    books: ['1544947950-fa07a98d237f', '1592496431122-2349e0fbc666', '1495446815901-a7297e633e8d', '1512820790803-83ca734da794', '1543002588-bfa74002ed7e', '1497633762265-9d179a990aa6', '1524578271613-d550eacf6090', '1476275466078-4007374efbbe', '1519682337058-a94d519337bc', '1589998059171-988d887df646'],
    home: ['1556909114-f6e7ad7d3136', '1558618666-fcd25c85f82e', '1585515320310-259814833e62', '1555041469-a586c61ea9bc', '1584568694244-14fbdf83bd30', '1616627547584-bf28cee262db', '1495474472287-4d71bcdd2085', '1602143407151-7111542de6e8', '1556228578-0d85b1a4d571', '1648753898498-d4964e8b89e0', '1585399000684-d2f72660f092', '1507752366-0b430e5fb8a6', '1556228841-a3c527ebefe5', '1583847268-c28eeff82d7b', '1484101403633-562f891dc89a'],
    sports: ['1601925260368-ae2f83cf8b7f', '1534438327276-14e5300c3a48', '1614632537197-38a17061c2bd', '1626224583764-f87db24ac4ea', '1517344884509-a0c97ec11bcc', '1571019613454-1cb2f99b2d8b', '1576435728678-68d0fbf94e91', '1540497077202-7c8a3999166f', '1461896836934-ffe607ba8211', '1599058917212-d750089bc07e'],
    beauty: ['1596462502278-27bfdc403348', '1556228578-0d85b1a4d571', '1621607512214-68297480165e', '1570194065650-d99fb4b38b17', '1556228720-195a672e8a03', '1571781926291-c477ebfd024b', '1522335789203-aabd1fc54bc9', '1598440947619-2c35fc9aa908', '1612817288484-6f916006741a', '1556228453-efd6c35e5760'],
    toys: ['1587654780291-39c9404d7dd0', '1611891487122-207579d67d98', '1594787318286-3d835c1d207f', '1577401239170-897942555fb3', '1558060318-8c239cbdb799', '1596461404969-9ae70f2830c1', '1566576912321-d58ddd7a6088', '1599623560574-6c0c6120c31a', '1560914429-7e93e20e1b99', '1501238295340-1e453a8dde18'],
    grocery: ['1596040033229-a9821ebd058d', '1549007994-cb92caebd54b', '1559056199-641a0ac8b55e', '1556679343-c7306c1976bc', '1558961363-fa8fdf82db35', '1542838132-92c53300491e', '1563636619-e9143da7973b', '1553787499-6f7c27d3e58f', '1543257580-7269da7f7d80', '1571091718767-18b5b1457add']
};
const img = (cat, i) => `https://images.unsplash.com/photo-${imgs[cat][i % imgs[cat].length]}?w=400&h=400&fit=crop`;

let id = 0;
const P = (t, cat, brand, price, orig, disc, imgCat, seller, feat, specs, tags, desc, bullets) => {
    id++;
    return {
        title: t, slug: t.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 60) + '-' + id,
        description: desc || `Premium ${t} - High quality ${brand} product with excellent features and value.`,
        bulletPoints: bullets || [`Premium ${brand} quality`, `Best in class performance`, `Great value for money`, `Fast delivery available`, `Easy returns`],
        price, originalPrice: orig || price, discount: disc || 0,
        images: [img(imgCat, id)], thumbnail: img(imgCat, id),
        category: cat, seller: seller || 's1', brand, stock: 10 + Math.floor(Math.random() * 200),
        sku: `${brand.substring(0, 3).toUpperCase()}-${id}`,
        avgRating: 3.5 + Math.round(Math.random() * 15) / 10, totalReviews: 100 + Math.floor(Math.random() * 25000),
        totalSold: 500 + Math.floor(Math.random() * 100000), isFeatured: !!feat,
        freeDelivery: price > 499, deliveryDays: 2 + Math.floor(Math.random() * 5),
        returnPolicy: '10 days return', warranty: cat === 'fashion' || cat === 'books' || cat === 'grocery' ? 'No warranty' : '1 year warranty',
        specifications: specs || {}, tags: tags || [], isActive: true
    };
};

const products = [];

// === SMARTPHONES (60) ===
const phonebrands = [
    { b: 'Samsung', models: ['Galaxy S24 Ultra 5G', 'Galaxy S24+ 5G', 'Galaxy S24 5G', 'Galaxy S23 FE', 'Galaxy A55 5G', 'Galaxy A35 5G', 'Galaxy A25 5G', 'Galaxy A15 5G', 'Galaxy M55 5G', 'Galaxy M35 5G', 'Galaxy F55 5G', 'Galaxy Z Flip5', 'Galaxy Z Fold5'], p: [129999, 99999, 79999, 49999, 29999, 24999, 18999, 13999, 26999, 17999, 22999, 99999, 154999] },
    { b: 'Apple', models: ['iPhone 15 Pro Max 256GB', 'iPhone 15 Pro 128GB', 'iPhone 15 Plus 128GB', 'iPhone 15 128GB', 'iPhone 14 128GB', 'iPhone SE 3rd Gen 64GB', 'iPhone 13 128GB'], p: [159900, 134900, 89900, 79900, 59900, 49900, 54900] },
    { b: 'OnePlus', models: ['12 5G 256GB', '12R 5G 256GB', 'Nord CE4 128GB', 'Nord CE4 Lite', '11R 5G 256GB', 'Open Foldable'], p: [64999, 42999, 24999, 17999, 39999, 149999] },
    { b: 'Xiaomi', models: ['14 Ultra 5G', '14 5G', 'Redmi Note 13 Pro+ 5G', 'Redmi Note 13 Pro', 'Redmi Note 13', 'Redmi 13C', 'POCO F6 Pro', 'POCO X6 Pro', 'POCO M6 Pro'], p: [99999, 69999, 29999, 23999, 17999, 8999, 32999, 24999, 14999] },
    { b: 'Google', models: ['Pixel 8 Pro 128GB', 'Pixel 8 128GB', 'Pixel 7a 128GB'], p: [84999, 59999, 39999] },
    { b: 'Nothing', models: ['Phone (2) 256GB', 'Phone (2a) 128GB', 'Phone (1) 256GB'], p: [44999, 23999, 29999] },
    { b: 'realme', models: ['GT 6T 5G', '12 Pro+ 5G', 'Narzo 70x 5G', 'C67 5G', '12x 5G'], p: [24999, 29999, 11999, 9999, 13999] },
    { b: 'Motorola', models: ['Edge 50 Pro', 'G84 5G', 'Edge 40 Neo'], p: [29999, 17999, 22999] },
    { b: 'Vivo', models: ['X100 Pro 5G', 'V30 Pro 5G', 'T3x 5G', 'Y200e 5G'], p: [89999, 39999, 14999, 12999] },
];
phonebrands.forEach(({ b, models, p }) => models.forEach((m, i) => {
    const pr = p[i]; const orig = Math.round(pr * 1.15);
    products.push(P(`${b} ${m}`, 'electronics', b, pr, orig, Math.round((1 - pr / orig) * 100), 'phones', 's1', i < 2,
        { Brand: b, Display: '6.5" AMOLED', RAM: '8GB', Storage: '128GB' }, [b.toLowerCase(), 'smartphone', '5g']));
}));

// === LAPTOPS (40) ===
const laptopbrands = [
    { b: 'Apple', models: ['MacBook Air M3 15" 16GB', 'MacBook Air M2 13" 8GB', 'MacBook Pro M3 Pro 14"', 'MacBook Pro M3 Max 16"'], p: [149900, 99900, 199900, 349900] },
    { b: 'ASUS', models: ['ROG Strix G16 i9 RTX4060', 'TUF Gaming F15 i7 RTX4050', 'VivoBook 15 i5 16GB', 'ZenBook 14 OLED', 'ROG Zephyrus G14', 'ProArt StudioBook 16'], p: [134990, 89990, 52990, 79990, 149990, 169990] },
    { b: 'HP', models: ['Pavilion 15 Ryzen 7 16GB', 'Victus 16 i7 RTX4060', 'Spectre x360 14 OLED', 'Envy x360 15 Ryzen 5', '245 G9 Ryzen 3', 'EliteBook 840 G10'], p: [58990, 84990, 129990, 72990, 32990, 99990] },
    { b: 'Lenovo', models: ['IdeaPad Slim 3 i5 8GB', 'IdeaPad Gaming 3 i5', 'ThinkPad E14 Gen 5', 'Yoga 7i 14 OLED', 'Legion 5 Pro i7 RTX4070', 'IdeaPad Flex 5 i7'], p: [42990, 64990, 74990, 89990, 149990, 59990] },
    { b: 'Dell', models: ['Inspiron 14 2-in-1 Touch', 'Inspiron 15 i5 8GB', 'XPS 13 Plus OLED', 'Alienware m16 R2', 'Latitude 5540 i7', 'Vostro 3520 i5'], p: [74990, 52990, 139990, 179990, 92990, 45990] },
    { b: 'Acer', models: ['Nitro V i7 RTX4050', 'Aspire 5 Ryzen 5', 'Swift Go 14 OLED', 'Predator Helios Neo 16'], p: [79990, 45990, 84990, 134990] },
    { b: 'MSI', models: ['Stealth 16 Studio', 'Katana 15 i7 RTX4060', 'Modern 14 i5', 'Creator Z16 HX'], p: [189990, 89990, 49990, 179990] },
];
laptopbrands.forEach(({ b, models, p }) => models.forEach((m, i) => {
    const pr = p[i]; const orig = Math.round(pr * 1.12);
    products.push(P(`${b} ${m}`, 'electronics', b, pr, orig, Math.round((1 - pr / orig) * 100), 'laptops', 's1', i === 0,
        { Brand: b, Processor: 'Latest Gen', RAM: '16GB', Storage: '512GB SSD' }, [b.toLowerCase(), 'laptop']));
}));

// === AUDIO (35) ===
const audiobrands = [
    { b: 'Sony', models: ['WH-1000XM5 NC', 'WF-1000XM5 TWS', 'WH-CH720N', 'SRS-XB100 Speaker', 'ULT WEAR NC'], p: [26990, 19990, 9990, 4990, 14990] },
    { b: 'Apple', models: ['AirPods Pro 2 USB-C', 'AirPods 3rd Gen', 'AirPods Max', 'HomePod mini'], p: [24900, 18900, 59900, 9900] },
    { b: 'JBL', models: ['Flip 6 Speaker', 'Charge 5 Speaker', 'Tune 770NC', 'Tour Pro 2 TWS', 'PartyBox 310'], p: [9999, 14999, 5999, 19999, 34999] },
    { b: 'boAt', models: ['Rockerz 450', 'Airdopes 141', 'Airdopes 191G', 'Stone 1200', 'Rockerz 255 Pro+'], p: [999, 899, 1299, 2499, 899] },
    { b: 'Samsung', models: ['Galaxy Buds2 Pro', 'Galaxy Buds FE'], p: [11999, 6999] },
    { b: 'Bose', models: ['QuietComfort 45', 'SoundLink Flex', 'QuietComfort Earbuds II'], p: [25990, 14990, 22990] },
    { b: 'Marshall', models: ['Stanmore II', 'Major IV On-Ear', 'Emberton II'], p: [29999, 12999, 14999] },
    { b: 'Sennheiser', models: ['Momentum 4', 'CX Plus TWS', 'HD 560S Open-Back'], p: [24990, 9990, 14990] },
    { b: 'Jabra', models: ['Elite 85t', 'Elite 45h'], p: [14999, 6999] },
];
audiobrands.forEach(({ b, models, p }) => models.forEach((m, i) => {
    const pr = p[i]; const orig = Math.round(pr * 1.25);
    products.push(P(`${b} ${m}`, 'electronics', b, pr, orig, Math.round((1 - pr / orig) * 100), 'audio', 's1', i === 0,
        { Brand: b, Type: m.includes('Speaker') ? 'Speaker' : 'Headphone' }, [b.toLowerCase(), 'audio']));
}));

// === TVs & CAMERAS & ACCESSORIES (30) ===
[['Samsung 108cm 43" Crystal 4K UHD TV', 27990, 41990], ['Samsung 138cm 55" QLED 4K TV', 54990, 74990], ['LG 139cm 55" OLED C3 TV', 109990, 139990], ['LG 108cm 43" UHD 4K TV', 29990, 39990], ['Sony Bravia 139cm 55" 4K LED', 59990, 79990], ['Sony Bravia 164cm 65" 4K LED', 89990, 119990], ['TCL 108cm 43" 4K UHD Google TV', 22990, 29990], ['Xiaomi Smart TV 5A 80cm 32"', 11999, 17999], ['OnePlus 108cm 43" Y1S Pro TV', 24999, 32999], ['Hisense 139cm 55" 4K QLED TV', 34990, 49990]].forEach(([t, p, o], i) => {
    products.push(P(t, 'electronics', t.split(' ')[0], p, o, Math.round((1 - p / o) * 100), 'tv', 's1', i < 3, { Type: 'Smart TV' }, 'tv'));
});
[['Canon EOS R50 + 18-45mm', 62990, 72990], ['Canon EOS 200D II DSLR', 52990, 59990], ['Nikon Z50 Mirrorless', 72990, 84990], ['Sony Alpha A6400 Mirrorless', 69990, 80990], ['GoPro Hero 12 Black', 39990, 44990], ['DJI Osmo Action 4', 29990, 34990], ['Fujifilm Instax Mini 12', 5990, 7490], ['Sony ZV-1 II Vlog Camera', 59990, 69990]].forEach(([t, p, o], i) => {
    products.push(P(t, 'electronics', t.split(' ')[0], p, o, Math.round((1 - p / o) * 100), 'cameras', 's1', i < 2, { Type: 'Camera' }, 'camera'));
});
[['Apple Watch Series 9 GPS 45mm', 44900, 44900], ['Apple Watch SE 2nd Gen 40mm', 29900, 29900], ['Samsung Galaxy Watch6 Classic', 29999, 37999], ['Samsung Galaxy Watch FE', 16999, 21999], ['Fire-Boltt Phoenix AMOLED', 1499, 6999], ['Noise ColorFit Pro 5', 2999, 5999], ['boAt Wave Sigma', 1299, 3999], ['Amazfit GTS 4 Mini', 5999, 8999], ['Garmin Venu 3 AMOLED GPS', 49990, 54990], ['Fitbit Charge 5', 12999, 16999], ['Titan Smart Pro', 7999, 12999], ['Fastrack Reflex Play+', 2495, 4995]].forEach(([t, p, o], i) => {
    products.push(P(t, 'electronics', t.split(' ')[0], p, o, Math.round((1 - p / o) * 100), 'watches', 's1', i < 3, { Type: 'Smartwatch' }, 'smartwatch'));
});
// Accessories
[['Logitech MX Master 3S Mouse', 8995, 10495], ['Logitech MX Keys S Keyboard', 9995, 12995], ['Logitech C920 HD Webcam', 6995, 8595], ['Apple iPad Air M1 64GB', 54900, 59900], ['Samsung Galaxy Tab S9 FE', 36999, 44999], ['WD My Passport 2TB HDD', 4999, 7499], ['SanDisk Ultra 512GB microSD', 3499, 5999], ['Anker PowerCore 20000mAh', 2499, 3999], ['Belkin 10W Wireless Charger', 1999, 3499], ['Apple Pencil 2nd Gen', 11900, 13900]].forEach(([t, p, o], i) => {
    products.push(P(t, 'electronics', t.split(' ')[0], p, o, Math.round((1 - p / o) * 100), 'laptops', 's1', i < 2, { Type: 'Accessory' }, 'accessory'));
});

// === FASHION (80) ===
const fashItems = [
    ["Levi's 511 Slim Fit Jeans Dark Indigo", 1799, 3999, "Levi's"], ["Levi's 501 Original Fit Jeans", 2499, 4999, "Levi's"], ["Levi's Trucker Jacket", 3999, 6999, "Levi's"],
    ['Nike Air Max 270 React Shoes', 8995, 13995, 'Nike'], ['Nike Air Force 1 07 Sneakers', 7495, 8995, 'Nike'], ['Nike Revolution 6 Running', 3495, 4995, 'Nike'], ['Nike Dri-FIT Training Tee', 999, 1799, 'Nike'], ['Nike Brasilia Backpack', 2295, 2995, 'Nike'], ['Nike Sportswear Club Hoodie', 2995, 4495, 'Nike'],
    ['Adidas Ultraboost Light Shoes', 12999, 16999, 'Adidas'], ['Adidas Stan Smith Sneakers', 7999, 9999, 'Adidas'], ['Adidas Essentials 3-Stripe Tee', 999, 1799, 'Adidas'], ['Adidas Tiro 23 Track Pants', 2499, 3999, 'Adidas'], ['Adidas Originals Superstar', 6999, 8999, 'Adidas'],
    ['Puma RS-X Sneakers', 3999, 7999, 'Puma'], ['Puma Softride Rift Slip-On', 2499, 4499, 'Puma'], ['Puma T7 Track Jacket', 2999, 4999, 'Puma'], ['Puma Essentials Logo Tee', 699, 1299, 'Puma'],
    ['Allen Solly Regular Fit Polo', 699, 1499, 'Allen Solly'], ['Allen Solly Slim Fit Formal Shirt', 999, 2499, 'Allen Solly'], ['Allen Solly Chino Pants', 1299, 2999, 'Allen Solly'],
    ['Van Heusen Slim Fit Formal Shirt', 1299, 2999, 'Van Heusen'], ['Van Heusen Women Blazer', 3499, 6999, 'Van Heusen'], ['Van Heusen Men Suit Set', 5999, 12999, 'Van Heusen'],
    ["U.S. Polo Slim Fit Casual Shirt", 1299, 2999, 'U.S. Polo'], ["U.S. Polo Polo T-Shirt", 799, 1699, 'U.S. Polo'], ["U.S. Polo Denim Jeans", 1499, 2999, 'U.S. Polo'],
    ['Peter England Formal Trousers', 999, 1999, 'Peter England'], ['Peter England Printed Shirt', 799, 1599, 'Peter England'],
    ['H&M Floral Midi Dress', 1499, 2999, 'H&M'], ['H&M Oversized Hoodie', 1299, 2499, 'H&M'], ['H&M Slim Fit Chinos', 999, 1999, 'H&M'], ['H&M Linen Blend Shirt', 1499, 2499, 'H&M'],
    ['Zara Textured Weave Blazer', 3999, 7999, 'Zara'], ['Zara Leather Belt', 1499, 2999, 'Zara'], ['Zara Slim Fit Polo', 1299, 2499, 'Zara'],
    ['Tommy Hilfiger Leather Belt', 1999, 3499, 'Tommy Hilfiger'], ['Tommy Hilfiger Polo T-Shirt', 2499, 4999, 'Tommy Hilfiger'], ['Tommy Hilfiger Slim Jeans', 3999, 6999, 'Tommy Hilfiger'],
    ['Ray-Ban Aviator Classic', 7490, 9990, 'Ray-Ban'], ['Ray-Ban Wayfarer Classic', 8490, 10990, 'Ray-Ban'],
    ['Fossil Chronograph Watch', 6995, 12995, 'Fossil'], ['Fossil Minimalist Watch', 5995, 9995, 'Fossil'], ['Casio G-Shock GA-2100', 8995, 10995, 'Casio'], ['Titan Raga Women Watch', 4995, 7995, 'Titan'], ['Fastrack Reflex Smartwatch', 2495, 4995, 'Fastrack'],
    ['Wildcraft 35L Laptop Backpack', 1199, 2499, 'Wildcraft'], ['American Tourister Polycarbonate 68cm', 3499, 7999, 'American Tourister'], ['Skybags Brat Daypack 22L', 699, 1499, 'Skybags'], ['Safari Pentagon 55cm Trolley', 2499, 5999, 'Safari'],
    ['FLX Running Shoes', 999, 1999, 'FLX'], ['Skechers Go Walk 6', 4999, 6999, 'Skechers'], ['Crocs Classic Clog', 2495, 3495, 'Crocs'], ['Woodland Casual Shoes', 2999, 4999, 'Woodland'], ['Red Tape Sneakers', 1499, 3999, 'Red Tape'],
    ['Monte Carlo Wool Sweater', 1499, 3499, 'Monte Carlo'], ['Park Avenue Formal Shirt', 1299, 2499, 'Park Avenue'], ['Raymond Suit Fabric 3.25m', 4999, 8999, 'Raymond'],
    ['Bata Men Formal Shoes', 999, 1999, 'Bata'], ['Bata Women Ballerinas', 799, 1499, 'Bata'], ['Liberty Warrior Sneakers', 899, 1599, 'Liberty'],
    ['Jockey Men Trunk Pack of 3', 699, 999, 'Jockey'], ['Jockey Women Camisole', 399, 699, 'Jockey'], ['Hanes V-Neck T-Shirt 3pk', 599, 999, 'Hanes'],
    ['W Women Kurta Palazzo Set', 1499, 2999, 'W'], ['Biba Printed Anarkali Kurta', 1299, 2599, 'Biba'], ['Fabindia Cotton Dupatta', 599, 999, 'Fabindia'],
    ['Global Desi Floral Maxi Dress', 1999, 3999, 'Global Desi'], ['AND Women Blazer', 2499, 4999, 'AND'], ['Aurelia Printed A-Line Kurta', 799, 1599, 'Aurelia'],
];
fashItems.forEach(([t, p, o, b], i) => {
    products.push(P(t, 'fashion', b, p, o, Math.round((1 - p / o) * 100), 'fashion', 's2', i < 5, { Brand: b }, [b.toLowerCase(), 'fashion']));
});

// === BOOKS (50) ===
const booksList = [
    ['Atomic Habits - James Clear', 399, 699], ['Psychology of Money - Morgan Housel', 299, 399], ['Ikigai - Héctor García', 249, 350], ['Rich Dad Poor Dad - Robert Kiyosaki', 299, 499], ['The Alchemist - Paulo Coelho', 199, 350],
    ['Sapiens - Yuval Noah Harari', 399, 599], ['Think and Grow Rich - Napoleon Hill', 199, 299], ['The Art of War - Sun Tzu', 149, 249], ['Deep Work - Cal Newport', 349, 499], ['Thinking, Fast and Slow - Daniel Kahneman', 449, 699],
    ['The 7 Habits - Stephen Covey', 299, 499], ['How to Win Friends - Dale Carnegie', 199, 299], ['The Power of Now - Eckhart Tolle', 249, 399], ['Man Search for Meaning - Viktor Frankl', 199, 299], ['Meditations - Marcus Aurelius', 149, 249],
    ['Zero to One - Peter Thiel', 299, 499], ['Start with Why - Simon Sinek', 299, 499], ['Good to Great - Jim Collins', 399, 599], ['The Lean Startup - Eric Ries', 349, 499], ['Rework - Jason Fried', 299, 399],
    ['1984 - George Orwell', 199, 299], ['To Kill a Mockingbird - Harper Lee', 249, 399], ['Harry Potter Box Set 1-7', 2999, 4999], ['The Great Gatsby - F. Scott Fitzgerald', 149, 249], ['Lord of the Rings Trilogy', 999, 1699],
    ['Dune - Frank Herbert', 399, 599], ['Brave New World - Aldous Huxley', 199, 299], ['Fahrenheit 451 - Ray Bradbury', 199, 299], ['The Hitchhiker Guide - Douglas Adams', 249, 399], ['Foundation - Isaac Asimov', 299, 499],
    ['Educated - Tara Westover', 349, 499], ['Becoming - Michelle Obama', 499, 799], ['The Subtle Art - Mark Manson', 249, 399], ['Shoe Dog - Phil Knight', 349, 499], ['Steve Jobs - Walter Isaacson', 499, 699],
    ['Data Structures with Python', 449, 699], ['Clean Code - Robert C. Martin', 499, 799], ['Design Patterns - GoF', 599, 899], ['CLRS Algorithms', 849, 1299], ['Computer Networking - Kurose', 599, 899],
    ['Bhagavad Gita As It Is', 149, 299], ['Autobiography of a Yogi', 199, 349], ['The Monk Who Sold Ferrari', 199, 299], ['You Can Win - Shiv Khera', 149, 249], ['Wings of Fire - APJ Abdul Kalam', 199, 299],
    ['A Brief History of Time - Hawking', 299, 499], ['Cosmos - Carl Sagan', 399, 599], ['The Origin of Species - Darwin', 249, 399], ['Astrophysics for People - Tyson', 299, 449], ['Surely You are Joking Feynman', 299, 499],
];
booksList.forEach(([t, p, o], i) => {
    const author = t.split(' - ')[1] || 'Various';
    products.push(P(t, 'books', author, p, o, Math.round((1 - p / o) * 100), 'books', 's3', i < 5, { Author: author, Pages: String(200 + Math.floor(Math.random() * 300)) }, [author.toLowerCase(), 'book']));
});

// === HOME & KITCHEN (60) ===
const homeItems = [
    ['Prestige Iris 750W Mixer Grinder 3 Jars', 2499, 4495, 'Prestige'], ['Prestige Svachh Pressure Cooker 5L', 1899, 2999, 'Prestige'], ['Prestige Electric Kettle 1.5L', 799, 1299, 'Prestige'],
    ['Butterfly Rapid Mixer Grinder 750W', 2199, 3499, 'Butterfly'], ['Butterfly Smart Glass Top 3B Gas Stove', 3499, 5999, 'Butterfly'],
    ['Pigeon 12-Piece Non-Stick Cookware Set', 1999, 4999, 'Pigeon'], ['Pigeon Handy Chopper', 299, 599, 'Pigeon'], ['Pigeon LED Desk Lamp', 499, 999, 'Pigeon'],
    ['Philips Air Fryer HD9200 4.1L', 6999, 9999, 'Philips'], ['Philips Hand Blender Daily Collection', 1999, 2999, 'Philips'], ['Philips Juicer Mixer Grinder', 3999, 5999, 'Philips'],
    ['Bosch MaxoMixx Hand Blender 1000W', 4999, 6999, 'Bosch'], ['Bosch TrueMixx Mixer Grinder', 3999, 5999, 'Bosch'],
    ['Dyson V12 Detect Slim Vacuum', 44900, 52900, 'Dyson'], ['Dyson Pure Cool Air Purifier', 29900, 39900, 'Dyson'],
    ['IKEA KALLAX Shelf Unit White', 5999, 7999, 'IKEA'], ['IKEA MALM Chest of 4 Drawers', 11999, 14999, 'IKEA'], ['IKEA POÄNG Armchair', 8999, 10999, 'IKEA'],
    ['Havells 3L Instant Water Heater', 3799, 5499, 'Havells'], ['Havells 1200mm Ceiling Fan', 1999, 2999, 'Havells'], ['Havells HD3201 Hair Dryer', 999, 1699, 'Havells'],
    ['Bajaj Majesty 2200W Induction Cooktop', 1899, 2999, 'Bajaj'], ['Bajaj 36L Oven Toaster Grill', 4999, 6999, 'Bajaj'],
    ['Kent Grand 8L RO Water Purifier', 14999, 21999, 'Kent'], ['Kent Aura Room Air Purifier', 9999, 14999, 'Kent'],
    ['Amazon Basics Cotton Bath Towel 6pk', 1299, 2699, 'Amazon Basics'], ['Amazon Basics Microfiber Cleaning Cloth 24pk', 499, 999, 'Amazon Basics'], ['Amazon Basics Stainless Steel Bottle 1L', 599, 999, 'Amazon Basics'],
    ['Borosil 500ml Vacuum Flask', 799, 1299, 'Borosil'], ['Borosil Glass Lunch Box Set', 999, 1599, 'Borosil'],
    ['Milton Thermosteel Flask 1L', 699, 1199, 'Milton'], ['Milton Aura 900ml Thermos', 599, 999, 'Milton'],
    ['Cello Opalware Dinner Set 19pc', 1499, 2999, 'Cello'], ['Cello Checkers Water Bottle 1L 6pk', 499, 999, 'Cello'],
    ['InstaCuppa French Press 600ml', 999, 1999, 'InstaCuppa'], ['InstaCuppa Infuser Water Bottle', 699, 1299, 'InstaCuppa'],
    ['Eureka Forbes Quick Clean DX Vacuum', 5999, 8999, 'Eureka Forbes'],
    ['Wipro 9W LED Bulb Pack of 6', 499, 899, 'Wipro'], ['Wipro Next Smart WiFi LED Bulb', 799, 1299, 'Wipro'],
    ['Crompton Greaves Tower Fan', 3499, 4999, 'Crompton'], ['Crompton Aura Personal Cooler', 5499, 7999, 'Crompton'],
    ['Morphy Richards OTG 52L', 7999, 11999, 'Morphy Richards'], ['Morphy Richards Sandwich Maker', 1499, 2499, 'Morphy Richards'],
    ['Preethi Zodiac MG 218 Mixer', 5999, 8999, 'Preethi'], ['Preethi Electric Pressure Cooker', 3999, 5999, 'Preethi'],
    ['Wonderchef Nutri-Blend Mixer', 2499, 3999, 'Wonderchef'], ['Wonderchef Italian Cookware Set 5pc', 3999, 6999, 'Wonderchef'],
    ['Solimo Microfiber Comforter Double', 1299, 2499, 'Solimo'], ['Solimo 100% Cotton Bedsheet', 599, 1199, 'Solimo'],
    ['Kuber Industries Storage Box Set 6pc', 699, 1299, 'Kuber'], ['Kuber Industries Foldable Laundry Bag', 399, 799, 'Kuber'],
    ['Story@Home Curtains Set of 2', 799, 1599, 'Story@Home'], ['Story@Home Door Mat Pack of 3', 399, 799, 'Story@Home'],
    ['Urban Ladder Engineered Wood TV Unit', 7999, 12999, 'Urban Ladder'], ['Urban Ladder Solid Wood Coffee Table', 9999, 16999, 'Urban Ladder'],
    ['Sleepyhead 6" Foam Mattress Queen', 5999, 11999, 'Sleepyhead'], ['Wakefit Orthopaedic Memory Foam Mattress', 7999, 14999, 'Wakefit'], ['SleepyCat 8" Gel Memory Foam Mattress', 9999, 18999, 'SleepyCat'],
];
homeItems.forEach(([t, p, o, b], i) => {
    products.push(P(t, 'home', b, p, o, Math.round((1 - p / o) * 100), 'home', 's4', i < 4, { Brand: b }, [b.toLowerCase(), 'home']));
});

// === SPORTS & FITNESS (40) ===
const sportsItems = [
    ['Boldfit Yoga Mat 6mm Anti-Slip', 499, 1499, 'Boldfit'], ['Boldfit Resistance Bands Set of 5', 599, 1299, 'Boldfit'], ['Boldfit Push Up Board', 499, 999, 'Boldfit'],
    ['Hex Dumbbell Set with Stand 2.5-15kg', 12999, 19999, 'PowerFit'], ['PowerFit Adjustable Bench', 6999, 10999, 'PowerFit'], ['PowerFit Pull Up Bar Doorway', 799, 1499, 'PowerFit'],
    ['Nivia Storm Football Size 5', 499, 899, 'Nivia'], ['Nivia Pro Strike Volleyball', 699, 1299, 'Nivia'],
    ['Yonex Nanoray Light 18i Racket', 1990, 3490, 'Yonex'], ['Yonex Mavis 350 Shuttlecock 6pk', 650, 899, 'Yonex'], ['Yonex VCORE Pro 97 Tennis Racket', 11999, 17999, 'Yonex'],
    ['Fitbit Charge 5 Fitness Tracker', 12999, 16999, 'Fitbit'], ['Fitbit Inspire 3 Tracker', 7999, 10999, 'Fitbit'],
    ['Nike Dri-FIT Training T-Shirt', 999, 1799, 'Nike'], ['Nike Pro Training Shorts', 1499, 2499, 'Nike'], ['Nike Shin Guard', 599, 999, 'Nike'],
    ['Adidas Predator Firm Ground Boots', 5999, 8999, 'Adidas'], ['Adidas Tensaur Running Shoes', 2199, 3499, 'Adidas'],
    ['Puma Running Shorts', 799, 1499, 'Puma'], ['Puma Evostripe Training Jacket', 2499, 3999, 'Puma'],
    ['Strauss Adjustable Skipping Rope', 299, 799, 'Strauss'], ['Strauss Yoga Block Set of 2', 399, 799, 'Strauss'], ['Strauss Gym Gloves with Wrist Support', 399, 799, 'Strauss'],
    ['SG Cricket Bat Kashmir Willow', 1499, 2999, 'SG'], ['SG Test Cricket Ball', 399, 599, 'SG'],
    ['Cosco All Court Basketball Size 7', 899, 1499, 'Cosco'], ['Cosco Table Tennis Racket Set', 499, 899, 'Cosco'],
    ['Decathlon Artengo TR130 Tennis Racket', 1499, 2499, 'Decathlon'], ['Decathlon Kiprun Running Shoes', 2999, 4999, 'Decathlon'], ['Decathlon Domyos 20kg Dumbbell Kit', 4999, 7999, 'Decathlon'],
    ['Under Armour Tech 2.0 Tee', 1499, 2999, 'Under Armour'], ['Under Armour Training Shoes', 4999, 7999, 'Under Armour'],
    ['Reebok Nano X3 Training Shoes', 6999, 9999, 'Reebok'], ['Reebok Lite Plus 3 Running', 3999, 5999, 'Reebok'],
    ['Speedo Silicone Swim Cap', 499, 799, 'Speedo'], ['Speedo Hydropure Goggle', 999, 1599, 'Speedo'],
    ['TRX All-in-One Suspension Trainer', 8999, 13999, 'TRX'], ['BodyBand Resistance Tube Set', 799, 1499, 'BodyBand'],
    ['Burn Elliptical Cross Trainer', 19999, 29999, 'Burn'], ['Reach Motorized Treadmill 4HP', 24999, 39999, 'Reach'],
];
sportsItems.forEach(([t, p, o, b], i) => {
    products.push(P(t, 'sports', b, p, o, Math.round((1 - p / o) * 100), 'sports', 's5', i < 3, { Brand: b }, [b.toLowerCase(), 'sports']));
});

// === BEAUTY & HEALTH (40) ===
const beautyItems = [
    ['Maybelline Fit Me Foundation SPF22', 399, 550, 'Maybelline'], ['Maybelline Lash Sensational Mascara', 499, 699, 'Maybelline'], ['Maybelline SuperStay Matte Ink', 499, 699, 'Maybelline'], ['Maybelline Color Sensational Lipstick', 349, 499, 'Maybelline'],
    ["L'Oreal Paris Revitalift Cream", 599, 899, "L'Oreal"], ["L'Oreal Paris Total Repair 5 Shampoo", 399, 599, "L'Oreal"], ["L'Oreal Paris UV Perfect SPF50", 599, 799, "L'Oreal"],
    ['Mamaearth Vitamin C Face Wash 150ml', 249, 349, 'Mamaearth'], ['Mamaearth Onion Hair Oil 250ml', 349, 499, 'Mamaearth'], ['Mamaearth Ubtan Face Mask', 299, 449, 'Mamaearth'], ['Mamaearth Aloe Vera Gel 300ml', 249, 399, 'Mamaearth'],
    ['Philips BT1233 Beard Trimmer', 1149, 1795, 'Philips'], ['Philips BHS397 Hair Straightener', 1499, 2495, 'Philips'], ['Philips HP8120 Hair Dryer', 999, 1595, 'Philips'],
    ['The Man Company Charcoal Face Wash', 345, 499, 'The Man Company'], ['The Man Company Body Wash 500ml', 449, 699, 'The Man Company'],
    ['Nivea Soft Moisturizing Cream 300ml', 249, 349, 'Nivea'], ['Nivea Men Dark Spot Reduction', 249, 399, 'Nivea'],
    ['Lakme 9 to 5 Primer + Matte Foundation', 549, 699, 'Lakme'], ['Lakme Absolute Gel Stylist Nail Color', 199, 299, 'Lakme'], ['Lakme Eyeconic Kajal Deep Black', 249, 349, 'Lakme'],
    ['Forest Essentials Soundarya Cream', 2750, 3250, 'Forest Essentials'], ['Forest Essentials Facial Cleanser', 1250, 1550, 'Forest Essentials'],
    ['Biotique Bio Green Apple Shampoo 340ml', 215, 299, 'Biotique'], ['Biotique Bio Kelp Protein Shampoo', 249, 349, 'Biotique'],
    ['WOW Skin Science Apple Cider Shampoo', 449, 599, 'WOW'], ['WOW Vitamin C Face Serum', 499, 699, 'WOW'],
    ['mCaffeine Coffee Body Scrub', 449, 599, 'mCaffeine'], ['mCaffeine Naked & Raw Coffee Face Wash', 349, 499, 'mCaffeine'],
    ['Dove Daily Moisture Shampoo 650ml', 399, 530, 'Dove'], ['Dove Deeply Nourishing Body Wash', 299, 399, 'Dove'],
    ['Cetaphil Gentle Skin Cleanser 500ml', 899, 1099, 'Cetaphil'], ['CeraVe Moisturizing Cream 539g', 1499, 1999, 'CeraVe'],
    ['Plum Green Tea Face Wash', 349, 450, 'Plum'], ['Plum Vitamin C Serum', 549, 699, 'Plum'],
    ['Himalaya Neem Face Wash 200ml', 175, 230, 'Himalaya'], ['Himalaya Lip Balm', 99, 149, 'Himalaya'],
    ['Colgate Max Fresh Toothpaste 600g', 249, 349, 'Colgate'], ['Oral-B Vitality Electric Toothbrush', 1199, 1799, 'Oral-B'],
    ['Gillette Fusion5 ProGlide Razor', 699, 999, 'Gillette'], ['Braun Series 3 Electric Shaver', 3499, 5499, 'Braun'],
];
beautyItems.forEach(([t, p, o, b], i) => {
    products.push(P(t, 'beauty', b, p, o, Math.round((1 - p / o) * 100), 'beauty', 's2', i < 3, { Brand: b }, [b.toLowerCase(), 'beauty']));
});

// === TOYS & GAMES (30) ===
const toyItems = [
    ['LEGO Classic Creative Bricks 484pc', 1999, 2999, 'LEGO'], ['LEGO City Fire Station 60320', 3999, 5499, 'LEGO'], ['LEGO Technic Lamborghini', 29999, 42999, 'LEGO'], ['LEGO Star Wars Millennium Falcon', 12999, 16999, 'LEGO'], ['LEGO Friends Heartlake City', 2999, 4499, 'LEGO'],
    ['Monopoly Classic Board Game', 699, 999, 'Hasbro'], ['Scrabble Original Board Game', 599, 899, 'Hasbro'], ['Cluedo Classic Mystery Game', 799, 1199, 'Hasbro'], ['Jenga Classic', 499, 699, 'Hasbro'], ['Risk Strategy Board Game', 1499, 2499, 'Hasbro'],
    ['Hot Wheels 20-Car Gift Pack', 1299, 1999, 'Hot Wheels'], ['Hot Wheels Track Builder Set', 1999, 3499, 'Hot Wheels'], ['Hot Wheels Monster Trucks 1:24', 799, 1299, 'Hot Wheels'],
    ["Rubik's Cube 3x3 Speed Cube", 349, 599, "Rubik's"], ["Rubik's Cube 4x4 Master", 599, 999, "Rubik's"],
    ['Nerf Elite 2.0 Commander RD-6', 999, 1799, 'Nerf'], ['Nerf Fortnite AR-L Dart Blaster', 1999, 3499, 'Nerf'],
    ['Barbie Dreamhouse Playset', 4999, 7999, 'Barbie'], ['Barbie Fashionista Doll', 699, 999, 'Barbie'],
    ['Play-Doh 36-Pack Case of Colors', 1499, 2499, 'Play-Doh'], ['Play-Doh Kitchen Creations', 999, 1799, 'Play-Doh'],
    ['UNO Card Game', 199, 299, 'Mattel'], ['Pictionary Card Game', 349, 499, 'Mattel'],
    ['Funskool Chess Set', 299, 499, 'Funskool'], ['Funskool Carrom Board 32"', 1999, 3499, 'Funskool'],
    ['FunBlast Magnetic Building Blocks 100pc', 999, 1999, 'FunBlast'], ['FunBlast RC Car Off-Road', 1499, 2999, 'FunBlast'],
    ['Toyshine DIY Art Set 150pc', 599, 1199, 'Toyshine'], ['Toyshine Science Kit STEM', 799, 1499, 'Toyshine'],
    ['Ravensburger 1000pc Puzzle World Map', 999, 1499, 'Ravensburger'],
];
toyItems.forEach(([t, p, o, b], i) => {
    products.push(P(t, 'toys', b, p, o, Math.round((1 - p / o) * 100), 'toys', 's4', i < 3, { Brand: b }, [b.toLowerCase(), 'toys']));
});

// === GROCERY (40) ===
const groceryItems = [
    ['Tata Sampann Unpolished Toor Dal 1kg', 149, 199, 'Tata'], ['Tata Salt 1kg', 28, 32, 'Tata'], ['Tata Tea Gold 500g', 255, 299, 'Tata'],
    ['Aashirvaad Whole Wheat Atta 10kg', 449, 549, 'Aashirvaad'], ['Aashirvaad Multigrain Atta 5kg', 299, 369, 'Aashirvaad'],
    ['Fortune Sunlite Refined Oil 5L', 649, 799, 'Fortune'], ['Fortune Soya Health Oil 5L', 599, 749, 'Fortune'],
    ['Cadbury Dairy Milk Silk 150g', 150, 180, 'Cadbury'], ['Cadbury Celebrations Gift Pack', 349, 449, 'Cadbury'], ['Cadbury Bournville Dark 70% 80g', 120, 150, 'Cadbury'],
    ['Nescafé Classic Instant Coffee 200g', 425, 499, 'Nescafé'], ['Nescafé Gold Blend 100g', 549, 649, 'Nescafé'],
    ['Organic India Tulsi Green Tea 25bags', 199, 299, 'Organic India'], ['Organic India Ashwagandha Capsules', 449, 599, 'Organic India'],
    ['Britannia NutriChoice Oats 450g', 120, 160, 'Britannia'], ['Britannia Good Day Butter Cookies 600g', 140, 180, 'Britannia'], ['Britannia Marie Gold 600g', 90, 120, 'Britannia'],
    ['Maggi 2-Min Noodles Masala 12pk', 144, 168, 'Maggi'], ['Maggi Hot & Sweet Sauce 500g', 120, 149, 'Maggi'],
    ['Haldiram Nagpur Soan Papdi 500g', 199, 249, 'Haldiram'], ['Haldiram Mini Samosa 200g', 99, 149, "Haldiram"],
    ['Paper Boat Aamras 200ml Pack of 6', 180, 240, 'Paper Boat'], ['Paper Boat Jaljeera 200ml 6pk', 180, 240, 'Paper Boat'],
    ['Saffola Gold Refined Oil 5L', 749, 899, 'Saffola'], ['Saffola Oats 1kg', 175, 225, 'Saffola'],
    ['Sundrop Heart Cooking Oil 5L', 599, 749, 'Sundrop'], ['Real Fruit Power Mixed Fruit 1L', 99, 130, 'Real'],
    ['Too Yumm Multigrain Chips 6pk', 180, 240, 'Too Yumm'], ['Act II Microwave Popcorn 12pk', 300, 420, 'Act II'],
    ['Tropicana 100% Orange Juice 1L', 110, 140, 'Tropicana'], ['B Natural Mixed Fruit 1L', 89, 120, 'B Natural'],
    ['Kissan Mixed Fruit Jam 500g', 145, 175, 'Kissan'], ['Peanut Butter Crunchy 1kg', 349, 499, 'MyFitness'],
    ['Baidyanath Chyawanprash 1kg', 275, 350, 'Baidyanath'], ['Dabur Honey 500g', 219, 275, 'Dabur'],
    ['Red Label Tea 500g', 235, 275, 'Red Label'], ['Society Tea Masala 250g', 149, 199, 'Society'],
    ['India Gate Basmati Rice Classic 5kg', 449, 549, 'India Gate'], ['Daawat Biryani Basmati Rice 5kg', 499, 599, 'Daawat'],
    ['MDH Chana Masala 100g', 65, 85, 'MDH'], ['Everest Kitchen King Masala 100g', 80, 105, 'Everest'],
];
groceryItems.forEach(([t, p, o, b], i) => {
    products.push(P(t, 'grocery', b, p, o, Math.round((1 - p / o) * 100), 'grocery', 's4', i < 3, { Brand: b }, [b.toLowerCase(), 'grocery']));
});

console.log(`Generated ${products.length} products`);
module.exports = products;
