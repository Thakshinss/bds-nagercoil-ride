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
import { FareForm } from '@/components/FareForm';
import { TourPackageForm } from '@/components/TourPackageForm';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const [fares, setFares] = useState<FareData[]>([]);
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [editingFare, setEditingFare] = useState<FareData | null>(null);
  const [editingPackage, setEditingPackage] = useState<TourPackage | null>(null);
  const [showFareForm, setShowFareForm] = useState(false);
  const [showPackageForm, setShowPackageForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadFares();
    loadPackages();
  }, []);

  const loadFares = async () => {
    const fareData = await fareDataService.getAllFares();
    setFares(fareData);
  };

  const loadPackages = async () => {
    const packageData = await tourPackageService.getAllPackages();
    setPackages(packageData);
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

  return (
    <div className="min-h-screen bg-background py-12">
      <Helmet>
        <title>Admin - Fare Management | BDS Cabs</title>
        <meta name="description" content="Admin panel for managing taxi fares and pricing" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Content Management <span className="text-primary">Admin</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage taxi fares and tour packages for BDS Cabs
          </p>
        </div>

        <Tabs defaultValue="fares" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="fares">Fare Management</TabsTrigger>
            <TabsTrigger value="packages">Tour Packages</TabsTrigger>
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
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;