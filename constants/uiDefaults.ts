export const DEFAULT_HEADER = {
    menuItems: [
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
    ],
    ctaLabel: 'Get Started',
    ctaLink: '/signup',
    logoText: 'My Brand',
};

export const DEFAULT_SLIDERS = [
    {
        image: 'https://placehold.co/1920x600',
        title: 'Welcome to Our Site',
        subtitle: 'Best products in town',
        link: '/products',
        order: 0,
    },
];

export const DEFAULT_FOOTER = {
    column1: {
        title: 'Company',
        links: [
            { label: 'About Us', href: '/about' },
            { label: 'Careers', href: '/careers' },
        ]
    },
    column2: {
        title: 'Support',
        links: [
            { label: 'Help Center', href: '/help' },
            { label: 'Terms', href: '/terms' },
        ]
    },
    contactInfo: {
        address: '123 Main St, City, Country',
        email: 'support@example.com',
        phone: '+1 234 567 8900'
    }
};

export const DEFAULT_PROMOS = {
    title: 'Summer Sale',
    description: 'Get 50% off on all products',
    bannerImage: 'https://placehold.co/1200x400',
    buttonText: 'Shop Now',
    buttonLink: '/products',
};
