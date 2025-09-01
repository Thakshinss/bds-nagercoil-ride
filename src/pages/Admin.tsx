import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { fareDataService, FareData } from '@/services/fareData';
import { tourPackageService, TourPackage } from '@/services/tourPackageData';
import { bannerContentService, BannerContent } from '@/services/bannerContentData';
import { FareForm } from '@/components/FareForm';
import { TourPackageForm } from '@/components/TourPackageForm';
import BannerContentForm from '@/components/BannerContentForm';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const [fares, setFares] = useState<FareData[]>([]);
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [bannerContent, setBannerContent] = useState<BannerContent[]>([]);
  const [editingFare, setEditingFare] = useState<FareData | null>(null);
  const [editingPackage, setEditingPackage] = useState<TourPackage | null>(null);
  const [editingBannerContent, setEditingBannerContent] = useState<BannerContent | null>(null);
  const [showFareForm, setShowFareForm] = useState(false);
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [isAddingBannerContent, setIsAddingBannerContent] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadFares();
    loadPackages();
    loadBannerContent();
  }, []);

  const loadFares = async () => {
    const fareData = await fareDataService.getAllFares();
    setFares(fareData);
  };

  const loadPackages = async () => {
    const packageData = await tourPackageService.getAllPackages();
    setPackages(packageData);
  };

  const loadBannerContent = async () => {
    try {
      const bannerData = await bannerContentService.getAll();
      setBannerContent(bannerData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load banner content",
        variant: "destructive",
      });
    }
  };

  const handleAddFare = async (fareData: Omit<FareData, 'id'>) => {
    const result = await fareDataService.addFare(fareData);
    if (result) {
      loadFares();
      setShowFareForm(false);
      toast({
        title: "Success",
        description: "Fare added successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to add fare",
        variant: "destructive",
      });
    }
  };

  const handleUpdateFare = async (fareData: Omit<FareData, 'id'>) => {
    if (editingFare) {
      const success = await fareDataService.updateFare(editingFare.id, fareData);
      if (success) {
        loadFares();
        setEditingFare(null);
        setShowFareForm(false);
        toast({
          title: "Success",
          description: "Fare updated successfully",
        });
      } else {
        toast({
          title: "Error", 
          description: "Failed to update fare",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteFare = async (id: string) => {
    if (confirm('Are you sure you want to delete this fare?')) {
      const success = await fareDataService.deleteFare(id);
      if (success) {
        loadFares();
        toast({
          title: "Success",
          description: "Fare deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete fare",
          variant: "destructive",
        });
      }
    }
  };

  const handleEditFare = (fare: FareData) => {
    setEditingFare(fare);
    setShowFareForm(true);
  };

  const handleCancelFareForm = () => {
    setEditingFare(null);
    setShowFareForm(false);
  };

  const handleNewFare = () => {
    setEditingFare(null);
    setShowFareForm(true);
  };

  // Tour Package handlers
  const handleAddPackage = async (packageData: Omit<TourPackage, 'id'>) => {
    const result = await tourPackageService.addPackage(packageData);
    if (result) {
      loadPackages();
      setShowPackageForm(false);
      toast({
        title: "Success",
        description: "Tour package added successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to add tour package",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePackage = async (packageData: Omit<TourPackage, 'id'>) => {
    if (editingPackage) {
      const success = await tourPackageService.updatePackage(editingPackage.id, packageData);
      if (success) {
        loadPackages();
        setEditingPackage(null);
        setShowPackageForm(false);
        toast({
          title: "Success",
          description: "Tour package updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update tour package",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (confirm('Are you sure you want to delete this tour package?')) {
      const success = await tourPackageService.deletePackage(id);
      if (success) {
        loadPackages();
        toast({
          title: "Success",
          description: "Tour package deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete tour package",
          variant: "destructive",
        });
      }
    }
  };

  const handleEditPackage = (pkg: TourPackage) => {
    setEditingPackage(pkg);
    setShowPackageForm(true);
  };

  const handleCancelPackageForm = () => {
    setEditingPackage(null);
    setShowPackageForm(false);
  };

  const handleNewPackage = () => {
    setEditingPackage(null);
    setShowPackageForm(true);
  };

  // Banner Content handlers
  const handleBannerContentAdd = async (newBannerContent: Omit<BannerContent, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const created = await bannerContentService.create(newBannerContent);
      setBannerContent(prev => [...prev, created]);
      setIsAddingBannerContent(false);
      toast({
        title: "Success",
        description: "Banner content added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add banner content",
        variant: "destructive",
      });
    }
  };

  const handleBannerContentUpdate = async (id: string, updatedBannerContent: Omit<BannerContent, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const updated = await bannerContentService.update(id, updatedBannerContent);
      setBannerContent(prev => prev.map(content => content.id === id ? updated : content));
      setEditingBannerContent(null);
      toast({
        title: "Success",
        description: "Banner content updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update banner content",
        variant: "destructive",
      });
    }
  };

  const handleBannerContentDelete = async (id: string) => {
    try {
      await bannerContentService.delete(id);
      setBannerContent(prev => prev.filter(content => content.id !== id));
      toast({
        title: "Success",
        description: "Banner content deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete banner content",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <Helmet>
        <title>Admin - Content Management | BDS Cabs</title>
        <meta name="description" content="Admin panel for managing taxi fares, tour packages and banner content" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Content Management <span className="text-primary">Admin</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage taxi fares, tour packages and banner content for BDS Cabs
          </p>
        </div>

        <Tabs defaultValue="fares" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="fares">Fare Management</TabsTrigger>
            <TabsTrigger value="packages">Tour Packages</TabsTrigger>
            <TabsTrigger value="banner">Banner Content</TabsTrigger>
          </TabsList>

          {/* Fares Tab */}
          <TabsContent value="fares" className="space-y-6">
            {/* Add New Fare Button */}
            {!showFareForm && (
              <div className="mb-6">
                <Button onClick={handleNewFare} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add New Fare
                </Button>
              </div>
            )}

            {/* Fare Form */}
            {showFareForm && (
              <div className="mb-8">
                <FareForm
                  fare={editingFare || undefined}
                  onSubmit={editingFare ? handleUpdateFare : handleAddFare}
                  onCancel={handleCancelFareForm}
                />
              </div>
            )}

            {/* Fares Table */}
            <Card className="shadow-custom-lg">
              <CardHeader>
                <CardTitle className="text-2xl">All Fares ({fares.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold">From</TableHead>
                        <TableHead className="font-semibold">To</TableHead>
                        <TableHead className="font-semibold">Vehicle Type</TableHead>
                        <TableHead className="font-semibold">Price</TableHead>
                        <TableHead className="font-semibold text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fares.map((fare) => (
                        <TableRow key={fare.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{fare.from}</TableCell>
                          <TableCell>{fare.to}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                              {fare.vehicleType}
                            </span>
                          </TableCell>
                          <TableCell className="font-semibold text-primary">
                            {fare.price}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditFare(fare)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteFare(fare.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tour Packages Tab */}
          <TabsContent value="packages" className="space-y-6">
            {/* Add New Package Button */}
            {!showPackageForm && (
              <div className="mb-6">
                <Button onClick={handleNewPackage} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add New Tour Package
                </Button>
              </div>
            )}

            {/* Package Form */}
            {showPackageForm && (
              <div className="mb-8">
                <TourPackageForm
                  package={editingPackage || undefined}
                  onSubmit={editingPackage ? handleUpdatePackage : handleAddPackage}
                  onCancel={handleCancelPackageForm}
                />
              </div>
            )}

            {/* Packages Table */}
            <Card className="shadow-custom-lg">
              <CardHeader>
                <CardTitle className="text-2xl">All Tour Packages ({packages.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold">Title</TableHead>
                        <TableHead className="font-semibold">Description</TableHead>
                        <TableHead className="font-semibold">Price</TableHead>
                        <TableHead className="font-semibold text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {packages.map((pkg) => (
                        <TableRow key={pkg.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{pkg.title}</TableCell>
                          <TableCell className="max-w-xs truncate">{pkg.description}</TableCell>
                          <TableCell className="font-semibold text-primary">
                            {pkg.price}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditPackage(pkg)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeletePackage(pkg.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Banner Content Tab */}
          <TabsContent value="banner" className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Banner Content</h3>
                <Button onClick={() => setIsAddingBannerContent(true)}>
                  Add Banner Content
                </Button>
              </div>

              {isAddingBannerContent && (
                <Card>
                  <CardHeader>
                    <CardTitle>Add Banner Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BannerContentForm
                      onSubmit={handleBannerContentAdd}
                      onCancel={() => setIsAddingBannerContent(false)}
                    />
                  </CardContent>
                </Card>
              )}

              {editingBannerContent && (
                <Card>
                  <CardHeader>
                    <CardTitle>Edit Banner Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BannerContentForm
                      bannerContent={editingBannerContent}
                      onSubmit={(updatedBannerContent) => handleBannerContentUpdate(editingBannerContent.id, updatedBannerContent)}
                      onCancel={() => setEditingBannerContent(null)}
                    />
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-4">
                {bannerContent.map((content) => (
                  <Card key={content.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium">{content.text}</p>
                          <div className="text-sm text-muted-foreground mt-1">
                            Order: {content.display_order} | 
                            Status: {content.is_active ? 'Active' : 'Inactive'}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingBannerContent(content)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleBannerContentDelete(content.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;