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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading specials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderWithDelivery breadcrumbs={[{ label: "Specials" }]} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Today's Specials
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Save money on your favorite pizza and coffee with our daily and
            weekly specials. Check back regularly for new deals!
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Star className="h-6 w-6 text-yellow-500 mr-2" />
              Available Right Now
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {todaysSpecials.map((special) => (
                <Card
                  key={special.id}
                  className="border-green-200 bg-green-50 shadow-lg"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-green-800">
                        {special.name}
                      </CardTitle>
                      <Badge className="bg-green-600">
                        {special.id === "s4" && isHappyHour()
                          ? "Active Now!"
                          : "Today Only"}
                      </Badge>
                    </div>
                    <CardDescription className="text-green-700">
                      {special.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-green-800">
                          Discount:
                        </span>
                        <span className="text-lg font-bold text-green-600">
                          {special.discount}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-green-800">
                          Valid:
                        </span>
                        <span className="text-sm text-green-700 ml-2">
                          {special.validDates}
                          {special.id === "s4" &&
                            (isHappyHour() ? " (Active Now!)" : "")}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-green-800">
                          Includes:
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {special.menuItems.map((item, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs border-green-300 text-green-700"
                            >
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button className="w-full mt-4" asChild>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Weekly Specials
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {weeklySpecials.map((special) => (
              <Card
                key={special.id}
                className={`${special.isToday ? "border-blue-200 bg-blue-50" : ""}`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle
                      className={special.isToday ? "text-blue-800" : ""}
                    >
                      {special.name}
                    </CardTitle>
                    {special.isToday && <Badge>Today!</Badge>}
                  </div>
                  <CardDescription
                    className={special.isToday ? "text-blue-700" : ""}
                  >
                    {special.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Discount:</span>
                      <span className="text-lg font-bold text-red-600">
                        {special.discount}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">When:</span>
                      <span className="text-sm text-gray-600 ml-2">
                        {special.dayOfWeek}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Includes:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {special.menuItems.map((item, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Daily Specials
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {dailySpecials.map((special) => (
              <Card key={special.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{special.name}</CardTitle>
                    <Badge variant="secondary">Every Day</Badge>
                  </div>
                  <CardDescription>{special.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Offer:</span>
                      <span className="text-lg font-bold text-red-600">
                        {special.discount}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Valid:</span>
                      <span className="text-sm text-gray-600 ml-2">
                        {special.validDates}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Includes:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {special.menuItems.map((item, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
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
          <Card>
            <CardHeader>
              <CardTitle>Special Offer Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
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
                  <h4 className="font-medium text-gray-900 mb-2">
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
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">
              Don't Miss Out on These Great Deals!
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Order now and save on your favorite pizza and coffee combinations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/order">Start Your Order</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-red-500"
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
