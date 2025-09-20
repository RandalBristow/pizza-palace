import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import HeaderWithDelivery from "../components/HeaderWithDelivery";
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
  ArrowLeft,
  Calendar,
  Clock,
  Percent,
  Star,
} from "lucide-react";
import { useSpecials } from "../hooks/useSupabase";

// Helper function to check if special is active today
const isSpecialActiveToday = (special: any) => {
  const today = new Date();
  const todayDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

  if (special.type === "daily") {
    return true; // Daily specials are always active
  }

  if (special.type === "weekly" && special.dayOfWeek !== undefined) {
    return todayDay === special.dayOfWeek;
  }

  if (special.type === "hourly" && special.daysOfWeek) {
    return special.daysOfWeek.includes(todayDay);
  }

  return false;
};

// Helper function to format discount text
const formatDiscount = (special: any) => {
  if (special.discountType === "percentage") {
    return `${special.discountValue}% OFF`;
  } else if (special.discountType === "flat") {
    return `$${special.discountValue}`;
  }
  return "Special Price";
};

// Helper function to format valid dates/times
const formatValidDates = (special: any) => {
  if (special.type === "daily") {
    return "Daily Special";
  }

  if (special.type === "weekly" && special.dayOfWeek !== undefined) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return `Every ${days[special.dayOfWeek]}`;
  }

  if (special.type === "hourly") {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayNames = special.daysOfWeek?.map((d: number) => days[d]).join(", ") || "";
    const timeRange = special.startTime && special.endTime ?
      `${special.startTime} - ${special.endTime}` : "";
    return `${dayNames} ${timeRange}`.trim();
  }

  return `${special.startDate} to ${special.endDate}`;
};

// Helper function to get menu item names (simplified)
const getMenuItemNames = (special: any) => {
  // Since menuItems in the database are just IDs, we'll show a generic label
  // In a real implementation, you'd map these IDs to actual menu item names
  if (!special.menuItems || special.menuItems.length === 0) {
    return ["Selected Items"];
  }
  return [`${special.menuItems.length} Menu Items`];
};

