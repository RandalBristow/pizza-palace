import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Save } from "lucide-react";

export interface CustomerFavorite {
  id: string;
  title: string;
  description: string;
  icon: string;
  isActive: boolean;
  order: number;
}

interface CustomerFavoriteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  favorite?: CustomerFavorite | null;
  onSave: (data: Omit<CustomerFavorite, "id">) => Promise<void>;
}

export default function CustomerFavoriteDialog({
  isOpen,
  onClose,
  favorite,
  onSave,
}: CustomerFavoriteDialogProps) {
  const [formData, setFormData] = useState<Omit<CustomerFavorite, "id">>({
    title: "",
    description: "",
    icon: "",
    order: 1,
    isActive: true,
  });

  const isEdit = !!favorite;

  useEffect(() => {
    if (favorite) {
      const { title, description, icon, order, isActive } = favorite;
      setFormData({ title, description, icon, order, isActive });
    } else {
      setFormData({
        title: "",
        description: "",
        icon: "",
        order: 1,
        isActive: true,
      });
    }
  }, [favorite]);

  const handleSave = async () => {
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Failed to save customer favorite:", error);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Customer Favorite" : "Add Customer Favorite"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the customer favorite details."
              : "Add a new customer favorite item for the homepage."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="favoriteTitle">Title</Label>
            <Input
              id="favoriteTitle"
              placeholder="e.g., Fresh Ingredients"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="favoriteDescription">Description</Label>
            <Textarea
              id="favoriteDescription"
              placeholder="Description of this favorite"
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="favoriteIcon">Icon (Emoji)</Label>
            <Input
              id="favoriteIcon"
              placeholder="🍕"
              value={formData.icon}
              onChange={(e) =>
                setFormData({ ...formData, icon: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="favoriteOrder">Display Order</Label>
            <Input
              id="favoriteOrder"
              type="number"
              placeholder="1"
              value={formData.order}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  order: parseInt(e.target.value) || 1,
                })
              }
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formData.title || !formData.icon}
            >
              <Save className="h-4 w-4 mr-2" />
              {isEdit ? "Update Favorite" : "Save Favorite"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}