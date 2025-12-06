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

export const DEFAULT_FOOTER = [
    {
        title: 'Company',
        links: [
            { label: 'About Us', href: '/about' },
            { label: 'Careers', href: '/careers' },
        ]
    },
    {
        title: 'Support',
        links: [
            { label: 'Help Center', href: '/help' },
            { label: 'Terms', href: '/terms' },
        ]
    },
    {
        title: 'Contact',
        links: [
            { label: 'Email', href: 'mailto:support@example.com' },
            { label: 'Phone', href: 'tel:+123456789' }
        ]
    }
];

export const DEFAULT_PROMOS = [
    {
        title: 'Summer Sale',
        description: 'Get 50% off on all products',
        bannerImage: 'https://placehold.co/1200x400',
        buttonText: 'Shop Now',
        buttonLink: '/products',
        active: true,
    }
];
