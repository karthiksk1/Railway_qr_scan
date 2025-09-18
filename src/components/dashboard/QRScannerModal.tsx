import { useState, useCallback, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Scanner, IDetectedBarcode } from '@yudiel/react-qr-scanner';
import { Camera, QrCode, Save } from "lucide-react";
import { PART_TYPES, PART_SUBTYPES } from "@/parts";
import { installationSchema, InstallationFormValues } from "@/lib/validations";

type UserRole = 'admin' | 'inspector' | 'vendor';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: InstallationFormValues) => void;
  userRole: UserRole;
}

const QRScannerModal = ({ isOpen, onClose, onSave, userRole }: QRScannerModalProps) => {
  const [view, setView] = useState<'scanner' | 'data' | 'form'>('scanner');
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<Record<string, any> | null>(null);
  const [photo, setPhoto] = useState<File | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<InstallationFormValues>({
    resolver: zodResolver(installationSchema),
    defaultValues: {
      qrCode: "",
      partName: "",
      partSubType: "",
      manufacturerNumber: "",
      batch: "",
      vendorNumber: "",
      warranty: "",
      address: "",
      dateOfSupply: "",
      dateOfCommencement: "",
    },
  });

  const partName = form.watch("partName");

  useEffect(() => {
    if (!isOpen) {
      form.reset();
      setView('scanner');
      setError(null);
      setParsedData(null);
      setPhoto(undefined);
    }
  }, [isOpen, form.reset]);

  const handleScan = useCallback((result: IDetectedBarcode[]) => {
    if (result && result.length > 0) {
      const rawValue = result[0].rawValue;
      form.reset(); // Clear previous form data
      form.setValue("qrCode", rawValue);
      setParsedData(null);

      try {
        const parsed = JSON.parse(rawValue);
        setParsedData(parsed); // Store for display

        // Pre-fill form if it's a recognized format
        if (parsed.partName && (parsed.materialNumber || parsed.manufacturerNumber)) {
          form.setValue("partName", parsed.partName || "");
          form.setValue("partSubType", parsed.partSubType || "");
          form.setValue("manufacturerNumber", parsed.materialNumber || parsed.manufacturerNumber || "");
          form.setValue("vendorNumber", parsed.vendorLotNumber || parsed.vendorNumber || "");
          form.setValue("dateOfSupply", parsed.dateOfSupply || "");
          form.setValue("warranty", parsed.warrantyPeriod || parsed.warranty || "");
        }
      } catch (e) {
        console.log("Scanned QR code is not in JSON format, using raw value.");
        setParsedData({ qrCodeValue: rawValue }); // Show raw value if not JSON
      }

      setError(null);
      setView('data');
    }
  }, [form.reset, form.setValue]);

  const handleManualEntry = useCallback(() => {
    form.reset();
    setView('form');
  }, [form.reset]);

  const handleError = useCallback((error: Error | string) => {
    if (typeof error === 'object' && error.name === 'NotFoundException') {
      return;
    }
    console.error("QR Scanner Error:", error);
    setError("Could not scan QR code. Check camera permissions.");
  }, []);

  const onSubmit = (data: InstallationFormValues) => {
    onSave({ ...data, photo });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setPhoto(event.target.files[0]);
    }
  };

  const subTypes = PART_SUBTYPES[partName] || [];

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {view === 'scanner' ? (
          <>
            <DialogHeader>
              <DialogTitle>Scan QR Code</DialogTitle>
              <DialogDescription className="flex items-center">
                <QrCode className="h-4 w-4 mr-2 text-primary" />
                Point your camera at a QR code to capture part information.
              </DialogDescription>
            </DialogHeader>
            <div className="my-4 p-4 border rounded-md bg-muted/40">
              {isOpen && (
                <Scanner
                  onScan={handleScan}
                  onError={handleError}
                  constraints={{ facingMode: "environment" }}
                />
              )}
              {error && <p className="text-sm text-destructive mt-2">{error}</p>}
            </div>
            <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-between">
              <Button variant="ghost" onClick={handleManualEntry}>
                Or Enter Manually
              </Button>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
            </DialogFooter>
          </>
        ) : view === 'data' ? (
          <>
            <DialogHeader>
              <DialogTitle>Scanned QR Code Data</DialogTitle>
              <DialogDescription>
                Review the data extracted from the QR code.
              </DialogDescription>
            </DialogHeader>
            <div className="my-4 p-4 border rounded-md bg-muted/40 max-h-[60vh] overflow-y-auto">
              {parsedData ? (
                <ul className="space-y-2 text-sm">
                  {Object.entries(parsedData).map(([key, value]) => (
                    <li key={key} className="flex justify-between items-start gap-4">
                      <span className="capitalize text-muted-foreground break-words">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="font-medium text-right break-all">{String(value) || 'N/A'}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No data to display.</p>
              )}
            </div>
            <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setView('scanner')}>Scan Again</Button>
              {userRole !== 'inspector' && (
                <Button type="button" onClick={() => setView('form')}>Proceed to Installation</Button>
              )}
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Add Installation Details</DialogTitle>
              <DialogDescription>
                Confirm the details for the scanned part and add installation information.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="qrCode" className="text-right">QR Code</Label>
                  <Input id="qrCode" {...form.register("qrCode")} className="col-span-3" readOnly placeholder="(from scanner, if any)" />
                </div>

                <Controller
                  control={form.control}
                  name="partName"
                  render={({ field, fieldState }) => (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="partName" className="text-right">Part Name</Label>
                      <div className="col-span-3">
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger><SelectValue placeholder="Select a part" /></SelectTrigger>
                          <SelectContent>{PART_TYPES.map(part => <SelectItem key={part} value={part}>{part}</SelectItem>)}</SelectContent>
                        </Select>
                        {fieldState.error && <p className="text-sm text-destructive mt-1">{fieldState.error.message}</p>}
                      </div>
                    </div>
                  )}
                />

                {subTypes.length > 0 && (
                  <Controller
                    control={form.control}
                    name="partSubType"
                    render={({ field }) => (
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="partSubType" className="text-right">{partName} Type</Label>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="col-span-3"><SelectValue placeholder={`Select ${partName.toLowerCase()} type`} /></SelectTrigger>
                          <SelectContent>{subTypes.map(subType => <SelectItem key={subType} value={subType}>{subType}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                    )}
                  />
                )}

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="manufacturerNumber" className="text-right">Manuf. No.</Label>
                  <div className="col-span-3">
                    <Input id="manufacturerNumber" {...form.register("manufacturerNumber")} placeholder="e.g., MN-12345" />
                    {form.formState.errors.manufacturerNumber && <p className="text-sm text-destructive mt-1">{form.formState.errors.manufacturerNumber.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="batch" className="text-right">Batch No.</Label>
                  <div className="col-span-3">
                    <Input id="batch" {...form.register("batch")} placeholder="e.g., B-2024-001" />
                    {form.formState.errors.batch && <p className="text-sm text-destructive mt-1">{form.formState.errors.batch.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="vendorNumber" className="text-right">Vendor No.</Label>
                  <Input id="vendorNumber" {...form.register("vendorNumber")} className="col-span-3" placeholder="e.g., VN-67890" />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="warranty" className="text-right">Warranty</Label>
                  <Input id="warranty" {...form.register("warranty")} className="col-span-3" placeholder="e.g., 2 Years" />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">Address</Label>
                  <div className="col-span-3">
                    <Input id="address" {...form.register("address")} placeholder="e.g., Track Section A-12" />
                    {form.formState.errors.address && <p className="text-sm text-destructive mt-1">{form.formState.errors.address.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dateOfSupply" className="text-right">Supply Date</Label>
                  <Input id="dateOfSupply" type="date" {...form.register("dateOfSupply")} className="col-span-3" />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dateOfCommencement" className="text-right">Comm. Date</Label>
                  <div className="col-span-3">
                    <Input id="dateOfCommencement" type="date" {...form.register("dateOfCommencement")} />
                    {form.formState.errors.dateOfCommencement && <p className="text-sm text-destructive mt-1">{form.formState.errors.dateOfCommencement.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="photo-upload" className="text-right">Photo</Label>
                  <div className="col-span-3">
                    <Input id="photo-upload" type="file" accept="image/*" ref={fileInputRef} onChange={handlePhotoChange} className="hidden" />
                    <Button type="button" variant="outline" className="w-full justify-start" onClick={() => fileInputRef.current?.click()}>
                      <Camera className="h-4 w-4 mr-2" />
                      {photo ? photo.name : "Choose a file..."}
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setView('scanner')}>Scan Again</Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Save Installation
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QRScannerModal;
