import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  QrCode, 
  Search, 
  Package, 
  MapPin, 
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";

const QRScan = () => {
  const [scannedUID, setScannedUID] = useState("");
  const [partData, setPartData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async () => {
    if (!scannedUID.trim()) return;
    
    setIsLoading(true);
    setPartData(null);
    setError(null);

    try {
      const response = await fetch(`/api/parts/${scannedUID.trim()}`);
      if (response.ok) {
        const data = await response.json();
        setPartData(data);
      } else if (response.status === 404) {
        setPartData(null);
        setError(`No part found with UID: ${scannedUID}`);
      } else {
        throw new Error(`Failed to fetch part data. Status: ${response.status}`);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while fetching part data.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'installed': return 'bg-accent text-accent-foreground';
      case 'in storage': return 'bg-steel text-primary-foreground';
      case 'needs replacement': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'installed': return CheckCircle;
      case 'in storage': return Package;
      case 'needs replacement': return AlertCircle;
      default: return Clock;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-foreground">QR Code Scanner</h1>
        <p className="text-muted-foreground">
          Scan or enter a part UID to view detailed information
        </p>
      </div>

      {/* Scanner Input */}
      <Card className="shadow-rail-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <QrCode className="h-5 w-5 mr-2 text-primary" />
            Scan QR Code
          </CardTitle>
          <CardDescription>
            Enter the part UID or use camera to scan QR code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="uid">Part UID</Label>
              <Input
                id="uid"
                value={scannedUID}
                onChange={(e) => setScannedUID(e.target.value)}
                placeholder="Enter part UID (e.g., RC001, PD045)"
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleScan}
                disabled={!scannedUID.trim() || isLoading}
                variant="hero"
              >
                {isLoading ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Scan
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            <p>
              <strong>To test:</strong> First, add a new part from the Dashboard's "Scan New Part" button, then enter its UID here.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Part Details */}
      {partData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Information */}
          <Card className="shadow-rail-sm lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Package className="h-5 w-5 mr-2 text-primary" />
                  Part Information
                </span>
                <Badge className={getStatusColor(partData.status)}>
                  {partData.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">UID</Label>
                  <p className="text-sm font-mono">{partData.uid}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                  <p className="text-sm">{partData.type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Manufacturer</Label>
                  <p className="text-sm">{partData.manufacturer}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Batch No.</Label>
                  <p className="text-sm font-mono">{partData.batch}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Mfg Date</Label>
                  <p className="text-sm flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {partData.mfgDate}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Warranty Until</Label>
                  <p className="text-sm flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {partData.warranty}
                  </p>
                </div>
              </div>

              {/* Specifications */}
              <div className="border-t pt-4">
                <Label className="text-sm font-medium text-muted-foreground">Specifications</Label>
                <div className="mt-2 space-y-2">
                  {Object.entries(partData.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="font-medium">{value as string}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location & Installation */}
          <Card className="shadow-rail-sm lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                Location & Installation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {partData.sleeper ? (
                <>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Current Location</Label>
                    <p className="text-sm mt-1">{partData.sleeper?.location || 'N/A'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Sleeper UID</Label>
                      <p className="text-sm font-mono">{partData.sleeper?.uid || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Sleeper Batch</Label>
                      <p className="text-sm font-mono">{partData.sleeper?.batch || 'N/A'}</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Part is currently in storage</p>
                </div>
              )}

              {/* Installation History */}
              {partData.installHistory && partData.installHistory.length > 0 && (
                <div className="border-t pt-4">
                  <Label className="text-sm font-medium text-muted-foreground">Installation History</Label>
                  <div className="mt-2 space-y-3">
                    {partData.installHistory.map((event: any, index: number) => (
                      <div key={index} className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{event.reason}</span>
                          <span className="text-xs text-muted-foreground">{event.date}</span>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          <p className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {event.installer}
                          </p>
                          <p className="flex items-center mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {event.location}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {error && !isLoading && (
        <Card className="shadow-rail-sm border-destructive/20">
          <CardContent className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Scan Error</h3>
            <p className="text-muted-foreground">
              {error}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QRScan;