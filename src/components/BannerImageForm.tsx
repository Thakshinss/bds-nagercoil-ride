import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { BannerImage, BannerImageInput } from "@/services/bannerImageData";

interface BannerImageFormProps {
  bannerImage?: BannerImage;
  onSubmit: (banner: BannerImageInput) => void;
  onCancel: () => void;
}

const BannerImageForm: React.FC<BannerImageFormProps> = ({ bannerImage, onSubmit, onCancel }) => {
  const [imageUrl, setImageUrl] = useState(bannerImage?.image_url || '');
  const [altText, setAltText] = useState(bannerImage?.alt_text || 'BDS Cabs banner');
  const [linkUrl, setLinkUrl] = useState(bannerImage?.link_url || '');
  const [isActive, setIsActive] = useState(bannerImage?.is_active ?? true);
  const [displayOrder, setDisplayOrder] = useState(bannerImage?.display_order || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      image_url: imageUrl.trim(),
      alt_text: altText.trim() || 'BDS Cabs banner',
      link_url: linkUrl.trim() || null,
      is_active: isActive,
      display_order: displayOrder,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/banner.jpg"
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          Best results with a wide 16:9 image (e.g. 1600 x 900).
        </p>
      </div>

      {imageUrl && (
        <div className="aspect-video w-full max-w-md overflow-hidden rounded-lg border border-border bg-muted">
          <img src={imageUrl} alt="Banner preview" className="h-full w-full object-cover" />
        </div>
      )}

      <div>
        <Label htmlFor="altText">Alt Text</Label>
        <Input
          id="altText"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          placeholder="Describe the banner"
        />
      </div>

      <div>
        <Label htmlFor="linkUrl">Link URL (optional)</Label>
        <Input
          id="linkUrl"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          placeholder="/tour-packages or https://..."
        />
      </div>

      <div>
        <Label htmlFor="imgDisplayOrder">Display Order</Label>
        <Input
          id="imgDisplayOrder"
          type="number"
          min="0"
          value={displayOrder}
          onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="imgIsActive" checked={isActive} onCheckedChange={setIsActive} />
        <Label htmlFor="imgIsActive">Active</Label>
      </div>

      <div className="flex space-x-2">
        <Button type="submit">{bannerImage ? 'Update' : 'Add'} Banner Image</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
};

export default BannerImageForm;
