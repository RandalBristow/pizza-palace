import { useState } from "react";
import ActivationBadge from "../shared_components/ActivationBadge";
import { Star } from "lucide-react";
import CustomerFavoriteDialog from "../dialog_components/CustomerFavoriteDialog"; // Adjust path as needed
import AddButton from "../shared_components/AddButton";
import EditButton from "../shared_components/EditButton";
import DeleteButton from "../shared_components/DeleteButton";
import ActivationButton from "../shared_components/ActivationButton";

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
  updateCustomerFavorite: (
    id: string,
    updates: Omit<CustomerFavorite, "id">,
  ) => Promise<any>;
  deleteCustomerFavorite: (id: string) => Promise<void>;
}

export default function CustomerFavoriteForm({
  customerFavorites,
  createCustomerFavorite,
  updateCustomerFavorite,
  deleteCustomerFavorite,
}: CustomerFavoriteFormProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingFavorite, setEditingFavorite] =
    useState<CustomerFavorite | null>(null);

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
    const favorite = customerFavorites.find((f) => f.id === id);
    if (!favorite) return;
    await updateCustomerFavorite(id, {
      ...favorite,
      isActive: !favorite.isActive,
    });
  };

  return (
    <div className="space-y-6" style={{ backgroundColor: "var(--background)" }}>
      <div className="flex justify-between items-center">
        <h2
          className="text-xl font-semibold"
          style={{ color: "var(--foreground)" }}
        >
          Customer Favorites
        </h2>
        <AddButton label="Add Favorite" onClick={() => setIsAdding(true)} />
      </div>

      {customerFavorites.length === 0 ? (
        <div className="text-center py-8">
          <Star
            className="h-12 w-12 mx-auto mb-4"
            style={{ color: "var(--muted-foreground)" }}
          />
          <p style={{ color: "var(--muted-foreground)" }}>
            No customer favorites yet.
          </p>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            Add favorite items to showcase on the homepage.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {customerFavorites.map((favorite) => (
            <div
              key={favorite.id}
              className="rounded-lg p-4"
              style={{ border: "1px solid var(--border)" }}
            >
              <div className="text-2xl mb-2">{favorite.icon}</div>
              <div className="flex items-center justify-start gap-2">
                <h3
                  className="font-semibold mb-0"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {favorite.title}
                </h3>
                <ActivationBadge isActive={favorite.isActive} />
              </div>
              <p
                className="text-sm line-clamp-2 mb-2"
                style={{ color: "var(--muted-foreground)" }}
              >
                {favorite.description}
              </p>
              <div className="flex justify-end items-center gap-2">
                <ActivationButton
                  isActive={favorite.isActive}
                  onToggle={() => toggleStatus(favorite.id)}
                />
                <EditButton onClick={() => setEditingFavorite(favorite)} />
                <DeleteButton
                  entityTitle="Favorite"
                  subjectName={favorite.title}
                  onConfirm={() => handleDelete(favorite.id)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

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
