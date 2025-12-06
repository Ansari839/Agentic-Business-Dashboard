import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DUMMY_HEADER = {
    logoText: 'TechHaven',
    ctaLabel: 'Shop Now',
    ctaLink: '/products',
    menuItems: [
        { label: 'Home', href: '/' },
        { label: 'New Arrivals', href: '/products?sort=newest' },
        { label: 'Laptops', href: '/products?category=laptops' },
        { label: 'Accessories', href: '/products?category=accessories' },
        { label: 'Support', href: '/support' },
    ],
};

const DUMMY_SLIDERS = [
    {
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1920',
        title: 'Next Gen Gaming',
        subtitle: 'Experience the future with our latest consoles and peripherals.',
        link: '/products/gaming',
        order: 0,
    },
    {
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=1920',
        title: 'Work From Home Essentials',
        subtitle: 'Upgrade your productivity with ergonomic setups.',
        link: '/products/office',
        order: 1,
    },
    {
        image: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&q=80&w=1920',
        title: 'Summer Sale is Live',
        subtitle: 'Up to 50% off on selected items.',
        link: '/sale',
        order: 2,
    },
];

const DUMMY_FOOTER = [
    {
        title: 'Shop',
        links: [
            { label: 'All Products', href: '/products' },
            { label: 'Best Sellers', href: '/products?filter=best-sellers' },
            { label: 'Deals', href: '/deals' },
        ]
    },
    {
        title: 'Customer Care',
        links: [
            { label: 'Track Order', href: '/order-status' },
            { label: 'Returns & Exchanges', href: '/returns' },
            { label: 'FAQs', href: '/faqs' },
        ]
    },
    {
        title: 'Contact',
        links: [
            { label: 'Email', href: 'mailto:hello@techhaven.com' },
            { label: 'Phone', href: 'tel:+18001234567' },
            { label: 'Address', href: '#' } // Used link for address to simplify schema reuse
        ]
    }
];

const DUMMY_PROMOS = [
    {
        title: 'Limited Time Offer!',
        description: 'Get free shipping on all orders over $500. Use code SHIP500 at checkout.',
        bannerImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1200',
        buttonText: 'Claim Offer',
        buttonLink: '/cart',
        active: true,
    },
    {
        title: 'New Arrivals',
        description: 'Check out the latest tech gadgets.',
        bannerImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200',
        buttonText: 'View New',
        buttonLink: '/products/new',
        active: false,
    }
];

async function seedUi() {
    console.log('Seeding UI Content...');

    // Check if exists
    const existing = await prisma.uiContent.findFirst();

    if (existing) {
        console.log('Updating existing UI Content...');
        await prisma.uiContent.update({
            where: { id: existing.id },
            data: {
                header: JSON.stringify(DUMMY_HEADER),
                sliders: DUMMY_SLIDERS,
                footer: DUMMY_FOOTER,
                promos: DUMMY_PROMOS,
            }
        });
    } else {
        console.log('Creating new UI Content...');
        await prisma.uiContent.create({
            data: {
                header: JSON.stringify(DUMMY_HEADER),
                sliders: DUMMY_SLIDERS,
                footer: DUMMY_FOOTER,
                promos: DUMMY_PROMOS,
            }
        });
    }

    console.log('UI Content seeded successfully.');
}

seedUi()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
