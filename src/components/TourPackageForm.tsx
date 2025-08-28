import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TourPackage } from '@/services/tourPackageData';
import { X, Plus } from 'lucide-react';

interface TourPackageFormProps {
  package?: TourPackage;
  onSubmit: (pkg: Omit<TourPackage, 'id'>) => void;
  onCancel: () => void;
}

export const TourPackageForm = ({ package: pkg, onSubmit, onCancel }: TourPackageFormProps) => {
  const [formData, setFormData] = useState({
    title: pkg?.title || '',
    description: pkg?.description || '',
    price: pkg?.price || '',
    image: pkg?.image || '',
    highlights: pkg?.highlights || [''],
    inclusions: pkg?.inclusions || [''],
  });

  useEffect(() => {
    if (pkg) {
      setFormData({
        title: pkg.title,
        description: pkg.description,
        price: pkg.price,
        image: pkg.image,
        highlights: pkg.highlights.length ? pkg.highlights : [''],
        inclusions: pkg.inclusions.length ? pkg.inclusions : [''],
      });
    }
  }, [pkg]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredHighlights = formData.highlights.filter(h => h.trim() !== '');
    const filteredInclusions = formData.inclusions.filter(i => i.trim() !== '');
    
    if (formData.title && formData.description && formData.price) {
      onSubmit({
        ...formData,
        highlights: filteredHighlights,
        inclusions: filteredInclusions,
      });
      if (!pkg) {
        setFormData({
          title: '',
          description: '',
          price: '',
          image: '',
          highlights: [''],
          inclusions: [''],
        });
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: 'highlights' | 'inclusions', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'highlights' | 'inclusions') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'highlights' | 'inclusions', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{pkg ? 'Edit Tour Package' : 'Add New Tour Package'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Package Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Tour package title"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Package description"
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="₹4,500"
              required
            />
          </div>

          <div>
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => handleInputChange('image', e.target.value)}
              placeholder="Image URL"
            />
          </div>

          {/* Highlights */}
          <div>
            <Label>Package Highlights</Label>
            <div className="space-y-2">
              {formData.highlights.map((highlight, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={highlight}
                    onChange={(e) => handleArrayChange('highlights', index, e.target.value)}
                    placeholder="Package highlight"
                  />
                  {formData.highlights.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('highlights', index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('highlights')}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Highlight
              </Button>
            </div>
          </div>

          {/* Inclusions */}
          <div>
            <Label>Package Inclusions</Label>
            <div className="space-y-2">
              {formData.inclusions.map((inclusion, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={inclusion}
                    onChange={(e) => handleArrayChange('inclusions', index, e.target.value)}
                    placeholder="What's included"
                  />
                  {formData.inclusions.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('inclusions', index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('inclusions')}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Inclusion
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {pkg ? 'Update Package' : 'Add Package'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};