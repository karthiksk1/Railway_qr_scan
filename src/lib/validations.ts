import { z } from "zod";

export const installationSchema = z.object({
  qrCode: z.string().optional(),
  partName: z.string().min(1, "Part Name is required."),
  partSubType: z.string().optional(),
  manufacturerNumber: z.string().min(1, "Manufacturer Number is required."),
  batch: z.string().min(1, "Batch Number is required."),
  vendorNumber: z.string().optional(),
  warranty: z.string().optional(),
  address: z.string().min(1, "Address is required."),
  dateOfSupply: z.string().optional(),
  dateOfCommencement: z.string().min(1, "Date of Commencement is required."),
  photo: z.any().optional(),
});

export type InstallationFormValues = z.infer<typeof installationSchema>;

export const qrGeneratorSchema = z.object({
  partName: z.string().min(1, "Part Name is required."),
  partSubType: z.string().optional(),
  materialNumber: z.string().min(1, "Material Number is required."),
  vendorLotNumber: z.string().optional(),
  dateOfSupply: z.string().optional(),
  warrantyPeriod: z.string().optional(),
});

export type QRGeneratorFormValues = z.infer<typeof qrGeneratorSchema>;