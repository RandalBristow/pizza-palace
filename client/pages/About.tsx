import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import HeaderWithDelivery from "../components/HeaderWithDelivery";
import { useAboutSections } from "../hooks/useSupabase";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderWithDelivery breadcrumbs={[{ label: "About" }]} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About Pronto Pizza Cafe
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Serving Mansfield, Ohio with authentic Italian-style pizza and
            premium coffee since our founding. Every order is made fresh with
            love and the finest ingredients.
          </p>
        </section>

        {/* Story Section */}
        <section className="mb-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Pronto Pizza Cafe began with a simple mission: to bring
                  authentic, delicious pizza and exceptional coffee to the
                  Mansfield community. Our family-owned restaurant combines
                  traditional Italian pizza-making techniques with modern
                  convenience.
                </p>
                <p>
                  Every pizza is hand-stretched and made to order using our
                  signature dough recipe, which is prepared fresh daily. Our
                  coffee beans are carefully selected and roasted to perfection,
                  creating the perfect complement to our savory offerings.
                </p>
                <p>
                  We believe in quality over quantity, which is why we focus on
                  carry-out service to ensure every order meets our high
                  standards. From our kitchen to your table, we're committed to
                  excellence in every bite.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-100 to-yellow-100 p-8 rounded-lg">
              <div className="text-center">
                <Pizza className="h-24 w-24 text-red-500 mx-auto mb-4" />
                <Coffee className="h-16 w-16 text-amber-600 mx-auto" />
                <p className="text-gray-700 mt-4 font-medium">
                  Fresh ingredients, made with love, served with pride
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            What We Stand For
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <CardTitle>Quality Ingredients</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  We source the freshest ingredients and make our dough daily to
                  ensure every pizza meets our high standards.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <CardTitle>Community Focus</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  As a local business, we're committed to serving our Mansfield
                  community with exceptional food and friendly service.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Award className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <CardTitle>Authentic Recipes</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Our recipes combine traditional Italian techniques with
                  innovative flavors to create truly memorable meals.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Location & Contact Section */}
        <section className="mb-12">
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Visit Our Location</CardTitle>
                <CardDescription>
                  Find us in the heart of Mansfield, Ohio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-red-600 mt-1" />
                  <div>
                    <p className="font-medium">914 Ashland Rd</p>
                    <p className="text-gray-600">Mansfield, OH 44905</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-medium">(419) 589-7777</p>
                    <p className="text-gray-600">
                      Call for questions or orders
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-red-600 mt-1" />
                  <div>
                    <p className="font-medium">Hours</p>
                    <div className="text-gray-600 space-y-1">
                      <p>Monday - Friday: 11:00 AM - 10:00 PM</p>
                      <p>Saturday: 11:00 AM - 11:00 PM</p>
                      <p>Sunday: 12:00 PM - 9:00 PM</p>
                    </div>
                  </div>
                </div>
                <div className="pt-4">
                  <Button asChild className="w-full">
                    <a
                      href="https://getprontos.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit Our Website
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Find Us on the Map</CardTitle>
                <CardDescription>
                  Easy to find with convenient parking
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                      onClick={() =>
                        window.open(
                          "https://maps.google.com/?q=914+Ashland+Rd+Mansfield+OH+44905",
                          "_blank",
                        )
                      }
                    >
                      <MapPin className="h-4 w-4 mr-1" />
                      Directions
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Specialties Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Our Specialties
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <Pizza className="h-8 w-8 text-red-600 mb-2" />
                <CardTitle>Artisan Pizza</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Hand-stretched dough made fresh daily</li>
                  <li>• Premium mozzarella and fresh toppings</li>
                  <li>• Multiple crust options: Regular, Thin, and Thick</li>
                  <li>• Gluten-free options available</li>
                  <li>• Custom half-and-half topping placement</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Coffee className="h-8 w-8 text-amber-700 mb-2" />
                <CardTitle>Premium Coffee</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Carefully selected, expertly roasted beans</li>
                  <li>
                    • Signature house blend with chocolate and caramel notes
                  </li>
                  <li>• Traditional espresso-based drinks</li>
                  <li>• Perfect complement to our pizza offerings</li>
                  <li>• Hot and iced options available</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Try Our Pizza?
          </h2>
          <p className="text-gray-600 mb-6">
            Experience the difference that fresh ingredients and authentic
            recipes make. Order now for pickup!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/order">Start Your Order</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/menu">View Full Menu</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
