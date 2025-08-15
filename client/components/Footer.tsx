import { Link } from "react-router-dom";
import { Pizza, Coffee, MapPin } from "lucide-react";
import { Button } from "./ui/button";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Pizza className="h-6 w-6 text-red-500" />
              <Coffee className="h-5 w-5 text-amber-500" />
              <span className="text-lg font-bold">Pronto Pizza Cafe</span>
            </div>
            <p className="text-gray-400">
              Fresh pizza and premium coffee, made to order with love in
              Mansfield, Ohio.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link
                to="/menu"
                className="block text-gray-400 hover:text-white"
              >
                Menu
              </Link>
              <Link
                to="/specials"
                className="block text-gray-400 hover:text-white"
              >
                Specials
              </Link>
              <Link
                to="/order"
                className="block text-gray-400 hover:text-white"
              >
                Order Online
              </Link>
              <Link
                to="/about"
                className="block text-gray-400 hover:text-white"
              >
                About Us
              </Link>
              <Link
                to="/admin"
                className="block text-gray-400 hover:text-white text-sm"
              >
                Admin Panel
              </Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-gray-400">
              <p>914 Ashland Rd</p>
              <p>Mansfield, OH 44905</p>
              <p>(419) 589-7777</p>
              <a href="https://getprontos.com" className="hover:text-white">
                getprontos.com
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Pronto Pizza Cafe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
