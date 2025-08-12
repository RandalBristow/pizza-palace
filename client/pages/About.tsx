import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import HeaderWithDelivery from "../components/HeaderWithDelivery";
import { useAboutSections } from "../hooks/useSupabase";

export default function About() {
  const { aboutSections, loading } = useAboutSections();

  // Helper function to render section content
  const renderSectionContent = (section: any) => {
    const baseClasses = "mb-8 -ml-0.5";

    switch (section.type) {
      case "text":
        return (
          <div className={baseClasses}>
            {section.title && (
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {section.title}
              </h2>
            )}
            {section.content && (
              <div className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                {section.content}
              </div>
            )}
            {renderLinks(section.links)}
          </div>
        );

      case "image":
        return (
          <div className={baseClasses}>
            {section.title && (
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {section.title}
              </h2>
            )}
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={section.imageUrl}
                alt={section.imageAltText || section.title || "About image"}
                className="w-full h-auto object-cover"
              />
              {section.textOverlay && section.textOverlay.text && (
                <div className={`absolute inset-0 flex items-${section.textOverlay.position === 'top' ? 'start' : section.textOverlay.position === 'bottom' ? 'end' : 'center'} justify-center`}>
                  <div className="bg-black bg-opacity-50 text-white p-4 rounded-md m-4">
                    <p className="text-lg font-semibold">{section.textOverlay.text}</p>
                  </div>
                </div>
              )}
            </div>
            {renderLinks(section.links)}
          </div>
        );

      case "text_with_image":
        return (
          <div className={baseClasses}>
            {section.title && (
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {section.title}
              </h2>
            )}
            <div className="grid md:grid-cols-2 gap-6 items-start">
              {section.imagePosition === "left" ? (
                <>
                  {section.imageUrl && (
                    <div className="rounded-lg overflow-hidden">
                      <img
                        src={section.imageUrl}
                        alt={section.imageAltText || section.title || "About image"}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  )}
                  <div>
                    {section.content && (
                      <div className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                        {section.content}
                      </div>
                    )}
                    {renderLinks(section.links)}
                  </div>
                </>
              ) : (
                <>
                  <div>
                    {section.content && (
                      <div className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                        {section.content}
                      </div>
                    )}
                    {renderLinks(section.links)}
                  </div>
                  {section.imageUrl && (
                    <div className="rounded-lg overflow-hidden">
                      <img
                        src={section.imageUrl}
                        alt={section.imageAltText || section.title || "About image"}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Helper function to render links
  const renderLinks = (links: any[]) => {
    if (!links || links.length === 0) return null;

    return (
      <div className="mt-4 space-y-2">
        {links.map((link, index) => (
          <div key={index}>
            {link.type === "text" ? (
              <Button variant="outline" asChild>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.text}
                </a>
              </Button>
            ) : (
              <Button variant="outline" asChild>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.text}
                </a>
              </Button>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Helper function to get column span class
  const getColumnClass = (columns: number) => {
    switch (columns) {
      case 1: return "md:col-span-1";
      case 2: return "md:col-span-2";
      case 3: return "md:col-span-3";
      default: return "md:col-span-1";
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading about page...</p>
        </div>
      </div>
    );
  }

  // Filter active sections and sort by order
  const activeSections = aboutSections
    .filter(section => section.isActive)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderWithDelivery breadcrumbs={[{ label: "About" }]} />

      <main className="max-w-6xl mx-auto px-1 py-8">
        {/* Default header if no sections exist */}
        {activeSections.length === 0 && (
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
        )}

        {/* Dynamic sections from database */}
        {activeSections.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeSections.map((section) => (
              <div
                key={section.id}
                className={getColumnClass(section.columns)}
              >
                {renderSectionContent(section)}
              </div>
            ))}
          </div>
        )}

        {/* Default CTA section if no sections exist */}
        {activeSections.length === 0 && (
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
        )}
      </main>
    </div>
  );
}
