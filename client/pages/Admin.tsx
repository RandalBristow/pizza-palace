import React, { useState, useMemo, useRef, useEffect } from "react";
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
  useCategorySizeSubCategories,
  useMenuItemSizes,
  useMenuItemSizeToppings,
  useToppingSizePrices,
} from "../hooks/useSupabase";

// Import form components
import SettingsForm from "../components/admin/SettingsForm";
import MenuCategoriesForm from "../components/admin/MenuCategoriesForm";
import MenuSubCategoriesForm from "../components/admin/MenuSubCategoriesForm";
import MenuCategorySizesForm from "../components/admin/MenuCategorySizesForm";
import MenuItemsForm from "../components/admin/MenuItemsForm";
import ToppingCategoriesForm from "../components/admin/ToppingCategoriesForm";
import ToppingItemsForm from "../components/admin/ToppingItemsForm";
import SpecialForm from "../components/admin/SpecialForm";
import CarouselImagesForm from "../components/admin/CarouselImagesForm";
import CustomerFavoriteForm from "../components/admin/CustomerFavoriteForm";
import AboutPageForm from "../components/admin/AboutPageForm";
import SiteImagesForm from "../components/admin/SiteImagesForm";

export default function Admin() {
  const [selectedItem, setSelectedItem] = useState("categories");

  // Filter states
  const [selectedMenuCategory, setSelectedMenuCategory] = useState("all");

  // Wrapper functions to trigger refetches after data changes
  const createCategorySizeWithRefetch = async (categorySize: any) => {
    const result = await createCategorySize(categorySize);
    // Refetch all related data to ensure consistency
    await Promise.all([
      refetchCategorySizes(),
      refetchSubCategorySizes(),
      refetchCategorySizeSubCategories(),
    ]);
    return result;
  };

  const updateCategorySizeSubCategoriesWithRefetch = async (
    sizeId: string,
    subCategoryIds: string[],
  ) => {
    await updateCategorySizeSubCategories(sizeId, subCategoryIds);
    // Refetch all related data to ensure consistency
    await Promise.all([
      refetchSubCategorySizes(),
      refetchCategorySizeSubCategories(),
    ]);
  };
  const [selectedToppingCategory, setSelectedToppingCategory] = useState("all");

  // All hooks - restore normal usage
  const {
    categories,
    loading: categoriesLoading,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();

  const {
    subCategories,
    loading: subCategoriesLoading,
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
    loading: categorySizesLoading,
    createCategorySize,
    updateCategorySize,
    deleteCategorySize,
    refetch: refetchCategorySizes,
  } = useCategorySizes();

  const {
    subCategorySizes,
    loading: subCategorySizesLoading,
    updateSubCategorySizes,
    refetch: refetchSubCategorySizes,
  } = useSubCategorySizes();

  const {
    categorySizeSubCategories,
    loading: categorySizeSubCategoriesLoading,
    updateCategorySizeSubCategories,
    refetch: refetchCategorySizeSubCategories,
  } = useCategorySizeSubCategories();

  const {
    menuItemSizes,
    loading: menuItemSizesLoading,
    updateMenuItemSizesForItem,
  } = useMenuItemSizes();

  const {
    menuItemSizeToppings,
    loading: menuItemSizeToppingsLoading,
    updateMenuItemSizeToppings,
  } = useMenuItemSizeToppings();

  const {
    toppingSizePrices,
    loading: toppingSizePricesLoading,
    updateToppingSizePrices,
    getToppingSizePrices,
    getToppingPriceForSize,
  } = useToppingSizePrices();

  const isLoading =
    categoriesLoading ||
    subCategoriesLoading ||
    menuItemsLoading ||
    toppingsLoading ||
    toppingCategoriesLoading ||
    specialsLoading ||
    carouselLoading ||
    favoritesLoading ||
    settingsLoading ||
    aboutLoading ||
    imagesLoading ||
    categorySizesLoading ||
    subCategorySizesLoading ||
    categorySizeSubCategoriesLoading ||
    menuItemSizesLoading ||
    menuItemSizeToppingsLoading ||
    toppingSizePricesLoading;

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
              .map((item) => {
                // Get pricing based on size-based pricing structure
                const itemSizes = menuItemSizes.filter(
                  (ms) => ms.menu_item_id === item.id,
                );
                let priceDisplay = "Price Available";

                if (itemSizes.length > 0) {
                  const prices = itemSizes.map((itemSize) => itemSize.price);
                  const minPrice = Math.min(...prices);
                  const maxPrice = Math.max(...prices);

                  if (minPrice === maxPrice) {
                    priceDisplay = `$${minPrice.toFixed(2)}`;
                  } else {
                    priceDisplay = `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;
                  }
                }

                return `
              <div class="menu-item">
                <div class="item-name">${item.name}</div>
                <div class="item-description">${item.description}</div>
                <div class="item-price">${priceDisplay}</div>
              </div>
            `;
              })
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
      case "menu-categories":
        return (
          <MenuCategoriesForm
            categories={categories}
            subCategories={subCategories}
            menuItems={menuItems}
            toppingCategories={toppingCategories}
            categorySizes={categorySizes}
            subCategorySizes={subCategorySizes}
            createCategory={createCategory}
            updateCategory={updateCategory}
            deleteCategory={deleteCategory}
            showTitle={true}
            hideAddButton={false}
          />
        );
      case "menu-category-sizes":
        return (
          <MenuCategorySizesForm
            categories={categories}
            subCategories={subCategories}
            categorySizes={categorySizes}
            categorySizeSubCategories={categorySizeSubCategories}
            createCategorySize={createCategorySizeWithRefetch}
            updateCategorySize={updateCategorySize}
            deleteCategorySize={deleteCategorySize}
            updateCategorySizeSubCategories={
              updateCategorySizeSubCategoriesWithRefetch
            }
            showTitle={true}
            hideAddButton={false}
          />
        );
      case "menu-sub-categories":
        return (
          <MenuSubCategoriesForm
            categories={categories}
            subCategories={subCategories}
            categorySizes={categorySizes}
            subCategorySizes={subCategorySizes}
            createSubCategory={createSubCategory}
            updateSubCategory={updateSubCategory}
            deleteSubCategory={deleteSubCategory}
            showTitle={true}
            hideAddButton={false}
          />
        );
      case "menu-items":
        return (
          <MenuItemsForm
            menuItems={menuItems}
            categories={categories}
            subCategories={subCategories}
            toppingCategories={toppingCategories}
            toppings={toppings}
            categorySizes={categorySizes}
            subCategorySizes={subCategorySizes}
            menuItemSizes={menuItemSizes}
            menuItemSizeToppings={menuItemSizeToppings}
            toppingSizePrices={toppingSizePrices}
            images={images}
            selectedMenuCategory={selectedMenuCategory}
            onSelectedCategoryChange={setSelectedMenuCategory}
            createMenuItem={createMenuItem}
            updateMenuItem={updateMenuItem}
            deleteMenuItem={deleteMenuItem}
            updateMenuItemSizesForItem={updateMenuItemSizesForItem}
            updateMenuItemSizeToppings={updateMenuItemSizeToppings}
            getToppingPriceForSize={getToppingPriceForSize}
            showTitle={true}
            hideAddButton={false}
          />
        );
      case "topping-categories":
        return (
          <ToppingCategoriesForm
            toppingCategories={toppingCategories}
            categories={categories}
            toppings={toppings}
            selectedToppingCategory={selectedToppingCategory}
            onSelectedCategoryChange={setSelectedToppingCategory}
            createToppingCategory={createToppingCategory}
            updateToppingCategory={updateToppingCategory}
            deleteToppingCategory={deleteToppingCategory}
            showTitle={true}
            hideAddButton={false}
          />
        );
      case "topping-items":
        return (
          <ToppingItemsForm
            toppings={toppings}
            categories={categories}
            toppingCategories={toppingCategories}
            categorySizes={categorySizes}
            toppingSizePrices={toppingSizePrices}
            selectedToppingCategory={selectedToppingCategory}
            onSelectedCategoryChange={setSelectedToppingCategory}
            createTopping={createTopping}
            updateTopping={updateTopping}
            deleteTopping={deleteTopping}
            updateToppingSizePrices={updateToppingSizePrices}
            getToppingSizePrices={getToppingSizePrices}
            getToppingPriceForSize={getToppingPriceForSize}
            showTitle={true}
            hideAddButton={false}
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
            images={images}
            createAboutSection={createAboutSection}
            updateAboutSection={updateAboutSection}
            deleteAboutSection={deleteAboutSection}
          />
        );
      case "image-manager":
        return (
          <SiteImagesForm
            images={images}
            uploadImageFile={uploadImageFile}
            createImageFromUrl={createImageFromUrl}
            updateImage={updateImage}
            deleteImage={deleteImage}
            showTitle={true}
            hideAddButton={false}
          />
        );
      case "carousel-images":
        return (
          <CarouselImagesForm
            carouselImages={carouselImages}
            images={images}
            createCarouselImage={createCarouselImage}
            updateCarouselImage={updateCarouselImage}
            deleteCarouselImage={deleteCarouselImage}
            showTitle={true}
            hideAddButton={false}
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
