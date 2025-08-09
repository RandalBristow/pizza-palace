import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Plus, Edit, Trash2, Save, ThumbsUp, ThumbsDown, Star } from "lucide-react";

export interface CustomerFavorite {
  id: string;
  title: string;
  description: string;
  icon: string;
  isActive: boolean;
  order: number;
}

interface CustomerFavoriteFormProps {
  customerFavorites: CustomerFavorite[];
  onCustomerFavoritesChange: (customerFavorites: CustomerFavorite[]) => void;
}

export default function CustomerFavoriteForm({ 
  customerFavorites, 
  onCustomerFavoritesChange
}: CustomerFavoriteFormProps) {
  const [isAddingCustomerFavorite, setIsAddingCustomerFavorite] = useState(false);
  const [editingCustomerFavorite, setEditingCustomerFavorite] = useState<CustomerFavorite | null>(null);
  const [newCustomerFavorite, setNewCustomerFavorite] = useState({
    title: "",
    description: "",
    icon: "",
    order: 1,
    isActive: true,
  });

  const handleAddCustomerFavorite = () => {
    const id = `favorite-${Date.now()}`;
    onCustomerFavoritesChange([...customerFavorites, { ...newCustomerFavorite, id } as CustomerFavorite]);
    setIsAddingCustomerFavorite(false);
    resetForm();
  };

  const handleEditCustomerFavorite = (customerFavorite: CustomerFavorite) => {
    setEditingCustomerFavorite(customerFavorite);
    setNewCustomerFavorite({
      title: customerFavorite.title,
      description: customerFavorite.description,
      icon: customerFavorite.icon,
      order: customerFavorite.order,
      isActive: customerFavorite.isActive,
    });
  };

  const handleUpdateCustomerFavorite = () => {
    if (!editingCustomerFavorite) return;
    
    const updatedCustomerFavorites = customerFavorites.map((favorite) =>
      favorite.id === editingCustomerFavorite.id
        ? { ...favorite, ...newCustomerFavorite }
        : favorite
    );
    onCustomerFavoritesChange(updatedCustomerFavorites);
    setEditingCustomerFavorite(null);
    resetForm();
  };

  const handleDeleteCustomerFavorite = (id: string) => {
    onCustomerFavoritesChange(customerFavorites.filter((favorite) => favorite.id !== id));
  };

  const toggleCustomerFavoriteStatus = (id: string) => {
    const updatedCustomerFavorites = customerFavorites.map((favorite) =>
      favorite.id === id ? { ...favorite, isActive: !favorite.isActive } : favorite
    );
    onCustomerFavoritesChange(updatedCustomerFavorites);
  };

  const resetForm = () => {
    setNewCustomerFavorite({
      title: "",
      description: "",
      icon: "",
      order: 1,
      isActive: true,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Customer Favorites</h2>
        <Dialog open={isAddingCustomerFavorite} onOpenChange={setIsAddingCustomerFavorite}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Favorite
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Customer Favorite</DialogTitle>
              <DialogDescription>
                Add a new customer favorite item for the homepage
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="favoriteTitle">Title</Label>
                <Input
                  id="favoriteTitle"
                  placeholder="e.g., Fresh Ingredients"
                  value={newCustomerFavorite.title}
                  onChange={(e) =>
                    setNewCustomerFavorite({
                      ...newCustomerFavorite,
                      title: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="favoriteDescription">Description</Label>
                <Textarea
                  id="favoriteDescription"
                  placeholder="Description of this favorite"
                  rows={3}
                  value={newCustomerFavorite.description}
                  onChange={(e) =>
                    setNewCustomerFavorite({
                      ...newCustomerFavorite,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="favoriteIcon">Icon (Emoji)</Label>
                <Input
                  id="favoriteIcon"
                  placeholder="🍕"
                  value={newCustomerFavorite.icon}
                  onChange={(e) =>
                    setNewCustomerFavorite({
                      ...newCustomerFavorite,
                      icon: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="favoriteOrder">Display Order</Label>
                <Input
                  id="favoriteOrder"
                  type="number"
                  placeholder="1"
                  value={newCustomerFavorite.order}
                  onChange={(e) =>
                    setNewCustomerFavorite({
                      ...newCustomerFavorite,
                      order: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingCustomerFavorite(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddCustomerFavorite}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Favorite
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="bg-white rounded-lg border p-6">
        <p className="text-gray-600 mb-4">
          Manage customer favorite items displayed on the homepage.
        </p>
        {customerFavorites.length === 0 ? (
          <div className="text-center py-8">
            <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No customer favorites yet.</p>
            <p className="text-sm text-gray-400">
              Add favorite items to showcase on the homepage.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customerFavorites.map((favorite) => (
              <div key={favorite.id} className="border rounded-lg p-4">
                <div className="text-2xl mb-2">{favorite.icon}</div>
                <h3 className="font-semibold">{favorite.title}</h3>
                <p className="text-sm text-gray-600">
                  {favorite.description}
                </p>
                <div className="mt-2 flex justify-between items-center">
                  <Badge
                    className={
                      favorite.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {favorite.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleCustomerFavoriteStatus(favorite.id)}
                    >
                      {favorite.isActive ? (
                        <ThumbsDown className="h-4 w-4" />
                      ) : (
                        <ThumbsUp className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditCustomerFavorite(favorite)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCustomerFavorite(favorite.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Customer Favorite Dialog */}
      <Dialog open={editingCustomerFavorite !== null} onOpenChange={(open) => !open && setEditingCustomerFavorite(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Customer Favorite</DialogTitle>
            <DialogDescription>
              Update the customer favorite details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editFavoriteTitle">Title</Label>
              <Input
                id="editFavoriteTitle"
                placeholder="e.g., Fresh Ingredients"
                value={newCustomerFavorite.title}
                onChange={(e) =>
                  setNewCustomerFavorite({
                    ...newCustomerFavorite,
                    title: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="editFavoriteDescription">Description</Label>
              <Textarea
                id="editFavoriteDescription"
                placeholder="Description of this favorite"
                rows={3}
                value={newCustomerFavorite.description}
                onChange={(e) =>
                  setNewCustomerFavorite({
                    ...newCustomerFavorite,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="editFavoriteIcon">Icon (Emoji)</Label>
              <Input
                id="editFavoriteIcon"
                placeholder="🍕"
                value={newCustomerFavorite.icon}
                onChange={(e) =>
                  setNewCustomerFavorite({
                    ...newCustomerFavorite,
                    icon: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="editFavoriteOrder">Display Order</Label>
              <Input
                id="editFavoriteOrder"
                type="number"
                placeholder="1"
                value={newCustomerFavorite.order}
                onChange={(e) =>
                  setNewCustomerFavorite({
                    ...newCustomerFavorite,
                    order: parseInt(e.target.value) || 1,
                  })
                }
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingCustomerFavorite(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateCustomerFavorite}>
                <Save className="h-4 w-4 mr-2" />
                Update Favorite
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
