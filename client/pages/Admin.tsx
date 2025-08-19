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
  useMenuItemSizes,
  useMenuItemSizeToppings,
  useToppingSizePrices,
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
import DatabaseSetup from "../components/admin/DatabaseSetup";
import CategorySizesPage from "../components/admin/CategorySizesPage";
import SubCategoriesPage from "../components/admin/SubCategoriesPage";

export default function Admin() {
  const [selectedItem, setSelectedItem] = useState("categories");

  // Debug re-renders
  const renderCount = React.useRef(0);
  renderCount.current += 1;

  console.log(`🔄 Admin render #${renderCount.current} at ${new Date().toLocaleTimeString()}`);

  // Track what might be causing re-renders
  React.useEffect(() => {
    console.log(`⚡ Admin selectedItem changed to: ${selectedItem}`);
  }, [selectedItem]);

  // Check for any timers/intervals that might be causing re-renders
  React.useEffect(() => {
    const checkTimers = () => {
      const highestTimeoutId = setTimeout(() => {}, 0);
      clearTimeout(highestTimeoutId);
      if (highestTimeoutId > 50) {
        console.warn(`⏰ Many active timers detected: ${highestTimeoutId}`);
      }
    };

    checkTimers();
    const interval = setInterval(checkTimers, 5000);

    return () => clearInterval(interval);
  }, []);


  // Filter states
  const [selectedMenuCategory, setSelectedMenuCategory] = useState("all");
  const [selectedToppingCategory, setSelectedToppingCategory] = useState("all");

  // Core hooks that are always needed
  const {
    categories,
    loading: categoriesLoading,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();

  // TIMER LEAK HUNT - Test with absolute minimum hooks
  console.log(`🪝 TIMER LEAK TEST - Using absolute minimum hooks at ${new Date().toLocaleTimeString()}`);

  // Test with ONLY the core categories hook to see if timer leak persists
  console.log(`🪝 About to call useCategorySizes hook...`);
  const categorySizesHook = useCategorySizes();
  console.log(`🪝 useCategorySizes completed`);

  // Use empty implementations for everything else
  const subCategoriesHook = { subCategories: [], createSubCategory: () => Promise.resolve(), updateSubCategory: () => Promise.resolve(), deleteSubCategory: () => Promise.resolve() };
  const subCategorySizesHook = { subCategorySizes: [], loading: false, updateSubCategorySizes: () => Promise.resolve() };
  const menuItemsHook = { menuItems: [], loading: false, createMenuItem: () => Promise.resolve(), updateMenuItem: () => Promise.resolve(), deleteMenuItem: () => Promise.resolve() };
  const toppingsHook = { toppings: [], loading: false, createTopping: () => Promise.resolve(), updateTopping: () => Promise.resolve(), deleteTopping: () => Promise.resolve() };
  const toppingCategoriesHook = { toppingCategories: [], loading: false, createToppingCategory: () => Promise.resolve(), updateToppingCategory: () => Promise.resolve(), deleteToppingCategory: () => Promise.resolve() };
  const imagesHook = { images: [], loading: false, uploadImageFile: () => Promise.resolve(), createImageFromUrl: () => Promise.resolve(), updateImage: () => Promise.resolve(), deleteImage: () => Promise.resolve() };
  const menuItemSizesHook = { menuItemSizes: [], loading: false, updateMenuItemSizesForItem: () => Promise.resolve() };
  const menuItemSizeToppingsHook = { menuItemSizeToppings: [], loading: false, updateMenuItemSizeToppings: () => Promise.resolve() };
  const toppingSizePricesHook = { toppingSizePrices: [], loading: false, updateToppingSizePrices: () => Promise.resolve(), getToppingSizePrices: () => [], getToppingPriceForSize: () => 0 };

  console.log(`🪝 TIMER LEAK TEST - Only useCategorySizes active, data length:`, categorySizesHook.categorySizes.length);

  // Conditionally use data based on active tab for performance
  const needsSubCategories = ["categories", "sub-categories", "menu-items"].includes(selectedItem);
  const needsMenuItems = ["menu-items", "specials"].includes(selectedItem);
  const needsToppings = ["topping-items", "menu-items"].includes(selectedItem);
  const needsToppingCategories = ["topping-categories", "topping-items", "menu-items"].includes(selectedItem);
  const needsImages = ["image-manager", "about-page", "carousel-images", "menu-items"].includes(selectedItem);
  const needsSizeData = ["categories", "category-sizes", "sub-categories", "menu-items", "topping-items"].includes(selectedItem);

  // Extract data with conditional usage
  const subCategories = needsSubCategories ? subCategoriesHook.subCategories : [];
  const createSubCategory = needsSubCategories ? subCategoriesHook.createSubCategory : (() => Promise.resolve());
  const updateSubCategory = needsSubCategories ? subCategoriesHook.updateSubCategory : (() => Promise.resolve());
  const deleteSubCategory = needsSubCategories ? subCategoriesHook.deleteSubCategory : (() => Promise.resolve());

  const menuItems = needsMenuItems ? menuItemsHook.menuItems : [];
  const menuItemsLoading = needsMenuItems ? menuItemsHook.loading : false;
  const createMenuItem = needsMenuItems ? menuItemsHook.createMenuItem : (() => Promise.resolve());
  const updateMenuItem = needsMenuItems ? menuItemsHook.updateMenuItem : (() => Promise.resolve());
  const deleteMenuItem = needsMenuItems ? menuItemsHook.deleteMenuItem : (() => Promise.resolve());

  const toppings = needsToppings ? toppingsHook.toppings : [];
  const toppingsLoading = needsToppings ? toppingsHook.loading : false;
  const createTopping = needsToppings ? toppingsHook.createTopping : (() => Promise.resolve());
  const updateTopping = needsToppings ? toppingsHook.updateTopping : (() => Promise.resolve());
  const deleteTopping = needsToppings ? toppingsHook.deleteTopping : (() => Promise.resolve());

  const toppingCategories = needsToppingCategories ? toppingCategoriesHook.toppingCategories : [];
  const toppingCategoriesLoading = needsToppingCategories ? toppingCategoriesHook.loading : false;
  const createToppingCategory = needsToppingCategories ? toppingCategoriesHook.createToppingCategory : (() => Promise.resolve());
  const updateToppingCategory = needsToppingCategories ? toppingCategoriesHook.updateToppingCategory : (() => Promise.resolve());
  const deleteToppingCategory = needsToppingCategories ? toppingCategoriesHook.deleteToppingCategory : (() => Promise.resolve());

  const images = needsImages ? imagesHook.images : [];
  const imagesLoading = needsImages ? imagesHook.loading : false;
  const uploadImageFile = needsImages ? imagesHook.uploadImageFile : (() => Promise.resolve());
  const createImageFromUrl = needsImages ? imagesHook.createImageFromUrl : (() => Promise.resolve());
  const updateImage = needsImages ? imagesHook.updateImage : (() => Promise.resolve());
  const deleteImage = needsImages ? imagesHook.deleteImage : (() => Promise.resolve());

  const categorySizes = needsSizeData ? categorySizesHook.categorySizes : [];
  const categorySizesLoading = needsSizeData ? categorySizesHook.loading : false;
  const createCategorySize = needsSizeData ? categorySizesHook.createCategorySize : (() => Promise.resolve());
  const updateCategorySize = needsSizeData ? categorySizesHook.updateCategorySize : (() => Promise.resolve());
  const deleteCategorySize = needsSizeData ? categorySizesHook.deleteCategorySize : (() => Promise.resolve());

  const subCategorySizes = needsSizeData ? subCategorySizesHook.subCategorySizes : [];
  const subCategorySizesLoading = needsSizeData ? subCategorySizesHook.loading : false;
  const updateSubCategorySizes = needsSizeData ? subCategorySizesHook.updateSubCategorySizes : (() => Promise.resolve());

  const menuItemSizes = needsMenuItems ? menuItemSizesHook.menuItemSizes : [];
  const menuItemSizesLoading = needsMenuItems ? menuItemSizesHook.loading : false;
  const updateMenuItemSizesForItem = needsMenuItems ? menuItemSizesHook.updateMenuItemSizesForItem : (() => Promise.resolve());

  const menuItemSizeToppings = needsMenuItems ? menuItemSizeToppingsHook.menuItemSizeToppings : [];
  const menuItemSizeTopLoading = needsMenuItems ? menuItemSizeToppingsHook.loading : false;
  const updateMenuItemSizeToppings = needsMenuItems ? menuItemSizeToppingsHook.updateMenuItemSizeToppings : (() => Promise.resolve());

  const toppingSizePrices = needsToppings ? toppingSizePricesHook.toppingSizePrices : [];
  const toppingSizePricesLoading = needsToppings ? toppingSizePricesHook.loading : false;
  const updateToppingSizePrices = needsToppings ? toppingSizePricesHook.updateToppingSizePrices : (() => Promise.resolve());
  const getToppingSizePrices = needsToppings ? toppingSizePricesHook.getToppingSizePrices : (() => []);
  const getToppingPriceForSize = needsToppings ? toppingSizePricesHook.getToppingPriceForSize : (() => 0);

  // Temporarily disable secondary hooks to test timer leak
  console.log(`🪝 Using empty implementations for secondary hooks`);
  const settingsHook = { settings: null, loading: false, updateSettings: () => Promise.resolve() };
  const specialsHook = { specials: [], loading: false, createSpecial: () => Promise.resolve(), updateSpecial: () => Promise.resolve(), deleteSpecial: () => Promise.resolve() };
  const carouselHook = { carouselImages: [], loading: false, createCarouselImage: () => Promise.resolve(), updateCarouselImage: () => Promise.resolve(), deleteCarouselImage: () => Promise.resolve() };
  const favoritesHook = { customerFavorites: [], loading: false, createCustomerFavorite: () => Promise.resolve(), updateCustomerFavorite: () => Promise.resolve(), deleteCustomerFavorite: () => Promise.resolve() };
  const aboutHook = { aboutSections: [], loading: false, createAboutSection: () => Promise.resolve(), updateAboutSection: () => Promise.resolve(), deleteAboutSection: () => Promise.resolve() };
  console.log(`🪝 All secondary hooks using empty implementations`);

  // Show loading state only for active data
  const isLoading =
    categoriesLoading ||
    menuItemsLoading ||
    toppingsLoading ||
    toppingCategoriesLoading ||
    imagesLoading ||
    categorySizesLoading ||
    subCategorySizesLoading ||
    menuItemSizesLoading ||
    menuItemSizeTopLoading ||
    toppingSizePricesLoading ||
    (selectedItem === "settings" && settingsHook.loading) ||
    (selectedItem === "specials" && specialsHook.loading) ||
    (selectedItem === "carousel-images" && carouselHook.loading) ||
    (selectedItem === "customer-favorites" && favoritesHook.loading) ||
    (selectedItem === "about-page" && aboutHook.loading);


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
                (item) => {
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
                }
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
              settingsHook.settings || { taxRate: 8.5, deliveryFee: 2.99, businessHours: {} }
            }
            onSettingsChange={settingsHook.updateSettings}
          />
        );
      case "categories":
        return (
          <MenuCategoryForm
            categories={categories}
            subCategories={subCategories}
            menuItems={menuItems}
            toppingCategories={toppingCategories}
            categorySizes={categorySizes}
            subCategorySizes={subCategorySizes}
            createCategory={createCategory}
            updateCategory={updateCategory}
            deleteCategory={deleteCategory}
            createSubCategory={createSubCategory}
            updateSubCategory={updateSubCategory}
            deleteSubCategory={deleteSubCategory}
            createCategorySize={createCategorySize}
            updateCategorySize={updateCategorySize}
            deleteCategorySize={deleteCategorySize}
            updateSubCategorySizes={updateSubCategorySizes}
          />
        );
      case "category-sizes":
        return (
          <CategorySizesPage
            categories={categories}
            categorySizes={categorySizes}
            createCategorySize={createCategorySize}
            updateCategorySize={updateCategorySize}
            deleteCategorySize={deleteCategorySize}
          />
        );
      case "sub-categories":
        return (
          <SubCategoriesPage
            categories={categories}
            subCategories={subCategories}
            categorySizes={categorySizes}
            subCategorySizes={subCategorySizes}
            createSubCategory={createSubCategory}
            updateSubCategory={updateSubCategory}
            deleteSubCategory={deleteSubCategory}
            updateSubCategorySizes={updateSubCategorySizes}
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
          />
        );
      case "specials":
        return (
          <SpecialForm
            specials={specialsHook.specials}
            categories={categories}
            menuItems={menuItems}
            createSpecial={specialsHook.createSpecial}
            updateSpecial={specialsHook.updateSpecial}
            deleteSpecial={specialsHook.deleteSpecial}
          />
        );
      case "about-page":
        return (
          <AboutPageForm
            aboutSections={aboutHook.aboutSections}
            images={images}
            createAboutSection={aboutHook.createAboutSection}
            updateAboutSection={aboutHook.updateAboutSection}
            deleteAboutSection={aboutHook.deleteAboutSection}
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
            carouselImages={carouselHook.carouselImages}
            images={images}
            createCarouselImage={carouselHook.createCarouselImage}
            updateCarouselImage={carouselHook.updateCarouselImage}
            deleteCarouselImage={carouselHook.deleteCarouselImage}
          />
        );
      case "customer-favorites":
        return (
          <CustomerFavoriteForm
            customerFavorites={favoritesHook.customerFavorites}
            createCustomerFavorite={favoritesHook.createCustomerFavorite}
            updateCustomerFavorite={favoritesHook.updateCustomerFavorite}
            deleteCustomerFavorite={favoritesHook.deleteCustomerFavorite}
          />
        );
      case "database-setup":
        return <DatabaseSetup />;
      default:
        return (
          <SettingsForm
            settings={
              settingsHook.settings || { taxRate: 8.5, deliveryFee: 2.99, businessHours: {} }
            }
            onSettingsChange={settingsHook.updateSettings}
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
