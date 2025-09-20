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
      <DialogContent style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <DialogHeader>
          <DialogTitle style={{ color: 'var(--card-foreground)' }}>
            {isEdit ? "Edit Customer Favorite" : "Add Customer Favorite"}
          </DialogTitle>
          <DialogDescription style={{ color: 'var(--muted-foreground)' }}>
            {isEdit
              ? "Update the customer favorite details."
              : "Add a new customer favorite item for the homepage."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="favoriteTitle" style={{ color: 'var(--foreground)' }}>Title</Label>
            <Input
              id="favoriteTitle"
              placeholder="e.g., Fresh Ingredients"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              style={{
                backgroundColor: 'var(--input)',
                borderColor: 'var(--border)',
                border: '1px solid var(--border)',
                color: 'var(--foreground)',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.boxShadow = `0 0 0 2px var(--ring)`;
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          <div>
            <Label htmlFor="favoriteDescription" style={{ color: 'var(--foreground)' }}>Description</Label>
            <Textarea
              id="favoriteDescription"
              placeholder="Description of this favorite"
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              style={{
                backgroundColor: 'var(--input)',
                borderColor: 'var(--border)',
                border: '1px solid var(--border)',
                color: 'var(--foreground)',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.boxShadow = `0 0 0 2px var(--ring)`;
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          <div>
            <Label htmlFor="favoriteIcon" style={{ color: 'var(--foreground)' }}>Icon (Emoji)</Label>
            <Input
              id="favoriteIcon"
              placeholder="🍕"
              value={formData.icon}
              onChange={(e) =>
                setFormData({ ...formData, icon: e.target.value })
              }
              style={{
                backgroundColor: 'var(--input)',
                borderColor: 'var(--border)',
                border: '1px solid var(--border)',
                color: 'var(--foreground)',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.boxShadow = `0 0 0 2px var(--ring)`;
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          <div>
            <Label htmlFor="favoriteOrder" style={{ color: 'var(--foreground)' }}>Display Order</Label>
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
              style={{
                backgroundColor: 'var(--input)',
                borderColor: 'var(--border)',
                border: '1px solid var(--border)',
                color: 'var(--foreground)',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.boxShadow = `0 0 0 2px var(--ring)`;
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              style={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
                color: 'var(--muted-foreground)',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLElement;
                target.style.backgroundColor = 'var(--accent)';
                target.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLElement;
                target.style.backgroundColor = 'var(--card)';
                target.style.transform = 'scale(1)';
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formData.title || !formData.icon}
              style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)',
                borderColor: 'var(--primary)',
                cursor: (!formData.title || !formData.icon) ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  const target = e.target as HTMLElement;
                  target.style.transform = 'translateY(-1px)';
                  target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLElement;
                target.style.transform = 'translateY(0)';
                target.style.boxShadow = 'none';
              }}
            >
              <Save className="h-4 w-4 mr-2" style={{ color: 'var(--primary-foreground)' }} />
              {isEdit ? "Update Favorite" : "Save Favorite"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}