import { useState } from "react";
import { Button } from "@/components/ui/button";
import StatsCard from "@/components/dashboard/StatsCard";
import AISummaryModal from "@/pages/AISummaryModal";
import { toast } from "sonner";
import { Users, ScanLine, AlertTriangle, CheckCircle } from "lucide-react";
import QRScannerModal from "@/components/dashboard/QRScannerModal";

const DashboardPage = () => {
  const [isScannerOpen, setScannerOpen] = useState(false);
  const [summaryData, setSummaryData] = useState<{ id: number; title: string; content: string; photo?: string } | null>(null);

  const handleScanComplete = (scannedData: string, photo?: File) => {
    console.log("Scanned Data:", scannedData);
    if (photo) {
      console.log("Attached Photo:", photo.name);
    }
    setScannerOpen(false); // Close the modal after scan

    const promise = (async () => {
      const formData = new FormData();
      formData.append("qrData", scannedData);
      if (photo) {
        formData.append("photo", photo);
      }

      const response = await fetch("/api/scan-report", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate report.');
      }

      const result = await response.json();

      // Set data to show in modal
      setSummaryData({
          title: `AI Summary for ${scannedData}`,
          content: result.summary,
          photo: result.photo,
          id: result.id
      });

      return result;
    })();

    toast.promise(promise, {
      loading: 'Saving scan & generating AI report...',
      success: (data) => {
        return `AI report generated for: ${scannedData}`;
      },
      error: (err) => err.message || 'An error occurred during processing.',
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">An overview of your rail scan activity.</p>
        </div>
        <Button onClick={() => setScannerOpen(true)} className="mt-4 sm:mt-0">
          <ScanLine className="mr-2 h-4 w-4" />
          Scan QR Code
        </Button>
      </header>

      {/* Responsive Grid for Stats Cards */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Scans" value="12,405" icon={ScanLine} trend={{ value: 20.1, isPositive: true }} />
        <StatsCard title="Unique Assets" value="2,350" icon={Users} description="+180 this month" />
        <StatsCard title="Anomalies Detected" value="123" icon={AlertTriangle} trend={{ value: 5.2, isPositive: false }} />
        <StatsCard title="Inspections Passed" value="98.7%" icon={CheckCircle} trend={{ value: 1.2, isPositive: true }} />
      </div>

      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setScannerOpen(false)}
        onScanComplete={handleScanComplete}
      />

      {summaryData && (
        <AISummaryModal
          isOpen={!!summaryData}
          onClose={() => setSummaryData(null)}
          title={summaryData.title}
          content={summaryData.content}
          reportId={summaryData.id}
          photo={summaryData.photo}
        />
      )}
    </div>
  );
};

export default DashboardPage;
