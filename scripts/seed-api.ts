const BASE_URL = 'http://localhost:3000/api';

const products = [
    {
        title: 'Ergonomic Office Chair',
        description: 'High-quality ergonomic chair with lumbar support and adjustable height.',
        specs: JSON.stringify({ material: 'Mesh', maxWeight: '150kg', color: 'Black' }),
        featured: true,
        showOnHome: true,
        metaSEO: JSON.stringify({ title: 'Best Ergonomic Chair 2024', keywords: ['chair', 'ergonomic', 'office'] }),
    },
    {
        title: 'Mechanical Gaming Keyboard',
        description: 'RGB backlit mechanical keyboard with cherry MX red switches.',
        specs: JSON.stringify({ switch: 'Cherry MX Red', layout: '100%', connectivity: 'Wired' }),
        featured: true,
        showOnHome: false,
        metaSEO: JSON.stringify({ title: 'Mechanical Keyboard RGB', keywords: ['keyboard', 'gaming', 'rgb'] }),
    },
    {
        title: 'Wireless Noise Cancelling Headphones',
        description: 'Premium over-ear headphones with active noise cancellation.',
        specs: JSON.stringify({ batteryLife: '30h', connectivity: 'Bluetooth 5.0', type: 'Over-ear' }),
        featured: false,
        showOnHome: true,
        metaSEO: JSON.stringify({ title: 'Noise Cancelling Headphones', keywords: ['audio', 'headphones', 'wireless'] }),
    },
    {
        title: '4K Ultra HD Monitor',
        description: '27-inch 4K IPS monitor with 99% sRGB color gamut.',
        specs: JSON.stringify({ size: '27 inch', resolution: '3840x2160', panel: 'IPS' }),
        featured: true,
        showOnHome: true,
        metaSEO: JSON.stringify({ title: '4K IPS Monitor', keywords: ['monitor', '4k', 'display'] }),
    },
    {
        title: 'Smart Standing Desk',
        description: 'Electric height adjustable desk with memory presets.',
        specs: JSON.stringify({ minHeight: '70cm', maxHeight: '120cm', width: '140cm' }),
        featured: false,
        showOnHome: false,
        metaSEO: JSON.stringify({ title: 'Electric Standing Desk', keywords: ['desk', 'standing', 'office'] }),
    },
];

const inquiryTemplates = [
    { name: 'John Doe', email: 'john@example.com', message: 'Do you offer bulk discounts?' },
    { name: 'Alice Smith', email: 'alice@company.com', message: 'Is shipping to Canada available?' },
    { name: 'Bob Brown', email: 'bob@gmail.com', message: 'When will this be back in stock?' },
    { name: 'Emma Wilson', email: 'emma@tech.com', message: 'Can I get a custom color configuration?' },
    { name: 'David Lee', email: 'david@corp.org', message: 'Does this come with a warranty?' },
];

async function seed() {
    console.log('Starting seed via API...');

    try {
        for (const p of products) {
            const timestamp = Date.now();
            const slug = `${p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}-${timestamp}`;
            console.log(`Creating product: ${p.title}`);
            const res = await fetch(`${BASE_URL}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...p, slug }),
            });

            if (!res.ok) {
                const text = await res.text();
                console.error(`Failed to create product ${p.title}: ${res.status} ${text}`);
                continue;
            }

            const product = await res.json();
            console.log(`Created product ID: ${product.id}`);

            // Create dummy inquiries for each product
            const numInquiries = Math.floor(Math.random() * 3) + 1; // 1 to 3 inquiries per product
            for (let i = 0; i < numInquiries; i++) {
                const template = inquiryTemplates[Math.floor(Math.random() * inquiryTemplates.length)];
                const inquiryData = {
                    productId: product.id,
                    name: template.name,
                    email: template.email,
                    message: `${template.message} (Ref: ${product.title})`,
                };

                console.log(`  -> Creating inquiry from ${inquiryData.name}`);
                const iRes = await fetch(`${BASE_URL}/inquiries`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(inquiryData),
                });

                if (!iRes.ok) {
                    console.error(`  Failed to create inquiry: ${iRes.status}`);
                } else {
                    console.log(`  -> Inquiry created.`);
                }
            }
        }
    } catch (error) {
        console.error('Error during seeding:', error);
        console.log('\nMake sure your Next.js server is running on localhost:3000!');
    }
}

seed();
