import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ShieldCheck, ShieldOff } from 'lucide-react';

type WarrantyStatus = 'Active' | 'Expiring Soon' | 'Expired';

interface WarrantyStatusBadgeProps {
  status: WarrantyStatus;
  daysRemaining: number | null;
}

export const WarrantyStatusBadge = ({ status, daysRemaining }: WarrantyStatusBadgeProps) => {
  switch (status) {
    case 'Expiring Soon':
      return (
        <Badge variant="warning" className="flex items-center gap-1.5">
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>Expiring in {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}</span>
        </Badge>
      );
    case 'Expired':
      return (
        <Badge variant="destructive" className="flex items-center gap-1.5">
          <ShieldOff className="h-3.5 w-3.5" />
          Expired
        </Badge>
      );
    default:
      return (
        <Badge variant="success" className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" />
          Active
        </Badge>
      );
  }
};