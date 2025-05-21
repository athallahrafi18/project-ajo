import { Link } from 'react-router-dom';
import { Coffee, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <Coffee className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-serif font-bold text-secondary-800">
                Oōmi Lezato
              </span>
            </Link>
            <p className="text-secondary-600 text-sm">
              Experience the perfect blend of artisanal coffee and delicious treats in a warm, welcoming environment.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-secondary-400 hover:text-primary-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-secondary-400 hover:text-primary-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-secondary-400 hover:text-primary-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-secondary-900 font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/menu" className="text-secondary-600 hover:text-primary-600 transition-colors">
                  Our Menu
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-secondary-600 hover:text-primary-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-secondary-600 hover:text-primary-600 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-secondary-600 hover:text-primary-600 transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-secondary-900 font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-secondary-600 hover:text-primary-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-secondary-600 hover:text-primary-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-secondary-600 hover:text-primary-600 transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/refund" className="text-secondary-600 hover:text-primary-600 transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-secondary-900 font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-secondary-600">
                <MapPin className="h-5 w-5 mr-2 text-primary-600" />
                <span>Jl. Abdul Hakim No.2, Padang Bulan Selayang I, Kec. Medan Selayang, Kota Medan, Sumatera Utara 20131</span>
              </li>
              <li className="flex items-center text-secondary-600">
                <Phone className="h-5 w-5 mr-2 text-primary-600" />
                <a href="tel:+15551234567" className="hover:text-primary-600 transition-colors">
                  081268356935
                </a>
              </li>
              <li className="flex items-center text-secondary-600">
                <Mail className="h-5 w-5 mr-2 text-primary-600" />
                <a href="mailto:hello@oomiLezato.com" className="hover:text-primary-600 transition-colors">
                  hello@oomiLezato.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-secondary-600 text-sm">
              © {currentYear} Oōmi Lezato. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-secondary-600 hover:text-primary-600 transition-colors">
                Accessibility
              </a>
              <a href="#" className="text-sm text-secondary-600 hover:text-primary-600 transition-colors">
                Sitemap
              </a>
              <a href="#" className="text-sm text-secondary-600 hover:text-primary-600 transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;