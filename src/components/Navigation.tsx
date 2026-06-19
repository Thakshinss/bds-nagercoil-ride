import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Phone, Download, User } from 'lucide-react';
import cabimg from "../assets/bds_new_logo.png"
import { useAuth } from '@/hooks/useAuth';


const handleCall = () => {
  const phoneNumber = "+919790532574"; // Include + for tel:
  window.location.href = `tel:${phoneNumber}`;
};

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Cars', path: '/cars' },
    { name: 'Tour Packages', path: '/tour-packages' },
    { name: 'Prices', path: '/prices' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-custom-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-2">
            <div className="w-16 h-16 rounded-lg flex items-center justify-center">
            <img
              src={cabimg}
              alt="Cab booking illustration"
              className="w-full max-w-md"
            />
            </div>
            <span className="text-xl font-bold text-foreground text-blue-950">BDS Cabs</span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `transition-smooth px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-primary hover:bg-muted'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
            
            {/* Install App Button */}
            <a href="https://play.google.com/store/apps/details?id=com.bdscabs.app&pcampaignid=web_share" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <Download className="w-4 h-4 mr-2" />
                Install App
              </Button>
            </a>

            {/* Account */}
            <Link to={user ? '/my-rides' : '/auth'}>
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4 mr-1" />
                {user ? 'My Rides' : 'Sign In'}
              </Button>
            </Link>

            {/* Call Button */}
            <Button onClick={handleCall} variant="default" size="sm" className="bg-gradient-secondary hover:bg-secondary-dark">
              <Phone className="w-4 h-4 mr-2" />
              Call Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition-smooth"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `transition-smooth px-3 py-2 rounded-md text-sm font-medium ${
                      isActive
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground hover:text-primary hover:bg-muted'
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </NavLink>
              ))}
              <a href="https://play.google.com/store/apps/details?id=com.bdscabs.app&pcampaignid=web_share" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground w-fit mt-2">
                  <Download className="w-4 h-4 mr-2" />
                  Install App
                </Button>
              </a>
              <Link to={user ? '/my-rides' : '/auth'} onClick={() => setIsOpen(false)}>
                <Button variant="ghost" size="sm" className="w-fit mt-2">
                  <User className="w-4 h-4 mr-1" />
                  {user ? 'My Rides' : 'Sign In'}
                </Button>
              </Link>
              <Button onClick={handleCall} variant="default" size="sm" className="bg-gradient-secondary hover:bg-secondary-dark w-fit mt-2">
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;