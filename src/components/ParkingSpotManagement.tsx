import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Clock, Car, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ParkingSpot {
  parkingSpotID: number;
  spotType: string;
  status: 'Occupied' | 'Available' | 'Reserved' | 'Maintenance';
  parkID: number;
  parkName: string;
  licensePlate?: string;
  startTime?: string;
  endTime?: string;
}

interface NewParkingSpotForm {
  spotType: string;
  status: string;
  parkID: string;
  licensePlate: string;
  startTime: string;
  endTime: string;
}

export function ParkingSpotManagement() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  // Mock data
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([
    { parkingSpotID: 1, spotType: "Standard", status: "Occupied", parkID: 1, parkName: "Main Lot", licensePlate: "ABC-123", startTime: "2024-05-26 08:00", endTime: "2024-05-26 18:00" },
    { parkingSpotID: 2, spotType: "Compact", status: "Available", parkID: 1, parkName: "Main Lot" },
    { parkingSpotID: 3, spotType: "Disabled", status: "Available", parkID: 1, parkName: "Main Lot" },
    { parkingSpotID: 4, spotType: "Standard", status: "Reserved", parkID: 2, parkName: "North Lot", licensePlate: "XYZ-789", startTime: "2024-05-26 14:00", endTime: "2024-05-26 20:00" },
    { parkingSpotID: 5, spotType: "Electric", status: "Maintenance", parkID: 1, parkName: "Main Lot" },
    { parkingSpotID: 6, spotType: "Standard", status: "Occupied", parkID: 2, parkName: "North Lot", licensePlate: "DEF-456", startTime: "2024-05-26 10:30", endTime: "2024-05-26 16:30" },
  ]);

  const [newSpotForm, setNewSpotForm] = useState<NewParkingSpotForm>({
    spotType: "",
    status: "",
    parkID: "",
    licensePlate: "",
    startTime: "",
    endTime: "",
  });

  // Mock parking lots for the dropdown
  const parkingLots = [
    { parkID: 1, parkName: "Main Lot" },
    { parkID: 2, parkName: "North Lot" },
    { parkID: 3, parkName: "South Lot" },
  ];

  const handleAddParkingSpot = () => {
    console.log('Adding new parking spot:', newSpotForm);
    
    const selectedParkingLot = parkingLots.find(lot => lot.parkID === parseInt(newSpotForm.parkID));
    
    const newSpot: ParkingSpot = {
      parkingSpotID: Math.max(...parkingSpots.map(s => s.parkingSpotID)) + 1,
      spotType: newSpotForm.spotType,
      status: newSpotForm.status as 'Occupied' | 'Available' | 'Reserved' | 'Maintenance',
      parkID: parseInt(newSpotForm.parkID),
      parkName: selectedParkingLot?.parkName || "Unknown",
      licensePlate: newSpotForm.licensePlate || undefined,
      startTime: newSpotForm.startTime || undefined,
      endTime: newSpotForm.endTime || undefined,
    };

    setParkingSpots([...parkingSpots, newSpot]);
    setIsAddDialogOpen(false);
    setNewSpotForm({
      spotType: "",
      status: "",
      parkID: "",
      licensePlate: "",
      startTime: "",
      endTime: "",
    });

    toast({
      title: "Parking Spot Added",
      description: `New ${newSpotForm.spotType} parking spot has been created successfully.`,
    });
  };

  const handleReserveSpot = (spotId: number) => {
    console.log('Reserve spot clicked:', spotId);
    setParkingSpots(spots => spots.map(spot => 
      spot.parkingSpotID === spotId 
        ? { ...spot, status: 'Reserved' as const, licensePlate: "TEMP-123", startTime: new Date().toISOString(), endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString() }
        : spot
    ));
    toast({
      title: "Spot Reserved",
      description: `Parking spot #${spotId} has been reserved successfully.`,
    });
  };

  const handleEndSession = (spotId: number) => {
    console.log('End session clicked:', spotId);
    setParkingSpots(spots => spots.map(spot => 
      spot.parkingSpotID === spotId 
        ? { ...spot, status: 'Available' as const, licensePlate: undefined, startTime: undefined, endTime: undefined }
        : spot
    ));
    toast({
      title: "Session Ended",
      description: `Parking session for spot #${spotId} has been ended.`,
    });
  };

  const handleMarkAvailable = (spotId: number) => {
    console.log('Mark available clicked:', spotId);
    setParkingSpots(spots => spots.map(spot => 
      spot.parkingSpotID === spotId 
        ? { ...spot, status: 'Available' as const }
        : spot
    ));
    toast({
      title: "Spot Available",
      description: `Parking spot #${spotId} is now available.`,
    });
  };

  const filteredSpots = parkingSpots.filter(spot => {
    const matchesStatus = filterStatus === "all" || spot.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesType = filterType === "all" || spot.spotType.toLowerCase() === filterType.toLowerCase();
    return matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Occupied': return 'bg-red-100 text-red-800';
      case 'Available': return 'bg-green-100 text-green-800';
      case 'Reserved': return 'bg-yellow-100 text-yellow-800';
      case 'Maintenance': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSpotTypeColor = (type: string) => {
    switch (type) {
      case 'Standard': return 'bg-blue-100 text-blue-800';
      case 'Compact': return 'bg-purple-100 text-purple-800';
      case 'Disabled': return 'bg-indigo-100 text-indigo-800';
      case 'Electric': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const occupancyStats = {
    total: parkingSpots.length,
    occupied: parkingSpots.filter(s => s.status === 'Occupied').length,
    available: parkingSpots.filter(s => s.status === 'Available').length,
    reserved: parkingSpots.filter(s => s.status === 'Reserved').length,
    maintenance: parkingSpots.filter(s => s.status === 'Maintenance').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Parking Spot Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Parking Spot
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Parking Spot</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="spotType">Spot Type</Label>
                <Select value={newSpotForm.spotType} onValueChange={(value) => setNewSpotForm({...newSpotForm, spotType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select spot type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Compact">Compact</SelectItem>
                    <SelectItem value="Disabled">Disabled</SelectItem>
                    <SelectItem value="Electric">Electric</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={newSpotForm.status} onValueChange={(value) => setNewSpotForm({...newSpotForm, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Occupied">Occupied</SelectItem>
                    <SelectItem value="Reserved">Reserved</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="parkID">Parking Lot</Label>
                <Select value={newSpotForm.parkID} onValueChange={(value) => setNewSpotForm({...newSpotForm, parkID: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select parking lot" />
                  </SelectTrigger>
                  <SelectContent>
                    {parkingLots.map((lot) => (
                      <SelectItem key={lot.parkID} value={lot.parkID.toString()}>
                        {lot.parkName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="licensePlate">License Plate (Optional)</Label>
                <Input
                  id="licensePlate"
                  placeholder="ABC-123"
                  value={newSpotForm.licensePlate}
                  onChange={(e) => setNewSpotForm({...newSpotForm, licensePlate: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time (Optional)</Label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    value={newSpotForm.startTime}
                    onChange={(e) => setNewSpotForm({...newSpotForm, startTime: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time (Optional)</Label>
                  <Input
                    id="endTime"
                    type="datetime-local"
                    value={newSpotForm.endTime}
                    onChange={(e) => setNewSpotForm({...newSpotForm, endTime: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddParkingSpot}
                  disabled={!newSpotForm.spotType || !newSpotForm.status || !newSpotForm.parkID}
                >
                  Add Parking Spot
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{occupancyStats.total}</div>
              <p className="text-sm text-gray-600">Total Spots</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{occupancyStats.occupied}</div>
              <p className="text-sm text-gray-600">Occupied</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{occupancyStats.available}</div>
              <p className="text-sm text-gray-600">Available</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{occupancyStats.reserved}</div>
              <p className="text-sm text-gray-600">Reserved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{occupancyStats.maintenance}</div>
              <p className="text-sm text-gray-600">Maintenance</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="compact">Compact</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
                <SelectItem value="electric">Electric</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Parking Spots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSpots.map((spot) => (
          <Card key={spot.parkingSpotID} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold">Spot #{spot.parkingSpotID}</span>
                  </div>
                  <Badge className={getStatusColor(spot.status)}>
                    {spot.status}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Type:</span>
                    <Badge className={getSpotTypeColor(spot.spotType)}>
                      {spot.spotType}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Location:</span>
                    <span className="text-sm font-medium">{spot.parkName}</span>
                  </div>
                </div>

                {spot.licensePlate && (
                  <div className="border-t pt-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-gray-600" />
                      <span className="font-medium">{spot.licensePlate}</span>
                    </div>
                    {spot.startTime && spot.endTime && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>
                          {new Date(spot.startTime).toLocaleTimeString()} - {new Date(spot.endTime).toLocaleTimeString()}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  {spot.status === 'Available' && (
                    <Button size="sm" className="flex-1" onClick={() => handleReserveSpot(spot.parkingSpotID)}>Reserve</Button>
                  )}
                  {spot.status === 'Occupied' && (
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEndSession(spot.parkingSpotID)}>End Session</Button>
                  )}
                  {spot.status === 'Maintenance' && (
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => handleMarkAvailable(spot.parkingSpotID)}>Mark Available</Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSpots.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500">No parking spots found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
