import { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Edit, Trash2, ThumbsUp, ThumbsDown, Plus, Star } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import CustomerFavoriteDialog from "../dialog_components/CustomerFavoriteDialog"; // Adjust path as needed

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
  createCustomerFavorite: (data: Omit<CustomerFavorite, "id">) => Promise<any>;
  updateCustomerFavorite: (id: string, updates: Omit<CustomerFavorite, "id">) => Promise<any>;
  deleteCustomerFavorite: (id: string) => Promise<void>;
}

export default function CustomerFavoriteForm({
  customerFavorites,
  createCustomerFavorite,
  updateCustomerFavorite,
  deleteCustomerFavorite,
}: CustomerFavoriteFormProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingFavorite, setEditingFavorite] = useState<CustomerFavorite | null>(null);

  const handleAdd = async (data: Omit<CustomerFavorite, "id">) => {
    await createCustomerFavorite(data);
    setIsAdding(false);
  };

  const handleUpdate = async (data: Omit<CustomerFavorite, "id">) => {
    if (editingFavorite) {
      await updateCustomerFavorite(editingFavorite.id, data);
      setEditingFavorite(null);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteCustomerFavorite(id);
  };

  const toggleStatus = async (id: string) => {
    const favorite = customerFavorites.find(f => f.id === id);
    if (!favorite) return;
    await updateCustomerFavorite(id, { ...favorite, isActive: !favorite.isActive });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Customer Favorites</h2>
        <Button onClick={() => setIsAdding(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Favorite
        </Button>
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
                <p className="text-sm text-gray-600">{favorite.description}</p>
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
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleStatus(favorite.id)}
                          >
                            {favorite.isActive ? (
                              <ThumbsUp className="h-4 w-4" />
                            ) : (
                              <ThumbsDown className="h-4 w-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {favorite.isActive ? "Deactivate" : "Activate"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingFavorite(favorite)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit Favorite</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(favorite.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete Favorite</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <CustomerFavoriteDialog
        isOpen={isAdding}
        onClose={() => setIsAdding(false)}
        onSave={handleAdd}
      />

      <CustomerFavoriteDialog
        isOpen={editingFavorite !== null}
        onClose={() => setEditingFavorite(null)}
        favorite={editingFavorite}
        onSave={handleUpdate}
      />
    </div>
  );
}