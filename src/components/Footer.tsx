
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Our Fleet', href: '/cars' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' }
  ];

  const services = [
    'Airport Transfer',
    'Local Taxi Service',
    'Outstation Travel',
    'Corporate Booking',
    '24/7 Service',
    'Emergency Rides',
    "Outstation Cabs Airport Taxi's",
    "Local Sightseeing & Tours",
    "Shuttle Taxi service",
    "One way Drop Taxi",
  ];

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">B</span>
              </div>
              <span className="text-xl font-bold">BDS Cabs</span>
            </div>
            <p className="text-gray-300 text-sm">
              Best cab service in Tamilnadu. Safe, reliable, and affordable taxi service available 24/7. 
              Your trusted transportation partner since 2018.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-primary cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-primary cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-primary cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-gray-300 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Our Services</h3>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={index} className="text-gray-300 text-sm">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Phone className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">+91 9790532574</p>
                  <p className="text-gray-400 text-xs">24/7 Booking</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">info@bdscabs.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">Tamil Nadu</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">24/7 Service</p>
                  <p className="text-gray-400 text-xs">Always Available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-gray-400 text-sm text-center md:text-left">
            © {new Date().getFullYear()} BDS Cabs. All rights reserved. Best cab service in Tamilnadu.
          </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
