import { PrismaClient, TrackingStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  // Clean up
  await prisma.stockAlert.deleteMany();
  await prisma.trackingEvent.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.promoCode.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const passwordHash = await bcrypt.hash('password123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@dripnest.com',
      passwordHash,
      role: 'ADMIN',
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@dripnest.com',
      passwordHash,
      role: 'CUSTOMER',
    },
  });

  // Promo Codes
  await prisma.promoCode.createMany({
    data: [
      { code: 'DRIP10', discountType: 'PERCENT', value: 10, minOrderValue: 0 },
      { code: 'NEST20', discountType: 'PERCENT', value: 20, minOrderValue: 80 },
      { code: 'FIRST30', discountType: 'FLAT', value: 30, minOrderValue: 120 },
    ],
  });

  // Base Products Configuration
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const baseColours = [
    { name: 'Black', hex: '#0a0a0a' },
    { name: 'White', hex: '#faf9f7' },
    { name: 'Navy', hex: '#1a2a40' },
    { name: 'Olive', hex: '#3d9970' },
    { name: 'Charcoal', hex: '#1a1a1a' },
  ];

  const MENS_IDS = ['1617137984095-74e4e5e3613f', '1516259762381-22954d7d3ad2', '1488161628813-04466f872be2', '1492562080023-ab3db95bfbce', '1503342217505-b0a15ec3261c', '1550246123-246d71ae8c28'];
  const WOMENS_IDS = ['1539109136881-3be0616acf4b', '1515886657613-9f3515b0c78f', '1496747611176-843222e1e57c', '1509631179647-0177331693ae', '1494790108377-be9c29b29330', '1529139513055-0643d42488a4'];
  const APPAREL_IDS = ['1556821840-3a63f95609a7', '1576566588028-4147f3842f27', '1591047139829-d91aecb6caea', '1523381235312-3c1a47f50249', '1618354691373-d851c5c5a9ad'];
  const ACCESSORY_IDS = ['1523275335684-37898b6baf30', '1572635196237-14b3f281503f', '1584917865442-de89df76afd3', '1611085392856-c04d6a6a2521', '1611634560934-297059728461'];

  const generateImages = (category: string, index: number, count: number = 3) => {
    let ids = MENS_IDS;
    if (category === 'WOMENS') ids = WOMENS_IDS;
    if (category === 'APPAREL') ids = APPAREL_IDS;
    if (category === 'ACCESSORIES') ids = ACCESSORY_IDS;
    
    return Array.from({ length: count }, (_, i) => {
      const photoId = ids[(index + i) % ids.length];
      return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&q=80&w=800`;
    });
  };

  const getRandomRating = () => parseFloat((Math.random() * (5.0 - 3.8) + 3.8).toFixed(1));
  const getRandomReviewCount = () => Math.floor(Math.random() * (340 - 12 + 1)) + 12;

  let productCounter = 1;

  // Track some products to create orders later
  const productsForOrders: any[] = [];

  // MENS Products
  const mensNames = ['Classic Oxford Shirt', 'Essential Hoodie', 'Utility Bomber Jacket', 'Tailored Chinos', 'Slim Fit Suit', 'Linen Co-ord Set', 'Festive Kurta', 'Tech Fleece Joggers', 'Pique Polo Shirt', 'Leather Biker Jacket', 'Straight Fit Jeans', 'Corduroy Shacket'];
  
  for (const name of mensNames) {
    const isSale = productCounter % 3 === 0;
    const price = Math.floor(Math.random() * (200 - 35 + 1) + 35);

    const product = await prisma.product.create({
      data: {
        name,
        slug: name.toLowerCase().replace(/ /g, '-'),
        description: 'Premium quality materials for modern fashion. Designed for comfort and lasting wear.',
        price: isSale ? price * 0.7 : price,
        comparePrice: isSale ? price : null,
        category: 'MENS',
        brand: productCounter % 2 === 0 ? 'DripNest Originals' : 'Urban Canvas',
        tags: JSON.stringify(['men', 'clothing', 'fashion']),
        images: JSON.stringify(generateImages('MENS', productCounter)),
        rating: getRandomRating(),
        reviewCount: getRandomReviewCount(),
        isFeatured: productCounter <= 2,
        isNew: productCounter >= 10,
        isSale,
      },
      include: { variants: true }
    });

    for (let i = 0; i < 3; i++) {
        const variant = await prisma.variant.create({
            data: {
                productId: product.id,
                size: sizes[i % sizes.length],
                colour: baseColours[i % baseColours.length].name,
                colourHex: baseColours[i % baseColours.length].hex,
                stock: (productCounter === 1 && i === 0) ? 0 : Math.floor(Math.random() * 50), // Make first product first variant out of stock
                sku: `SKU-${product.id.substring(0, 5)}-${i}`
            }
        });
        if (productsForOrders.length < 5) productsForOrders.push({ product, variant });
    }
    productCounter++;
  }

  // Seeding more products (briefly)
  const womensNames = ['Floral Maxi Dress', 'Satin Wrap Top'];
  for (const name of womensNames) {
    const product = await prisma.product.create({
      data: {
        name,
        slug: name.toLowerCase().replace(/ /g, '-'),
        description: 'Elegant and versatile wardrobe staple.',
        price: 89.99,
        category: 'WOMENS',
        tags: JSON.stringify(['women', 'clothing']),
        images: JSON.stringify(generateImages('WOMENS', productCounter)),
      }
    });
    await prisma.variant.create({
      data: {
        productId: product.id,
        size: 'S',
        colour: 'White',
        stock: 0, // Out of stock for testing
        sku: `SKU-W-${product.id.substring(0, 5)}`
      }
    });
    productCounter++;
  }

  // Create Sample Orders with Tracking
  const ordersData = [
    {
      id: 'DN-TRACK-001',
      status: 'DELIVERED',
      trackingNumber: 'FDX12345678',
      carrierName: 'FedEx',
      currentStatus: TrackingStatus.DELIVERED,
      events: [
        { status: TrackingStatus.ORDER_PLACED, title: 'Order Placed', description: 'We received your order.', location: undefined, timestamp: new Date(Date.now() - 86400000 * 4) },
        { status: TrackingStatus.CONFIRMED, title: 'Order Confirmed', description: 'Your order has been confirmed.', location: undefined, timestamp: new Date(Date.now() - 86400000 * 3.5) },
        { status: TrackingStatus.PROCESSING, title: 'Processing', description: 'Your order is being prepared.', location: undefined, timestamp: new Date(Date.now() - 86400000 * 3) },
        { status: TrackingStatus.PACKED, title: 'Packed', description: 'Your order is packed and ready.', location: undefined, timestamp: new Date(Date.now() - 86400000 * 2.5) },
        { status: TrackingStatus.HANDED_TO_COURIER, title: 'Handed to Courier', description: 'Tied with FedEx.', location: undefined, timestamp: new Date(Date.now() - 86400000 * 2) },
        { status: TrackingStatus.IN_TRANSIT, title: 'In Transit', description: 'On the way to destination.', location: 'Mumbai Sorting Hub', timestamp: new Date(Date.now() - 86400000 * 1.5) },
        { status: TrackingStatus.OUT_FOR_DELIVERY, title: 'Out for Delivery', description: 'A delivery executive is near you.', location: 'Bandra Center', timestamp: new Date(Date.now() - 86400000 * 0.5) },
        { status: TrackingStatus.DELIVERED, title: 'Delivered', description: 'Package delivered to resident.', location: undefined, timestamp: new Date(Date.now() - 86400000 * 0.1) },
      ]
    },
    {
      id: 'DN-TRACK-002',
      status: 'SHIPPED',
      trackingNumber: 'BD987654321',
      carrierName: 'Blue Dart',
      currentStatus: TrackingStatus.IN_TRANSIT,
      events: [
        { status: TrackingStatus.ORDER_PLACED, title: 'Order Placed', description: 'We received your order.', location: undefined, timestamp: new Date(Date.now() - 86400000 * 1) },
        { status: TrackingStatus.CONFIRMED, title: 'Order Confirmed', description: 'Your order has been confirmed.', location: undefined, timestamp: new Date(Date.now() - 86400000 * 0.8) },
        { status: TrackingStatus.PROCESSING, title: 'Processing', description: 'Your order is being prepared.', location: undefined, timestamp: new Date(Date.now() - 86400000 * 0.5) },
        { status: TrackingStatus.PACKED, title: 'Packed', description: 'Your order is packed and ready.', location: undefined, timestamp: new Date(Date.now() - 86400000 * 0.3) },
        { status: TrackingStatus.HANDED_TO_COURIER, title: 'Handed to Courier', description: 'Collected by Blue Dart.', location: undefined, timestamp: new Date(Date.now() - 86400000 * 0.1) },
      ]
    }
  ];

  for (const o of ordersData) {
    const order = await prisma.order.create({
      data: {
        id: o.id,
        userId: customer.id,
        subtotal: 150,
        total: 160,
        shipping: 10,
        shippingAddress: '123 Test St, Mumbai, Maharashtra 400001',
        trackingNumber: o.trackingNumber,
        carrierName: o.carrierName,
        currentStatus: o.currentStatus,
      }
    });

    for (const event of o.events) {
      await prisma.trackingEvent.create({
        data: {
          orderId: order.id,
          status: event.status,
          title: event.title,
          description: event.description,
          location: event.location,
          timestamp: event.timestamp,
          isCompleted: true,
        }
      });
    }

    // Add 1 random order item
    const item = productsForOrders[Math.floor(Math.random() * productsForOrders.length)];
    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        productId: item.product.id,
        variantId: item.variant.id,
        productName: item.product.name,
        qty: 1,
        priceAtPurchase: item.product.price,
      }
    });
  }

  // Final stock calculation
  const allProducts = await prisma.product.findMany({ include: { variants: true } });
  for (const p of allProducts) {
    const totalStock = p.variants.reduce((acc, v) => acc + v.stock, 0);
    await prisma.product.update({ where: { id: p.id }, data: { stock: totalStock } });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
