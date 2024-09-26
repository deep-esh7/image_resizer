import './globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Online Image Resizer Tool | Resize Images Instantly - resizing.in',
  description: 'Easily resize your images online for free at resizing.in. Our tool allows you to quickly adjust image dimensions while maintaining aspect ratio. Perfect for social media, websites, and more!',
  keywords: 'image resizer, resize images, free image tool, online image editor, photo resize, resizing.in',
  authors: [{ name: 'resizing.in' }],
  creator: 'resizing.in',
  publisher: 'resizing.in',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Free Online Image Resizer Tool | Resize Images Instantly - resizing.in',
    description: 'Easily resize your images online for free at resizing.in. Adjust dimensions while maintaining aspect ratio. Perfect for social media, websites, and more!',
    url: 'https://resizing.in',
    siteName: 'resizing.in - Image Resizer App',
    images: [
      {
        url: 'https://resizing.in/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'resizing.in Image Resizer App Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Image Resizer Tool - resizing.in',
    description: 'Resize your images instantly for free at resizing.in. Perfect for social media and web use!',
    creator: '@resizing_in',  // Replace with your actual Twitter handle if different
    images: ['https://resizing.in/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification-code',
    yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  alternates: {
    canonical: 'https://resizing.in',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'resizing.in - Free Online Image Resizer Tool',
              url: 'https://resizing.in',
              description: 'Easily resize your images online for free at resizing.in. Our tool allows you to quickly adjust image dimensions while maintaining aspect ratio.',
              applicationCategory: 'MultimediaApplication',
              operatingSystem: 'All',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              creator: {
                '@type': 'Organization',
                name: 'resizing.in',
                url: 'https://resizing.in',
              },
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}