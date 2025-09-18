import { useState, useEffect, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { addYears, differenceInDays, parseISO, format } from 'date-fns';
import { WarrantyStatusBadge } from '@/components/WarrantyStatusBadge';

interface Installation {
  id: number;
  uid: string;
  partName: string;
  partSubType: string;
  address: string;
  dateOfCommencement: string;
  warranty: string;
}

type WarrantyStatus = 'Active' | 'Expiring Soon' | 'Expired';

const getWarrantyStatus = (commencementDate: string, warranty: string): { status: WarrantyStatus; daysRemaining: number | null; expiryDate: Date | null } => {
  if (!commencementDate || !warranty) {
    return { status: 'Active', daysRemaining: null, expiryDate: null };
  }

  const warrantyYears = parseInt(warranty.match(/\d+/)?.[0] || '0', 10);
  if (isNaN(warrantyYears)) {
    return { status: 'Active', daysRemaining: null, expiryDate: null };
  }

  try {
    const startDate = parseISO(commencementDate);
    if (isNaN(startDate.getTime())) throw new Error('Invalid date');
    const expiryDate = addYears(startDate, warrantyYears);
    const now = new Date();
    const daysRemaining = differenceInDays(expiryDate, now);

    if (daysRemaining < 0) {
      return { status: 'Expired', daysRemaining, expiryDate };
    }
    if (daysRemaining <= 30) {
      return { status: 'Expiring Soon', daysRemaining, expiryDate };
    }
    return { status: 'Active', daysRemaining, expiryDate };
  } catch (e) {
    console.error("Error parsing date for warranty status:", e);
    return { status: 'Active', daysRemaining: null, expiryDate: null };
  }
};

const Inventory = () => {
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstallations = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/installations');
        if (!response.ok) {
          throw new Error('Failed to fetch inventory data.');
        }
        const data = await response.json();
        setInstallations(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstallations();
  }, []);

  const partsForReview = useMemo(() => {
    return installations
      .map(item => ({
        ...item,
        warrantyInfo: getWarrantyStatus(item.dateOfCommencement, item.warranty),
      }))
      .filter(item => item.warrantyInfo.status === 'Expiring Soon' || item.warrantyInfo.status === 'Expired');
  }, [installations]);

  if (isLoading) {
    return <div>Loading inventory...</div>;
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
      <header>
        <h1 className="text-3xl font-bold text-foreground">Inventory & Warranty Status</h1>
        <p className="text-muted-foreground">
          A list of installed parts with expiring or expired warranties.
        </p>
      </header>

      <Card className="shadow-rail-sm">
        <CardHeader>
          <CardTitle>Warranty Alerts</CardTitle>
          <CardDescription>
            Showing parts that are expiring within 30 days or have already expired.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Part UID</TableHead>
                  <TableHead>Part Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Commencement Date</TableHead>
                  <TableHead>Warranty Expiry</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partsForReview.length > 0 ? (
                  partsForReview.map((item) => {
                    const { status, daysRemaining, expiryDate } = item.warrantyInfo;
                    return (
                      <TableRow key={item.id} className={status === 'Expiring Soon' ? 'bg-warning/10' : status === 'Expired' ? 'bg-destructive/10' : ''}>
                        <TableCell className="font-mono">{item.uid}</TableCell>
                        <TableCell>
                          <div className="font-medium">{item.partName}</div>
                          <div className="text-sm text-muted-foreground">{item.partSubType}</div>
                        </TableCell>
                        <TableCell>{item.address}</TableCell>
                        <TableCell>{item.dateOfCommencement ? format(parseISO(item.dateOfCommencement), 'PPP') : 'N/A'}</TableCell>
                        <TableCell>{expiryDate ? format(expiryDate, 'PPP') : 'N/A'}</TableCell>
                        <TableCell className="text-center">
                          <WarrantyStatusBadge status={status} daysRemaining={daysRemaining} />
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No parts require warranty review at this time.
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

export default Inventory;