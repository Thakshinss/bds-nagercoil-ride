import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { FareForm } from '@/components/FareForm';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const [fares, setFares] = useState<FareData[]>([]);
  const [editingFare, setEditingFare] = useState<FareData | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadFares();
  }, []);

  const loadFares = () => {
    const fareData = fareDataService.getAllFares();
    setFares(fareData);
  };

  const handleAddFare = (fareData: Omit<FareData, 'id'>) => {
    fareDataService.addFare(fareData);
    loadFares();
    setShowForm(false);
    toast({
      title: "Success",
      description: "Fare added successfully",
    });
  };

  const handleUpdateFare = (fareData: Omit<FareData, 'id'>) => {
    if (editingFare) {
      fareDataService.updateFare(editingFare.id, fareData);
      loadFares();
      setEditingFare(null);
      setShowForm(false);
      toast({
        title: "Success",
        description: "Fare updated successfully",
      });
    }
  };

  const handleDeleteFare = (id: string) => {
    if (confirm('Are you sure you want to delete this fare?')) {
      fareDataService.deleteFare(id);
      loadFares();
      toast({
        title: "Success",
        description: "Fare deleted successfully",
      });
    }
  };

  const handleEditFare = (fare: FareData) => {
    setEditingFare(fare);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setEditingFare(null);
    setShowForm(false);
  };

  const handleNewFare = () => {
    setEditingFare(null);
    setShowForm(true);
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
            Fare Management <span className="text-primary">Admin</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage taxi fares and pricing for BDS Cabs
          </p>
        </div>

        {/* Add New Fare Button */}
        {!showForm && (
          <div className="mb-6">
            <Button onClick={handleNewFare} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Fare
            </Button>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="mb-8">
            <FareForm
              fare={editingFare || undefined}
              onSubmit={editingFare ? handleUpdateFare : handleAddFare}
              onCancel={handleCancelForm}
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
      </div>
    </div>
  );
};

export default Admin;