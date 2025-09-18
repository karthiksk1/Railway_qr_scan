import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Wrench, AlertTriangle } from "lucide-react";

interface Installation {
  id: number;
  uid: string;
  partName: string;
  qrCode?: string;
  partSubType: string;
  address: string;
  dateOfCommencement: string;
  timestamp: Date;
  photo?: string;
}

const Installations = () => {
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstallations = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/installations");
        if (!response.ok) {
          throw new Error("Failed to fetch installations");
        }
        const data = await response.json();
        setInstallations(data);
      } catch (err: any) {
        setError("Could not load installation data.");
        console.error("Error fetching installations:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstallations();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchInstallations();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []); // Empty dependency array is correct here

  if (isLoading) {
    return <div>Loading installations...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-destructive">
        <AlertTriangle className="mx-auto h-12 w-12" />
        <h2 className="mt-4 text-xl font-semibold">Error</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Installations</h1>
        <p className="text-muted-foreground">
          A log of all installed railway components.
        </p>
      </div>

      <Card className="shadow-rail-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wrench className="h-5 w-5 mr-2 text-primary" />
            Installed Parts
          </CardTitle>
          <CardDescription>
            {installations.length} parts currently recorded as installed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>UID</TableHead>
                  <TableHead>QR Code</TableHead>
                  <TableHead>Part Name</TableHead>
                  <TableHead>Sub-Type</TableHead>
                  <TableHead>Location/Address</TableHead>
                  <TableHead>Commencement Date</TableHead>
                  <TableHead>Logged At</TableHead>
                  <TableHead>Photo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {installations.length > 0 ? (
                  installations.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono font-medium">{item.uid}</TableCell>
                      <TableCell className="font-mono">{item.qrCode || 'N/A'}</TableCell>
                      <TableCell>{item.partName}</TableCell>
                      <TableCell>{item.partSubType || 'N/A'}</TableCell>
                      <TableCell>{item.address}</TableCell>
                      <TableCell>{item.dateOfCommencement}</TableCell>
                      <TableCell>{new Date(item.timestamp).toLocaleString()}</TableCell>
                      <TableCell>
                        {item.photo ? (
                          <a href={`/${item.photo}`} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                            View
                          </a>
                        ) : (
                          'No'
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No installations found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Installations;