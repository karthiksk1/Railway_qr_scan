import { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QrCode, Download } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { PART_TYPES, PART_SUBTYPES } from "@/parts";
import { toast } from "sonner";
import { qrGeneratorSchema, QRGeneratorFormValues } from "@/lib/validations";

const QRGenerator = () => {
  const form = useForm<QRGeneratorFormValues>({
    resolver: zodResolver(qrGeneratorSchema),
    defaultValues: {
      partName: "",
      partSubType: "",
      materialNumber: "",
      vendorLotNumber: "",
      dateOfSupply: "",
      warrantyPeriod: "",
    },
  });

  const [qrValue, setQrValue] = useState("");
  const qrCodeRef = useRef<HTMLDivElement>(null);

  const partName = form.watch("partName");

  useEffect(() => {
    if (partName) {
      form.setValue("partSubType", "");
    }
  }, [partName, form.setValue]);

  const onSubmit = (formData: QRGeneratorFormValues) => {
    const dataToEncode = JSON.stringify(formData);
    setQrValue(dataToEncode);
    toast.success("QR Code generated successfully!");
  };

  const handleDownload = () => {
    if (qrCodeRef.current) {
      const canvas = qrCodeRef.current.querySelector("canvas");
      if (canvas) {
        const pngUrl = canvas
          .toDataURL("image/png")
          .replace("image/png", "image/octet-stream");
        let downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        const { partName, materialNumber } = form.getValues();
        const fileName = partName.replace(/\s/g, '_') || 'qrcode';
        downloadLink.download = `${fileName}_${materialNumber}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    }
  };

  const subTypes = PART_SUBTYPES[partName] || [];
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-foreground">QR Code Generator</h1>
        <p className="text-muted-foreground">
          Create QR codes for new railway components.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-rail-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <QrCode className="h-5 w-5 mr-2 text-primary" />
              Part Details
            </CardTitle>
            <CardDescription>
              Fill in the details to generate a unique QR code for the part.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Controller
                control={form.control}
                name="partName"
                render={({ field, fieldState }) => (
                  <div className="space-y-2">
                    <Label htmlFor="partName">Part Name</Label>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger><SelectValue placeholder="Select a part" /></SelectTrigger>
                      <SelectContent>{PART_TYPES.map(part => <SelectItem key={part} value={part}>{part}</SelectItem>)}</SelectContent>
                    </Select>
                    {fieldState.error && <p className="text-sm text-destructive mt-1">{fieldState.error.message}</p>}
                  </div>
                )}
              />

              {subTypes.length > 0 && (
                <Controller
                  control={form.control}
                  name="partSubType"
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label htmlFor="partSubType">{partName} Type</Label>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger><SelectValue placeholder={`Select ${partName.toLowerCase()} type`} /></SelectTrigger>
                        <SelectContent>{subTypes.map(subType => <SelectItem key={subType} value={subType}>{subType}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  )}
                />
              )}

              <div className="space-y-2">
                <Label htmlFor="materialNumber">Material Number</Label>
                <Input id="materialNumber" {...form.register("materialNumber")} placeholder="e.g., MAT-12345" />
                {form.formState.errors.materialNumber && <p className="text-sm text-destructive mt-1">{form.formState.errors.materialNumber.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="vendorLotNumber">Vendor Lot Number</Label>
                <Input id="vendorLotNumber" {...form.register("vendorLotNumber")} placeholder="e.g., V-LOT-67890" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfSupply">Date of Supply</Label>
                <Input id="dateOfSupply" type="date" {...form.register("dateOfSupply")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="warrantyPeriod">Warranty Period</Label>
                <Input id="warrantyPeriod" {...form.register("warrantyPeriod")} placeholder="e.g., 5 Years" />
              </div>

              <Button type="submit" variant="hero" className="w-full" disabled={form.formState.isSubmitting}>Generate QR Code</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-rail-sm flex flex-col items-center justify-center">
          <CardHeader><CardTitle>Generated QR Code</CardTitle></CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center gap-4">
            {qrValue ? (
              <div ref={qrCodeRef} className="p-4 bg-white rounded-lg">
                <QRCodeCanvas value={qrValue} size={256} level={"H"} includeMargin={true} />
              </div>
            ) : (
              <div className="w-64 h-64 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground text-center">QR code will appear here</p>
              </div>
            )}
            <Button onClick={handleDownload} disabled={!qrValue} className="w-full max-w-xs">
              <Download className="mr-2 h-4 w-4" />
              Download QR Code
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QRGenerator;