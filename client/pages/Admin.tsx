import { useState } from "react";
import { Button } from "../components/ui/button";
import HeaderWithDelivery from "../components/HeaderWithDelivery";
import AdminSidebar from "../components/AdminSidebar";
import { FileText } from "lucide-react";
import {
  useCategories,
  useSubCategories,
  useMenuItems,
  useToppings,
  useToppingCategories,
  useSpecials,
  useCarouselImages,
  useCustomerFavorites,
  useSettings,
  useAboutSections,
  useImages,
  useCategorySizes,
  useSubCategorySizes,
  useMenuItemSizes,
  useMenuItemSizeToppings,
} from "../hooks/useSupabase";

// Import form components
import SettingsForm from "../components/admin/SettingsForm";
import MenuCategoryForm from "../components/admin/MenuCategoryForm";
import MenuItemForm from "../components/admin/MenuItemForm";
import ToppingCategoryForm from "../components/admin/ToppingCategoryForm";
import ToppingItemForm from "../components/admin/ToppingItemForm";
import SpecialForm from "../components/admin/SpecialForm";
import CarouselForm from "../components/admin/CarouselForm";
import CustomerFavoriteForm from "../components/admin/CustomerFavoriteForm";
import AboutPageForm from "../components/admin/AboutPageForm";
import ImageManagerForm from "../components/admin/ImageManagerForm";

