import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { BannerContent } from "@/services/bannerContentData";

interface BannerContentFormProps {
  bannerContent?: BannerContent;
  onSubmit: (bannerContent: Omit<BannerContent, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

const BannerContentForm: React.FC<BannerContentFormProps> = ({ bannerContent, onSubmit, onCancel }) => {
  const [text, setText] = useState(bannerContent?.text || '');
  const [isActive, setIsActive] = useState(bannerContent?.is_active ?? true);
  const [displayOrder, setDisplayOrder] = useState(bannerContent?.display_order || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      text,
      is_active: isActive,
      display_order: displayOrder,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="text">Banner Text</Label>
        <Input
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter banner text"
          required
        />
      </div>

      <div>
        <Label htmlFor="displayOrder">Display Order</Label>
        <Input
          id="displayOrder"
          type="number"
          value={displayOrder}
          onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
          placeholder="Display order (0 = first)"
          min="0"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={isActive}
          onCheckedChange={setIsActive}
        />
        <Label htmlFor="isActive">Active</Label>
      </div>

      <div className="flex space-x-2">
        <Button type="submit">
          {bannerContent ? 'Update' : 'Add'} Banner Content
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default BannerContentForm;