import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Pizza, Coffee, MapPin, Phone, Clock, Star } from "lucide-react";

export default function Index() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Pizza className="h-8 w-8 text-red-600" />
              <Coffee className="h-6 w-6 text-amber-700" />
              <span className="text-xl font-bold text-gray-900">
                Pronto Pizza Cafe
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/menu"
                className="text-gray-700 hover:text-red-600 font-medium"
              >
                Menu
              </Link>
              <Link
                to="/specials"
                className="text-gray-700 hover:text-red-600 font-medium"
              >
                Specials
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-red-600 font-medium"
              >
                About
              </Link>
              <Link
                to="/admin"
                className="text-gray-700 hover:text-red-600 font-medium text-sm"
              >
                Admin
              </Link>
              <Link
                to="/login"
                className="text-gray-700 hover:text-red-600 font-medium"
              >
                Sign In
              </Link>
              <Button asChild>
                <Link to="/order">Start Order</Link>
              </Button>
            </div>
            <div className="md:hidden">
              <Button variant="outline" size="sm">
                Menu
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className={`py-20 px-4 text-center transition-all duration-1000 ${isLoaded ? "animate-fade-in-up" : "opacity-0"}`}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-responsive-lg font-bold text-gray-900 mb-6">
            Fresh Pizza & Premium Coffee
            <span className="block text-red-600">Made to Order</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            At Pronto Pizza Cafe, we serve authentic Italian-style pizzas and
            freshly brewed coffee. Every order is made fresh just for you!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-3" asChild>
              <Link to="/order">Order Now</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-3"
              asChild
            >
              <Link to="/menu">View Menu</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Pronto?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Pizza className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <CardTitle>Fresh Ingredients</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  We use only the freshest ingredients and make our dough daily
                  for the perfect pizza experience.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Coffee className="h-12 w-12 text-amber-700 mx-auto mb-4" />
                <CardTitle>Premium Coffee</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Our expertly roasted coffee beans create the perfect cup to
                  complement your meal.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Clock className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Quick Service</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Fast, friendly service with convenient carry-out options for
                  your busy lifestyle.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Items */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Customer Favorites
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                <Pizza className="h-20 w-20 text-white" />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>Margherita Pizza</CardTitle>
                  <Badge>Popular</Badge>
                </div>
                <CardDescription>
                  Fresh mozzarella, tomato sauce, and basil on our signature
                  crust
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-red-600">
                    From $12.99
                  </span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-600">4.8</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <Coffee className="h-20 w-20 text-white" />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>Pronto Blend Coffee</CardTitle>
                  <Badge variant="secondary">Signature</Badge>
                </div>
                <CardDescription>
                  Our house blend with notes of chocolate and caramel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-amber-700">
                    $2.99
                  </span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-600">4.9</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <Pizza className="h-20 w-20 text-white" />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>Supreme Pizza</CardTitle>
                  <Badge variant="outline">Best Seller</Badge>
                </div>
                <CardDescription>
                  Pepperoni, sausage, peppers, onions, mushrooms, and olives
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-red-600">
                    From $16.99
                  </span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-600">4.7</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Location & Contact */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Visit Us Today
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold mb-6">Location & Hours</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-red-600 mt-1" />
                  <div>
                    <p className="font-medium">914 Ashland Rd</p>
                    <p className="text-gray-600">Mansfield, OH 44905</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-red-600" />
                  <a
                    href="tel:419-589-7777"
                    className="font-medium hover:text-red-600"
                  >
                    (419) 589-7777
                  </a>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-red-600 mt-1" />
                  <div>
                    <p className="font-medium">Open Daily</p>
                    <p className="text-gray-600">11:00 AM - 10:00 PM</p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <Button asChild className="w-full sm:w-auto">
                  <Link to="/order">Start Your Order</Link>
                </Button>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-4 h-64 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="h-12 w-12 mx-auto mb-2" />
                <p>Google Maps Integration</p>
                <p className="text-sm">914 Ashland Rd, Mansfield, OH</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
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
    </div>
  );
}
