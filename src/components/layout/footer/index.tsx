import Link from 'next/link';
import { IconBrandFacebook, IconBrandTwitter, IconBrandInstagram, IconMail, IconPhone, IconMapPin } from '@tabler/icons-react';

const footerLinks = {

  support: [
    { name: 'Contact Us', href: '/contact' },
    { name: 'Shipping Info', href: '/shipping' },
    { name: 'Returns', href: '/returns' },
    { name: 'FAQ', href: '/faq' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
  ],
};

const socialLinks = [
  { name: 'Facebook', href: '#', icon: IconBrandFacebook },
  { name: 'Twitter', href: '#', icon: IconBrandTwitter },
  { name: 'Instagram', href: '#', icon: IconBrandInstagram },
];

export function StoreFooter() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand and contact info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">MF</span>
              </div>
              <span className="font-bold text-xl">Mzansi Footwear</span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-sm">
              Premium South African footwear crafted with passion and precision. 
              Step into authentic style and exceptional comfort.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <IconMapPin className="h-4 w-4" />
                <span>Mpumalanga, South Africa</span>
              </div>
              <div className="flex items-center space-x-2">
                <IconPhone className="h-4 w-4" />
                <span>+27 21 123 4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <IconMail className="h-4 w-4" />
                <span>hello@mzansifootwear.co.za</span>
              </div>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter signup */}
        <div className="mt-12 pt-8 border-t">
          <div className="max-w-md">
            <h3 className="font-semibold mb-2">Stay in the loop</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to our newsletter for the latest updates and exclusive offers.
            </p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 text-sm border border-input rounded-md bg-background"
              />
              <button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4 md:mb-0">
            {footerLinks.legal.map((link, index) => (
              <span key={link.name}>
                <Link href={link.href} className="hover:text-foreground transition-colors">
                  {link.name}
                </Link>
                {index < footerLinks.legal.length - 1 && (
                  <span className="ml-4 text-muted-foreground/50">•</span>
                )}
              </span>
            ))}
          </div>

          {/* Social links */}
          <div className="flex items-center space-x-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <Link
                  key={social.name}
                  href={social.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon className="h-5 w-5" />
                  <span className="sr-only">{social.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Mzansi Footwear. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
