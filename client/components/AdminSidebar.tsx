import { useState } from "react";
import { Button } from "./ui/button";
import {
  ChevronDown,
  ChevronRight,
  Menu as MenuIcon,
  Pizza,
  Calendar,
  Image as ImageIcon,
  Settings,
  FileText,
  Database,
} from "lucide-react";

interface SidebarItem {
  id: string;
  label: string;
  icon?: any;
  children?: SidebarItem[];
}

interface AdminSidebarProps {
  selectedItem: string;
  onSelectItem: (itemId: string) => void;
}

const sidebarItems: SidebarItem[] = [
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
  },
  {
    id: "menu",
    label: "Menu",
    icon: MenuIcon,
    children: [
      { id: "menu-categories", label: "Menu Categories" },
      { id: "menu-sub-categories", label: "Sub-Categories" },
      { id: "menu-category-sizes", label: "Category Sizes" },
      { id: "menu-items", label: "Menu Items" },
    ],
  },
  {
    id: "toppings",
    label: "Toppings",
    icon: Pizza,
    children: [
      { id: "topping-categories", label: "Topping Categories" },
      { id: "topping-items", label: "Topping Items" },
    ],
  },
  {
    id: "specials",
    label: "Specials",
    icon: Calendar,
  },
  {
    id: "about-page",
    label: "About Page",
    icon: FileText,
  },
  {
    id: "image-manager",
    label: "Image Manager",
    icon: ImageIcon,
  },
  {
    id: "website-content",
    label: "Website Content",
    icon: ImageIcon,
    children: [
      { id: "carousel-images", label: "Carousel Images" },
      { id: "customer-favorites", label: "Customer Favorites" },
    ],
  },
];

export default function AdminSidebar({
  selectedItem,
  onSelectItem,
}: AdminSidebarProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(["settings", "menu", "toppings", "images"]),
  );

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const renderSidebarItem = (item: SidebarItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const isSelected = selectedItem === item.id;

    return (
      <div key={item.id}>
        <Button
          variant="ghost"
          className={`justify-start text-left h-auto py-3 px-4 w-full ${
            level > 0 ? "ml-6 w-[calc(100%-1.5rem)] text-sm" : ""
          }`}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id);
            } else {
              onSelectItem(item.id);
            }
          }}
          style={{
            backgroundColor: isSelected ? "var(--primary)" : "transparent",
            color: isSelected ? "var(--primary-foreground)" : "var(--foreground)",
            border: "none",
            justifyContent: "flex-start",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            if (!isSelected) {
              e.currentTarget.style.backgroundColor = "var(--accent)";
              e.currentTarget.style.color = "var(--accent-foreground)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isSelected) {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--foreground)";
            }
          }}
        >
          <div className="flex items-center space-x-2 w-full">
            {item.icon && (
              <item.icon
                className="h-4 w-4"
                style={{
                  color: isSelected
                    ? "var(--primary-foreground)"
                    : "var(--muted-foreground)",
                }}
              />
            )}
            <span
              className="flex-1"
              style={{
                color: isSelected ? "var(--primary-foreground)" : "var(--foreground)",
              }}
            >
              {item.label}
            </span>
            {hasChildren &&
              (isExpanded ? (
                <ChevronDown
                  className="h-4 w-4"
                  style={{
                    color: isSelected
                      ? "var(--primary-foreground)"
                      : "var(--muted-foreground)",
                  }}
                />
              ) : (
                <ChevronRight
                  className="h-4 w-4"
                  style={{
                    color: isSelected
                      ? "var(--primary-foreground)"
                      : "var(--muted-foreground)",
                  }}
                />
              ))}
          </div>
        </Button>

        {hasChildren && isExpanded && (
          <div className="mt-1">
            {item.children!.map((child) => renderSidebarItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className="w-64 h-full"
      style={{
        backgroundColor: "var(--card)",
        borderRight: "1px solid var(--border)",
      }}
    >
      <div className="p-4">
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: "var(--card-foreground)" }}
        >
          Admin Panel
        </h2>
        <nav className="space-y-2">
          {sidebarItems.map((item) => renderSidebarItem(item))}
        </nav>
      </div>
    </div>
  );
}
