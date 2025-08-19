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

  // Load data conditionally based on selected tab to improve performance
  const needsSubCategories = ["categories", "sub-categories", "menu-items"].includes(selectedItem);
  const needsMenuItems = ["menu-items", "specials"].includes(selectedItem);
  const needsToppings = ["topping-items", "menu-items"].includes(selectedItem);
  const needsToppingCategories = ["topping-categories", "topping-items", "menu-items"].includes(selectedItem);
  const needsImages = ["image-manager", "about-page", "carousel-images", "menu-items"].includes(selectedItem);
  const needsSizeData = ["categories", "category-sizes", "sub-categories", "menu-items", "topping-items"].includes(selectedItem);

  // Use empty hooks for tabs we don't need to avoid performance issues
  const emptySubCategoriesHook = { subCategories: [], createSubCategory: () => Promise.resolve(), updateSubCategory: () => Promise.resolve(), deleteSubCategory: () => Promise.resolve() };
  const emptyMenuItemsHook = { menuItems: [], loading: false, createMenuItem: () => Promise.resolve(), updateMenuItem: () => Promise.resolve(), deleteMenuItem: () => Promise.resolve() };
  const emptyToppingsHook = { toppings: [], loading: false, createTopping: () => Promise.resolve(), updateTopping: () => Promise.resolve(), deleteTopping: () => Promise.resolve() };
  const emptyToppingCategoriesHook = { toppingCategories: [], loading: false, createToppingCategory: () => Promise.resolve(), updateToppingCategory: () => Promise.resolve(), deleteToppingCategory: () => Promise.resolve() };
  const emptyImagesHook = { images: [], loading: false, uploadImageFile: () => Promise.resolve(), createImageFromUrl: () => Promise.resolve(), updateImage: () => Promise.resolve(), deleteImage: () => Promise.resolve() };
  const emptyCategorySizesHook = { categorySizes: [], loading: false, createCategorySize: () => Promise.resolve(), updateCategorySize: () => Promise.resolve(), deleteCategorySize: () => Promise.resolve() };
  const emptySubCategorySizesHook = { subCategorySizes: [], loading: false, updateSubCategorySizes: () => Promise.resolve() };
  const emptyMenuItemSizesHook = { menuItemSizes: [], loading: false, updateMenuItemSizesForItem: () => Promise.resolve() };
  const emptyMenuItemSizeToppingsHook = { menuItemSizeToppings: [], loading: false, updateMenuItemSizeToppings: () => Promise.resolve() };
  const emptyToppingSizePricesHook = { toppingSizePrices: [], loading: false, updateToppingSizePrices: () => Promise.resolve(), getToppingSizePrices: () => [], getToppingPriceForSize: () => 0, refetch: () => Promise.resolve() };

  // Call hooks in same order but use empty implementations when not needed
  const subCategoriesHook = needsSubCategories ? useSubCategories() : emptySubCategoriesHook;
  const subCategories = subCategoriesHook.subCategories;
  const createSubCategory = subCategoriesHook.createSubCategory;
  const updateSubCategory = subCategoriesHook.updateSubCategory;
  const deleteSubCategory = subCategoriesHook.deleteSubCategory;

  const menuItemsHook = needsMenuItems ? useMenuItems() : emptyMenuItemsHook;
  const menuItems = menuItemsHook.menuItems;
  const menuItemsLoading = menuItemsHook.loading;
  const createMenuItem = menuItemsHook.createMenuItem;
  const updateMenuItem = menuItemsHook.updateMenuItem;
  const deleteMenuItem = menuItemsHook.deleteMenuItem;

  const toppingsHook = needsToppings ? useToppings() : emptyToppingsHook;
  const toppings = toppingsHook.toppings;
  const toppingsLoading = toppingsHook.loading;
  const createTopping = toppingsHook.createTopping;
  const updateTopping = toppingsHook.updateTopping;
  const deleteTopping = toppingsHook.deleteTopping;

  const toppingCategoriesHook = needsToppingCategories ? useToppingCategories() : emptyToppingCategoriesHook;
  const toppingCategories = toppingCategoriesHook.toppingCategories;
  const toppingCategoriesLoading = toppingCategoriesHook.loading;
  const createToppingCategory = toppingCategoriesHook.createToppingCategory;
  const updateToppingCategory = toppingCategoriesHook.updateToppingCategory;
  const deleteToppingCategory = toppingCategoriesHook.deleteToppingCategory;

  const imagesHook = needsImages ? useImages() : emptyImagesHook;
  const images = imagesHook.images;
  const imagesLoading = imagesHook.loading;
  const uploadImageFile = imagesHook.uploadImageFile;
  const createImageFromUrl = imagesHook.createImageFromUrl;
  const updateImage = imagesHook.updateImage;
  const deleteImage = imagesHook.deleteImage;

  // Size-related hooks
  const categorySizesHook = needsSizeData ? useCategorySizes() : emptyCategorySizesHook;
  const categorySizes = categorySizesHook.categorySizes;
  const categorySizesLoading = categorySizesHook.loading;
  const createCategorySize = categorySizesHook.createCategorySize;
  const updateCategorySize = categorySizesHook.updateCategorySize;
  const deleteCategorySize = categorySizesHook.deleteCategorySize;

  const subCategorySizesHook = needsSizeData ? useSubCategorySizes() : emptySubCategorySizesHook;
  const subCategorySizes = subCategorySizesHook.subCategorySizes;
  const subCategorySizesLoading = subCategorySizesHook.loading;
  const updateSubCategorySizes = subCategorySizesHook.updateSubCategorySizes;

  const menuItemSizesHook = needsMenuItems ? useMenuItemSizes() : emptyMenuItemSizesHook;
  const menuItemSizes = menuItemSizesHook.menuItemSizes;
  const menuItemSizesLoading = menuItemSizesHook.loading;
  const updateMenuItemSizesForItem = menuItemSizesHook.updateMenuItemSizesForItem;

  const menuItemSizeToppingsHook = needsMenuItems ? useMenuItemSizeToppings() : emptyMenuItemSizeToppingsHook;
  const menuItemSizeToppings = menuItemSizeToppingsHook.menuItemSizeToppings;
  const menuItemSizeTopLoading = menuItemSizeToppingsHook.loading;
  const updateMenuItemSizeToppings = menuItemSizeToppingsHook.updateMenuItemSizeToppings;

  const toppingSizePricesHook = needsToppings ? useToppingSizePrices() : emptyToppingSizePricesHook;
  const toppingSizePrices = toppingSizePricesHook.toppingSizePrices;
  const toppingSizePricesLoading = toppingSizePricesHook.loading;
  const updateToppingSizePrices = toppingSizePricesHook.updateToppingSizePrices;
  const getToppingSizePrices = toppingSizePricesHook.getToppingSizePrices;
  const getToppingPriceForSize = toppingSizePricesHook.getToppingPriceForSize;

  // Load other hooks only when needed
  const settingsHook = selectedItem === "settings" ? useSettings() : { settings: null, loading: false, updateSettings: () => Promise.resolve() };
  const specialsHook = selectedItem === "specials" ? useSpecials() : { specials: [], loading: false, createSpecial: () => Promise.resolve(), updateSpecial: () => Promise.resolve(), deleteSpecial: () => Promise.resolve() };
  const carouselHook = selectedItem === "carousel-images" ? useCarouselImages() : { carouselImages: [], loading: false, createCarouselImage: () => Promise.resolve(), updateCarouselImage: () => Promise.resolve(), deleteCarouselImage: () => Promise.resolve() };
  const favoritesHook = selectedItem === "customer-favorites" ? useCustomerFavorites() : { customerFavorites: [], loading: false, createCustomerFavorite: () => Promise.resolve(), updateCustomerFavorite: () => Promise.resolve(), deleteCustomerFavorite: () => Promise.resolve() };
  const aboutHook = selectedItem === "about-page" ? useAboutSections() : { aboutSections: [], loading: false, createAboutSection: () => Promise.resolve(), updateAboutSection: () => Promise.resolve(), deleteAboutSection: () => Promise.resolve() };

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
    settingsHook.loading ||
    specialsHook.loading ||
    carouselHook.loading ||
    favoritesHook.loading ||
    aboutHook.loading;


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