export default function Specials() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { specials: dbSpecials, loading: specialsLoading } = useSpecials();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const isHappyHour = () => {
    const hour = currentTime.getHours();
    return hour >= 14 && hour < 16; // 2 PM to 4 PM
  };

  const getDayName = (dayNum: number) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[dayNum];
  };

  // Filter active specials from database
  const activeSpecials = dbSpecials.filter(special => special.isActive);
  const todaysSpecials = activeSpecials.filter(special => isSpecialActiveToday(special));
  const weeklySpecials = activeSpecials.filter(special => special.type === "weekly");
  const dailySpecials = activeSpecials.filter(special => special.type === "daily");
  const hourlySpecials = activeSpecials.filter(special => special.type === "hourly");

  // Show loading state while data is being fetched
  if (specialsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 mx-auto" style={{ borderColor: 'var(--primary)' }}></div>
          <p className="mt-4" style={{ color: 'var(--muted-foreground)' }}>Loading specials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <HeaderWithDelivery breadcrumbs={[{ label: "Specials" }]} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            Today's Specials
          </h1>
          <p className="text-xl max-w-3xl mx-auto mb-6" style={{ color: 'var(--muted-foreground)' }}>
            Save money on your favorite pizza and coffee with our daily and
            weekly specials. Check back regularly for new deals!
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm" style={{ color: 'var(--muted-foreground)' }}>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {getDayName(currentTime.getDay())},{" "}
              {currentTime.toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {currentTime.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </div>
          </div>
        </section>

        {/* Today's Active Specials */}
        {todaysSpecials.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center" style={{ color: 'var(--foreground)' }}>
              <Star className="h-6 w-6 text-yellow-500 mr-2" />
              Available Right Now
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {todaysSpecials.map((special) => (
                <Card
                  key={special.id}
                  className="shadow-lg"
                  style={{ 
                    backgroundColor: 'var(--card)', 
                    borderColor: 'var(--primary)',
                    border: '2px solid var(--primary)'
                  }}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle style={{ color: 'var(--primary)' }}>
                        {special.name}
                      </CardTitle>
                      <Badge style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                        {special.type === "hourly" && isHappyHour()
                          ? "Active Now!"
                          : "Available Today"}
                      </Badge>
                    </div>
                    <CardDescription style={{ color: 'var(--muted-foreground)' }}>
                      {special.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                          Discount:
                        </span>
                        <span className="text-lg font-bold" style={{ color: 'var(--primary)' }}>
                          {formatDiscount(special)}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                          Valid:
                        </span>
                        <span className="text-sm ml-2" style={{ color: 'var(--muted-foreground)' }}>
                          {formatValidDates(special)}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                          Includes:
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {getMenuItemNames(special).map((item, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                              style={{ 
                                borderColor: 'var(--primary)', 
                                color: 'var(--primary)',
                                backgroundColor: 'var(--background)'
                              }}
                            >
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button 
                        className="w-full mt-4"
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
                        <Link to="/order">Order Now</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Weekly Specials */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>
            Weekly Specials
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {weeklySpecials.map((special) => (
              <Card
                key={special.id}
                className={isSpecialActiveToday(special) ? "shadow-lg" : ""}
                style={{ 
                  backgroundColor: 'var(--card)', 
                  borderColor: isSpecialActiveToday(special) ? 'var(--primary)' : 'var(--border)',
                  border: `1px solid ${isSpecialActiveToday(special) ? 'var(--primary)' : 'var(--border)'}`
                }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle style={{ color: isSpecialActiveToday(special) ? 'var(--primary)' : 'var(--foreground)' }}>
                      {special.name}
                    </CardTitle>
                    {isSpecialActiveToday(special) && (
                      <Badge style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>Today!</Badge>
                    )}
                  </div>
                  <CardDescription style={{ color: 'var(--muted-foreground)' }}>
                    {special.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Discount:</span>
                      <span className="text-lg font-bold" style={{ color: 'var(--primary)' }}>
                        {formatDiscount(special)}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>When:</span>
                      <span className="text-sm ml-2" style={{ color: 'var(--muted-foreground)' }}>
                        {formatValidDates(special)}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Includes:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {getMenuItemNames(special).map((item, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                            style={{ 
                              borderColor: 'var(--border)', 
                              color: 'var(--muted-foreground)',
                              backgroundColor: 'var(--background)'
                            }}
                          >
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Daily Specials */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>
            Daily Specials
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {dailySpecials.map((special) => (
              <Card 
                key={special.id}
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', border: '1px solid var(--border)' }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle style={{ color: 'var(--foreground)' }}>{special.name}</CardTitle>
                    <Badge 
                      variant="secondary"
                      style={{ backgroundColor: 'var(--secondary)', color: 'var(--secondary-foreground)' }}
                    >
                      Every Day
                    </Badge>
                  </div>
                  <CardDescription style={{ color: 'var(--muted-foreground)' }}>{special.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Offer:</span>
                      <span className="text-lg font-bold" style={{ color: 'var(--primary)' }}>
                        {formatDiscount(special)}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Valid:</span>
                      <span className="text-sm ml-2" style={{ color: 'var(--muted-foreground)' }}>
                        {formatValidDates(special)}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Includes:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {getMenuItemNames(special).map((item, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                            style={{ 
                              borderColor: 'var(--border)', 
                              color: 'var(--muted-foreground)',
                              backgroundColor: 'var(--background)'
                            }}
                          >
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Terms and Information */}
        <section>
          <Card style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', border: '1px solid var(--border)' }}>
            <CardHeader>
              <CardTitle style={{ color: 'var(--card-foreground)' }}>Special Offer Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                <div>
                  <h4 className="font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                    General Terms:
                  </h4>
                  <ul className="space-y-1">
                    <li>• Specials valid for carry-out orders only</li>
                    <li>• Cannot be combined with other offers</li>
                    <li>• Discount applied at time of order</li>
                    <li>• Subject to availability</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                    How to Order:
                  </h4>
                  <ul className="space-y-1">
                    <li>• Order online and mention special at pickup</li>
                    <li>• Call (419) 589-7777 and reference the special</li>
                    <li>• Specials automatically applied when eligible</li>
                    <li>• Show this page for verification if needed</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="text-center mt-12">
          <div 
            className="text-white rounded-lg p-8"
            style={{ background: 'linear-gradient(to right, var(--primary), var(--primary))' }}
          >
            <h2 className="text-2xl font-bold mb-4">
              Don't Miss Out on These Great Deals!
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Order now and save on your favorite pizza and coffee combinations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary" 
                style={{
                  backgroundColor: 'var(--secondary)',
                  color: 'var(--secondary-foreground)',
                  borderColor: 'var(--secondary)',
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
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white"
                style={{
                  borderColor: 'white',
                  color: 'white',
                  backgroundColor: 'transparent',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.backgroundColor = 'white';
                  target.style.color = 'var(--primary)';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.backgroundColor = 'transparent';
                  target.style.color = 'white';
                }}
                asChild
              >
                <Link to="/menu">View Full Menu</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
