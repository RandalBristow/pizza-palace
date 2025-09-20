import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import HeaderWithDelivery from "../components/HeaderWithDelivery";
import Carousel from "../components/Carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Pizza,
  Coffee,
  MapPin,
  Phone,
  Clock,
  Star,
  ShoppingCart,
} from "lucide-react";
import {
  useCarouselImages,
  useCustomerFavorites,
  useSettings,
} from "../hooks/useSupabase";

// Get customer favorites from localStorage or use default (fallback)
const getCustomerFavorites = () => {
  try {
    const stored = localStorage.getItem("customerFavorites");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading customer favorites:", error);
  }

  // Default customer favorites data
  return [
    {
      id: "1",
      title: "Fresh Ingredients",
      description:
        "We use only the finest, freshest ingredients in every pizza.",
      icon: "🍕",
      isActive: true,
      order: 1,
    },
    {
      id: "2",
      title: "Fast Delivery",
      description:
        "Hot, fresh pizza delivered to your door in 30 minutes or less.",
      icon: "🚚",
      isActive: true,
      order: 2,
    },
    {
      id: "3",
      title: "Premium Coffee",
      description: "Freshly brewed coffee made from premium beans.",
      icon: "☕",
      isActive: true,
      order: 3,
    },
  ];
};

// Get restaurant settings from localStorage or use default
const getRestaurantSettings = () => {
  try {
    const stored = localStorage.getItem("restaurantSettings");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading settings:", error);
  }

  return {
    taxRate: 8.25,
    businessHours: {
      monday: { open: "11:00", close: "22:00", closed: false },
      tuesday: { open: "11:00", close: "22:00", closed: false },
      wednesday: { open: "11:00", close: "22:00", closed: false },
      thursday: { open: "11:00", close: "22:00", closed: false },
      friday: { open: "11:00", close: "23:00", closed: false },
      saturday: { open: "11:00", close: "23:00", closed: false },
      sunday: { open: "12:00", close: "21:00", closed: false },
    },
  };
};

