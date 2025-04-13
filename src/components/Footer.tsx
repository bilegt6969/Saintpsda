import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  CircleHelp,
  Newspaper,
  ShoppingBag,
  TrendingUp,
  Ship,
  RotateCcw,
} from 'lucide-react';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  const currentYear = new Date().getFullYear();

  const browseItems = [
    { name: "Sneakers", href: "/categories/sneakers", type: "category" },
    { name: "Apparel", href: "/categories/apparel", type: "category" },
    { name: "Accessories", href: "/categories/accessories", type: "category" },
    { name: "Nike", href: "/brands/nike", type: "brand" },
    { name: "Adidas", href: "/brands/adidas", type: "brand" },
    { name: "Supreme", href: "/brands/supreme", type: "brand" },
    { name: "Stüssy", href: "/brands/stussy", type: "brand" },
    { name: "Bape", href: "/brands/bape", type: "brand" },
    { name: "Off-White", href: "/brands/off-white", type: "brand" },
    { name: "Jordan", href: "/brands/jordan", type: "brand" },
    { name: "PALACE", href: "/brands/palace", type: "brand" }
  ];

  const footerLinks = [
    {
      id: "shop-links",
      title: "Shop",
      links: [
        { name: "For You", href: "/for-you", icon: <TrendingUp /> },
        { name: "New Arrivals", href: "/new", icon: <ShoppingBag /> },
        { name: "Sale", href: "/sale", icon: <TrendingUp /> } // Consider a Sale-specific icon (e.g., Tag)
      ]
    },
    {
      id: "help-links",
      title: "Help",
      links: [
        { name: "FAQ", href: "/FaqPage", icon: <CircleHelp /> },
        { name: "Shipping", href: "/shipping", icon: <Ship /> },
        { name: "Returns", href: "/returns", icon: <RotateCcw /> },
        { name: "Contact", href: "/contact" } // Add Phone or Mail icon?
      ]
    },
    {
      id: "company-links",
      title: "Company",
      links: [
        { name: "About", href: "/about" }, // Add Info icon?
        { name: "Careers", href: "/careers" }, // Add Briefcase icon?
        { name: "Blog", href: "/blog", icon: <Newspaper /> }
      ]
    }
  ];

  // Define common link classes for DRYness
  const linkBaseClasses = "flex items-center text-sm text-neutral-600 hover:text-neutral-900 transition-all duration-200 group focus:outline-none focus-visible:text-neutral-900 focus-visible:underline focus-visible:underline-offset-2";
  const iconBaseClasses = "w-4 h-4 mr-2.5 shrink-0 text-neutral-400 group-hover:text-neutral-700 transition-colors duration-200";

  return (
    <footer className={`bg-white text-neutral-800 rounded-3xl shadow-xl mt-24 mb-8 sm:mb-12 ${className}`}>
       {/* Increased padding for a more spacious feel inside the rounded container */}
      <div className="container mx-auto max-w-7xl px-6 sm:px-8 lg:px-10 py-16 lg:py-20">

        {/* Browse Section */}
        <div className="mb-12 lg:mb-16">
          <h3 className="text-base font-semibold text-neutral-900 mb-6 tracking-tight">
            Explore Collections & Brands
          </h3>
          <div className="relative overflow-x-auto pb-2 -mx-1">
            <div className="flex items-center gap-2.5 min-w-max px-1">
              {browseItems.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className={`text-sm px-4 py-2 rounded-full transition-all duration-200 whitespace-nowrap block border
                    ${item.type === 'category'
                      ? 'bg-neutral-50 border-neutral-200 hover:bg-neutral-100 hover:border-neutral-300 text-neutral-700 hover:shadow-sm'
                      : 'bg-black border-black text-white hover:bg-neutral-800 font-medium hover:shadow-md'}`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 lg:grid-cols-5 xl:gap-12 mb-12 lg:mb-16">

          {/* Logo & About */}
          <div className="md:col-span-2 lg:col-span-2">
            <Link href="/" className="inline-block mb-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:ring-black rounded-md">
              <span className="sr-only">Saint Home</span>
              <Image
                width={160} // Slightly larger
                height={32} // Adjust aspect ratio
                alt="Saint logo"
                src="/images/Untitled (500 x 100 px).svg" // Ensure path is correct!
                className="h-auto"
                priority
              />
            </Link>
            <p className="text-sm text-neutral-600 max-w-xs leading-relaxed">
              Digital PLUG for curated fashion and streetwear essentials. {/* Updated tagline */}
            </p>
          </div>

          {/* Link Columns */}
          {footerLinks.map((section) => (
            <div key={section.id} className="md:col-span-1">
              <h3 id={`footer-nav-${section.id}`} className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-6">
                {section.title}
              </h3>
              <nav aria-labelledby={`footer-nav-${section.id}`}>
                <ul className="space-y-4"> {/* Increased spacing */}
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <Link href={link.href} className={linkBaseClasses}>
                        {link.icon && React.cloneElement(link.icon, { className: iconBaseClasses })}
                         {/* Add margin if no icon, adjust if needed */}
                        <span className={link.icon ? "" : "ml-[26px]"}>
                          {link.name}
                        </span>
                        {/* Optional: Add subtle arrow on hover */}
                        {/* <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-neutral-400" /> */}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          ))}

          {/* Connect Column */}
          <div className="md:col-span-1">
             <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-6">
              Connect
            </h3>
            <div className="flex space-x-5">
              {/* Twitter */}
              <a
                href="https://twitter.com/saint" // Replace with actual URL
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Saint on Twitter"
                className="text-neutral-500 hover:text-black transition-colors duration-200 focus:outline-none focus-visible:text-black"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              {/* Instagram */}
               <a
                href="https://instagram.com/saint" // Replace with actual URL
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Saint on Instagram"
                className="text-neutral-500 hover:text-black transition-colors duration-200 focus:outline-none focus-visible:text-black"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                   <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                 </svg>
              </a>
              {/* Add Facebook, TikTok, etc. icons if needed */}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        {/* Added a subtle top border */}
        <div className="border-t border-neutral-200 pt-8 mt-12 lg:mt-16">
          <div className="flex flex-col-reverse items-center gap-6 md:flex-row md:justify-between">
            {/* Copyright */}
            <p className="text-xs text-neutral-500">
              &copy; {currentYear} Saint, betta. All rights reserved.
            </p>

            {/* Legal Links */}
            {/* Increased gap for better touch targets */}
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 md:gap-x-6">
              <Link href="/privacy" className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors duration-200 focus:outline-none focus-visible:text-neutral-900 focus-visible:underline">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors duration-200 focus:outline-none focus-visible:text-neutral-900 focus-visible:underline">
                Terms of Use
              </Link>
              <Link href="/legal" className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors duration-200 focus:outline-none focus-visible:text-neutral-900 focus-visible:underline">
                Legal
              </Link>
            </div>

            {/* Cleaned up credit */}
             <p className="text-xs text-neutral-400 italic">
               From Digital Vagina of <a href="https://example.com" className="underline hover:text-red-200 cursor-pointer">bytecode</a>

             </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;