import { Link } from "react-router-dom";
import {
 
  UtensilsCrossed,
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#1a1a1a] text-white mt-20">
      {/* Main Footer */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-10 h-10 bg-gradient-to-br from-[#ff6b00] to-[#ff8c00] rounded-[12px] flex items-center justify-center text-white">
                <UtensilsCrossed size={18} strokeWidth={2.5} />
              </span>
              <span className="font-display font-extrabold text-[22px] tracking-[-0.03em]">
                Food<em className="not-italic text-[#ff6b00]">Hub</em>
              </span>
            </div>
            <p className="text-[14px] text-gray-400 leading-relaxed">
              Delivering delicious food from your favorite restaurants to your doorstep in minutes.
            </p>
            <div className="flex items-center gap-3 pt-2">

              
              
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-[16px] font-bold font-display">Quick Links</h3>
            <ul className="space-y-3 text-[13px]">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-[#ff6b00] no-underline transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/companies"
                  className="text-gray-400 hover:text-[#ff6b00] no-underline transition-colors"
                >
                  Restaurants
                </Link>
              </li>
              <li>
                <Link
                  to="/my-orders"
                  className="text-gray-400 hover:text-[#ff6b00] no-underline transition-colors"
                >
                  My Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-gray-400 hover:text-[#ff6b00] no-underline transition-colors"
                >
                  Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-[16px] font-bold font-display">Company</h3>
            <ul className="space-y-3 text-[13px]">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#ff6b00] no-underline transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#ff6b00] no-underline transition-colors"
                >
                  Partner With Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#ff6b00] no-underline transition-colors"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#ff6b00] no-underline transition-colors"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-[16px] font-bold font-display">Contact</h3>
            <div className="space-y-3 text-[13px]">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-[#ff6b00] flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">
                  Gandhipuram coimbatore
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-[#ff6b00] flex-shrink-0" />
                <a
                  href="tel:+1234567890"
                  className="text-gray-400 hover:text-[#ff6b00] no-underline transition-colors"
                >
                  +91 653762822
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-[#ff6b00] flex-shrink-0" />
                <a
                  href="mailto:support@foodhub.com"
                  className="text-gray-400 hover:text-[#ff6b00] no-underline transition-colors"
                >
                  support@foodhub.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-[#ff6b00] flex-shrink-0" />
                <span className="text-gray-400">24/7 Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-800 mb-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-gray-400">
          <p>
            © 2024 FoodHub. All rights reserved. |{" "}
            <a href="#" className="text-[#ff6b00] hover:underline no-underline">
              Privacy Policy
            </a>{" "}
            |{" "}
            <a href="#" className="text-[#ff6b00] hover:underline no-underline">
              Terms of Service
            </a>
          </p>
          <div className="flex items-center gap-3">
            <span>Download App:</span>
            <a href="#" className="hover:text-[#ff6b00] transition-colors">
              iOS
            </a>
            |
            <a href="#" className="hover:text-[#ff6b00] transition-colors">
              Android
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;