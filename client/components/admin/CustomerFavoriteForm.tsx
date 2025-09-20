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
    <div className="space-y-6" style={{ backgroundColor: 'var(--background)' }}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>Customer Favorites</h2>
        <Button 
          onClick={() => setIsAdding(true)}
          style={{
            backgroundColor: 'var(--primary)',
            color: 'var(--primary-foreground)',
            borderColor: 'var(--primary)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            const target = e.target as HTMLElement;
            target.style.transform = 'translateY(-1px)';
            target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            const target = e.target as HTMLElement;
            target.style.transform = 'translateY(0)';
            target.style.boxShadow = 'none';
          }}
        >
          <Plus className="h-4 w-4 mr-2" style={{ color: 'var(--primary-foreground)' }} />
          Add Favorite
        </Button>
      </div>

      <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
        <p className="mb-4" style={{ color: 'var(--muted-foreground)' }}>
          Manage customer favorite items displayed on the homepage.
        </p>

        {customerFavorites.length === 0 ? (
          <div className="text-center py-8">
            <Star className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--muted-foreground)' }} />
            <p style={{ color: 'var(--muted-foreground)' }}>No customer favorites yet.</p>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Add favorite items to showcase on the homepage.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customerFavorites.map((favorite) => (
              <div key={favorite.id} className="rounded-lg p-4" style={{ border: '1px solid var(--border)' }}>
                <div className="text-2xl mb-2">{favorite.icon}</div>
                <h3 className="font-semibold" style={{ color: 'var(--muted-foreground)' }}>{favorite.title}</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{favorite.description}</p>
                <div className="mt-2 flex justify-between items-center">
                  <Badge
                    style={{
                      backgroundColor: favorite.isActive ? '#bbf7d0' : '#fecaca',
                      color: favorite.isActive ? '#14532d' : '#991b1b',
                      border: '1px solid var(--border)'
                    }}
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
                            style={{
                              backgroundColor: 'var(--card)',
                              borderColor: 'var(--border)',
                              color: 'var(--muted-foreground)',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              const target = e.target as HTMLElement;
                              target.style.backgroundColor = 'var(--accent)';
                              target.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                              const target = e.target as HTMLElement;
                              target.style.backgroundColor = 'var(--card)';
                              target.style.transform = 'scale(1)';
                            }}
                          >
                            {favorite.isActive ? (
                              <ThumbsUp className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
                            ) : (
                              <ThumbsDown className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent style={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)' }}>
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
                            style={{
                              backgroundColor: 'var(--card)',
                              borderColor: 'var(--border)',
                              color: 'var(--muted-foreground)',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              const target = e.target as HTMLElement;
                              target.style.backgroundColor = 'var(--accent)';
                              target.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                              const target = e.target as HTMLElement;
                              target.style.backgroundColor = 'var(--card)';
                              target.style.transform = 'scale(1)';
                            }}
                          >
                            <Edit className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent style={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)' }}>Edit Favorite</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(favorite.id)}
                            style={{
                              backgroundColor: 'var(--card)',
                              borderColor: 'var(--border)',
                              color: 'var(--muted-foreground)',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              const target = e.target as HTMLElement;
                              target.style.backgroundColor = 'var(--accent)';
                              target.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                              const target = e.target as HTMLElement;
                              target.style.backgroundColor = 'var(--card)';
                              target.style.transform = 'scale(1)';
                            }}
                          >
                            <Trash2 className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent style={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)' }}>Delete Favorite</TooltipContent>
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