export default function Index() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { carouselImages: dbCarouselImages, loading: carouselLoading } =
    useCarouselImages();
  const { customerFavorites: dbCustomerFavorites, loading: favoritesLoading } =
    useCustomerFavorites();
  const { settings: dbSettings, loading: settingsLoading } = useSettings();

  // Use database data with fallback
  const carouselImages = dbCarouselImages.length > 0 ? dbCarouselImages : [];
  const customerFavorites =
    dbCustomerFavorites.length > 0
      ? dbCustomerFavorites
      : getCustomerFavorites();
  const settings = dbSettings || getRestaurantSettings();

  // Format business hours for display
  const formatBusinessHours = () => {
    const hours = settings.businessHours;
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    const dayNames = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const todayName = dayNames[today];
    const todayHours = hours[todayName];

    if (todayHours.closed) {
      return { status: "Closed Today", hours: "" };
    }

    // Convert 24-hour to 12-hour format
    const formatTime = (time: string) => {
      const [hour, minute] = time.split(":");
      const hourNum = parseInt(hour);
      const ampm = hourNum >= 12 ? "PM" : "AM";
      const hour12 = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
      return `${hour12}:${minute} ${ampm}`;
    };

    return {
      status: "Open Today",
      hours: `${formatTime(todayHours.open)} - ${formatTime(todayHours.close)}`,
    };
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <HeaderWithDelivery />

      {/* Hero Carousel Section */}
      <section
        className={`transition-all duration-1000 ${isLoaded ? "animate-fade-in-up" : "opacity-0"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Carousel images={carouselImages} />
        </div>

        {/* Call to Action Below Carousel */}
        <div className="text-center py-8">
          <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: 'var(--muted-foreground)' }}>
            At Pronto Pizza Cafe, we serve authentic Italian-style pizzas and
            freshly brewed coffee. Every order is made fresh just for you!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-8 py-3"
              style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)',
                borderColor: 'var(--primary)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLElement;
                target.style.transform = 'translateY(-2px)';
                target.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLElement;
                target.style.transform = 'translateY(0)';
                target.style.boxShadow = 'none';
              }}
              asChild
            >
              <Link to="/menu">Order Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4" style={{ backgroundColor: 'var(--card)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--foreground)' }}>
            Why Choose Pronto?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {customerFavorites
              .filter((favorite) => favorite.isActive)
              .sort((a, b) => a.order - b.order)
              .map((favorite) => (
                <Card
                  key={favorite.id}
                  className="text-center shadow-lg hover:shadow-xl transition-shadow"
                  style={{ 
                    backgroundColor: 'var(--background)', 
                    borderColor: 'var(--border)',
                    border: '1px solid var(--border)'
                  }}
                >
                  <CardHeader>
                    <div className="text-4xl mb-4">{favorite.icon}</div>
                    <CardTitle style={{ color: 'var(--foreground)' }}>{favorite.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base" style={{ color: 'var(--muted-foreground)' }}>
                      {favorite.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </section>

      {/* Popular Items */}
      <section className="py-16 px-4" style={{ backgroundColor: 'var(--muted)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--foreground)' }}>
            Customer Favorites
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card 
              className="overflow-hidden hover:shadow-xl transition-shadow"
              style={{ 
                backgroundColor: 'var(--card)', 
                borderColor: 'var(--border)',
                border: '1px solid var(--border)'
              }}
            >
              <div
                className="h-48 relative overflow-hidden bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.pexels.com/photos/8471703/pexels-photo-8471703.jpeg')`,
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <h3 className="font-bold text-lg">Fresh Margherita</h3>
                      <p className="text-sm">Hand-crafted daily</p>
                    </div>
                  </div>
                </div>
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle style={{ color: 'var(--card-foreground)' }}>Margherita Pizza</CardTitle>
                  <Badge style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>Popular</Badge>
                </div>
                <CardDescription style={{ color: 'var(--muted-foreground)' }}>
                  Fresh mozzarella, tomato sauce, and basil on our signature
                  crust
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold" style={{ color: 'var(--primary)' }}>
                    From $12.99
                  </span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>4.8</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="overflow-hidden hover:shadow-xl transition-shadow"
              style={{ 
                backgroundColor: 'var(--card)', 
                borderColor: 'var(--border)',
                border: '1px solid var(--border)'
              }}
            >
              <div
                className="h-48 relative overflow-hidden bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.pexels.com/photos/10303534/pexels-photo-10303534.jpeg')`,
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <h3 className="font-bold text-lg">Premium Coffee</h3>
                      <p className="text-sm">House blend perfection</p>
                    </div>
                  </div>
                </div>
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle style={{ color: 'var(--card-foreground)' }}>Pronto Blend Coffee</CardTitle>
                  <Badge variant="secondary" style={{ backgroundColor: 'var(--secondary)', color: 'var(--secondary-foreground)' }}>Signature</Badge>
                </div>
                <CardDescription style={{ color: 'var(--muted-foreground)' }}>
                  Our house blend with notes of chocolate and caramel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold" style={{ color: '#d97706' }}>
                    $2.99
                  </span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>4.9</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="overflow-hidden hover:shadow-xl transition-shadow"
              style={{ 
                backgroundColor: 'var(--card)', 
                borderColor: 'var(--border)',
                border: '1px solid var(--border)'
              }}
            >
              <div
                className="h-48 relative overflow-hidden bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.pexels.com/photos/5903312/pexels-photo-5903312.jpeg')`,
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <h3 className="font-bold text-lg">Supreme Loaded</h3>
                      <p className="text-sm">All your favorites</p>
                    </div>
                  </div>
                </div>
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle style={{ color: 'var(--card-foreground)' }}>Supreme Pizza</CardTitle>
                  <Badge 
                    variant="outline"
                    style={{ 
                      borderColor: 'var(--border)', 
                      color: 'var(--foreground)',
                      backgroundColor: 'var(--background)'
                    }}
                  >
                    Best Seller
                  </Badge>
                </div>
                <CardDescription style={{ color: 'var(--muted-foreground)' }}>
                  Pepperoni, sausage, peppers, onions, mushrooms, and olives
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold" style={{ color: 'var(--primary)' }}>
                    From $16.99
                  </span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>4.7</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Location & Contact */}
      <section className="py-16 px-4" style={{ backgroundColor: 'var(--card)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--foreground)' }}>
            Visit Us Today
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--foreground)' }}>Location & Hours</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 mt-1" style={{ color: 'var(--primary)' }} />
                  <div>
                    <p className="font-medium" style={{ color: 'var(--foreground)' }}>914 Ashland Rd</p>
                    <p style={{ color: 'var(--muted-foreground)' }}>Mansfield, OH 44905</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5" style={{ color: 'var(--primary)' }} />
                  <a
                    href="tel:419-589-7777"
                    className="font-medium hover:underline"
                    style={{ color: 'var(--foreground)' }}
                    onMouseEnter={(e) => {
                      const target = e.target as HTMLElement;
                      target.style.color = 'var(--primary)';
                    }}
                    onMouseLeave={(e) => {
                      const target = e.target as HTMLElement;
                      target.style.color = 'var(--foreground)';
                    }}
                  >
                    (419) 589-7777
                  </a>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 mt-1" style={{ color: 'var(--primary)' }} />
                  <div>
                    <p className="font-medium" style={{ color: 'var(--foreground)' }}>
                      {formatBusinessHours().status}
                    </p>
                    {formatBusinessHours().hours && (
                      <p style={{ color: 'var(--muted-foreground)' }}>
                        {formatBusinessHours().hours}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <Button 
                  className="w-full sm:w-auto"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                    borderColor: 'var(--primary)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.transform = 'translateY(-1px)';
                    target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.transform = 'translateY(0)';
                    target.style.boxShadow = 'none';
                  }}
                  asChild
                >
                  <Link to="/order">Start Your Order</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3034.7847668!2d-82.5396644!3d40.7598568!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8836b2c0a05f3d49%3A0x123456789abcdef0!2s914%20Ashland%20Rd%2C%20Mansfield%2C%20OH%2044905!5e0!3m2!1sen!2sus!4v1690000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Pronto Pizza Cafe Location"
              ></iframe>
              <div className="absolute bottom-2 right-2">
                <Button
                  size="sm"
                  variant="secondary"
                  style={{
                    backgroundColor: 'var(--secondary)',
                    color: 'var(--secondary-foreground)',
                    borderColor: 'var(--border)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.transform = 'scale(1)';
                  }}
                  onClick={() =>
                    window.open(
                      "https://maps.google.com/?q=914+Ashland+Rd+Mansfield+OH+44905",
                      "_blank",
                    )
                  }
                >
                  <MapPin className="h-4 w-4 mr-1" style={{ color: 'var(--secondary-foreground)' }} />
                  Get Directions
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