export default function Admin() {
  // Supabase hooks
  const {
    categories,
    loading: categoriesLoading,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();
  const {
    subCategories,
    createSubCategory,
    updateSubCategory,
    deleteSubCategory,
  } = useSubCategories();
  const {
    menuItems,
    loading: menuItemsLoading,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
  } = useMenuItems();
  const {
    toppings,
    loading: toppingsLoading,
    createTopping,
    updateTopping,
    deleteTopping,
  } = useToppings();
  const {
    toppingCategories,
    loading: toppingCategoriesLoading,
    createToppingCategory,
    updateToppingCategory,
    deleteToppingCategory,
  } = useToppingCategories();
  const {
    specials,
    loading: specialsLoading,
    createSpecial,
    updateSpecial,
    deleteSpecial,
  } = useSpecials();
  const {
    carouselImages,
    loading: carouselLoading,
    createCarouselImage,
    updateCarouselImage,
    deleteCarouselImage,
  } = useCarouselImages();
  const {
    customerFavorites,
    loading: favoritesLoading,
    createCustomerFavorite,
    updateCustomerFavorite,
    deleteCustomerFavorite,
  } = useCustomerFavorites();
  const { settings, loading: settingsLoading, updateSettings } = useSettings();
  const {
    aboutSections,
    loading: aboutLoading,
    createAboutSection,
    updateAboutSection,
    deleteAboutSection,
  } = useAboutSections();
  const {
    images,
    loading: imagesLoading,
    uploadImageFile,
    createImageFromUrl,
    updateImage,
    deleteImage,
  } = useImages();
  const {
    categorySizes,
    createCategorySize,
    updateCategorySize,
    deleteCategorySize,
  } = useCategorySizes();
  const {
    subCategorySizes,
    updateSubCategorySizes,
  } = useSubCategorySizes();

  const [selectedItem, setSelectedItem] = useState("categories");

  // Filter states
  const [selectedMenuCategory, setSelectedMenuCategory] = useState("all");
  const [selectedToppingCategory, setSelectedToppingCategory] = useState("all");

  // Show loading state while data is being fetched
  const isLoading =
    categoriesLoading ||
    menuItemsLoading ||
    toppingsLoading ||
    toppingCategoriesLoading ||
    specialsLoading ||
    carouselLoading ||
    favoritesLoading ||
    settingsLoading ||
    aboutLoading ||
    imagesLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const generateMenuPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const menuHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Pronto Pizza Cafe - Menu</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .category { margin-bottom: 30px; }
          .category-title { font-size: 24px; font-weight: bold; color: #333; border-bottom: 2px solid #333; padding-bottom: 5px; margin-bottom: 15px; }
          .menu-item { margin-bottom: 15px; padding: 10px; border-left: 3px solid #e74c3c; }
          .item-name { font-weight: bold; font-size: 18px; }
          .item-description { color: #666; margin: 5px 0; }
          .item-price { font-weight: bold; color: #e74c3c; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Pronto Pizza Cafe</h1>
          <p>Fresh Pizza & Premium Coffee</p>
          <p>914 Ashland Rd, Mansfield, OH 44905 | (419) 589-7777</p>
        </div>
        ${categories
          .filter((cat) => cat.isActive)
          .map(
            (category) => `
          <div class="category">
            <h2 class="category-title">${category.name}</h2>
            ${menuItems
              .filter((item) => item.category === category.id && item.isActive)
              .map(
                (item) => `
              <div class="menu-item">
                <div class="item-name">${item.name}</div>
                <div class="item-description">${item.description}</div>
                <div class="item-price">$${item.price.toFixed(2)}</div>
              </div>
            `,
              )
              .join("")}
          </div>
        `,
          )
          .join("")}
      </body>
      </html>
    `;

    printWindow.document.write(menuHTML);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const renderContent = () => {
    switch (selectedItem) {
      case "settings":
        return (
          <SettingsForm
            settings={
              settings || { taxRate: 8.5, deliveryFee: 2.99, businessHours: {} }
            }
            onSettingsChange={updateSettings}
          />
        );
      case "categories":
        return (
          <MenuCategoryForm
            categories={categories}
            subCategories={subCategories}
            menuItems={menuItems}
            toppingCategories={toppingCategories}
            createCategory={createCategory}
            updateCategory={updateCategory}
            deleteCategory={deleteCategory}
            createSubCategory={createSubCategory}
            updateSubCategory={updateSubCategory}
            deleteSubCategory={deleteSubCategory}
          />
        );
      case "menu-items":
        return (
          <MenuItemForm
            menuItems={menuItems}
            categories={categories}
            subCategories={subCategories}
            toppingCategories={toppingCategories}
            toppings={toppings}
            selectedMenuCategory={selectedMenuCategory}
            onSelectedCategoryChange={setSelectedMenuCategory}
            createMenuItem={createMenuItem}
            updateMenuItem={updateMenuItem}
            deleteMenuItem={deleteMenuItem}
          />
        );
      case "topping-categories":
        return (
          <ToppingCategoryForm
            toppingCategories={toppingCategories}
            categories={categories}
            toppings={toppings}
            selectedToppingCategory={selectedToppingCategory}
            onSelectedCategoryChange={setSelectedToppingCategory}
            createToppingCategory={createToppingCategory}
            updateToppingCategory={updateToppingCategory}
            deleteToppingCategory={deleteToppingCategory}
          />
        );
      case "topping-items":
        return (
          <ToppingItemForm
            toppings={toppings}
            categories={categories}
            toppingCategories={toppingCategories}
            selectedToppingCategory={selectedToppingCategory}
            onSelectedCategoryChange={setSelectedToppingCategory}
            createTopping={createTopping}
            updateTopping={updateTopping}
            deleteTopping={deleteTopping}
          />
        );
      case "specials":
        return (
          <SpecialForm
            specials={specials}
            categories={categories}
            menuItems={menuItems}
            createSpecial={createSpecial}
            updateSpecial={updateSpecial}
            deleteSpecial={deleteSpecial}
          />
        );
      case "about-page":
        return (
          <AboutPageForm
            aboutSections={aboutSections}
            createAboutSection={createAboutSection}
            updateAboutSection={updateAboutSection}
            deleteAboutSection={deleteAboutSection}
          />
        );
      case "image-manager":
        return (
          <ImageManagerForm
            images={images}
            uploadImageFile={uploadImageFile}
            createImageFromUrl={createImageFromUrl}
            updateImage={updateImage}
            deleteImage={deleteImage}
          />
        );
      case "carousel-images":
        return (
          <CarouselForm
            carouselImages={carouselImages}
            createCarouselImage={createCarouselImage}
            updateCarouselImage={updateCarouselImage}
            deleteCarouselImage={deleteCarouselImage}
          />
        );
      case "customer-favorites":
        return (
          <CustomerFavoriteForm
            customerFavorites={customerFavorites}
            createCustomerFavorite={createCustomerFavorite}
            updateCustomerFavorite={updateCustomerFavorite}
            deleteCustomerFavorite={deleteCustomerFavorite}
          />
        );
      default:
        return (
          <SettingsForm
            settings={
              settings || { taxRate: 8.5, deliveryFee: 2.99, businessHours: {} }
            }
            onSettingsChange={updateSettings}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderWithDelivery breadcrumbs={[{ label: "Admin Dashboard" }]} />

      <div className="flex h-screen">
        {/* Sidebar */}
        <AdminSidebar
          selectedItem={selectedItem}
          onSelectItem={setSelectedItem}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="mb-8 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={generateMenuPDF}>
                  <FileText className="h-4 w-4 mr-2" />
                  Print Menu PDF
                </Button>
              </div>
            </div>

            {/* Dynamic Content */}
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
