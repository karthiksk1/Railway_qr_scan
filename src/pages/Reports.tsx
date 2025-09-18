import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BrainCircuit, AlertTriangle, FileText } from "lucide-react";
import { toast } from "sonner";
import AISummaryModal from "./AISummaryModal";

interface Report {
  id: number;
  qrData: string;
  summary: string;
  photo?: string;
  timestamp: string;
}

interface SummaryData {
  id: number;
  title: string;
  content: string;
  photo?: string;
}

const Reports = () => {
  const [uid, setUid] = useState("");
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);

  const fetchReports = async () => {
    try {
      const response = await fetch("/api/reports");
      if (!response.ok) throw new Error("Failed to fetch reports.");
      const data = await response.json();
      setReports(data);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchReports().finally(() => setIsLoading(false));
  }, []);

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid.trim()) {
      toast.error("Please enter a Part UID.");
      return;
    }
    setIsGenerating(true);

    const promise = (async () => {
      const response = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: uid.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate report.');
      }
      return await response.json();
    })();

    toast.promise(promise, {
      loading: 'Generating AI report...',
      success: (data) => {
        setSummaryData(data);
        fetchReports(); // Refresh the list of reports
        setUid(""); // Clear input
        return `AI report generated for: ${uid.trim()}`;
      },
      error: (err) => err.message || 'An error occurred during processing.',
      finally: () => setIsGenerating(false),
    });
  };

  const handleViewReport = (report: Report) => {
    setSummaryData({
      id: report.id,
      title: `AI Summary for ${report.qrData}`,
      content: report.summary,
      photo: report.photo,
    });
  };

  if (isLoading) return <div>Loading reports...</div>;

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
        <h1 className="text-3xl font-bold text-foreground">Reports</h1>
        <p className="text-muted-foreground">Generate and view AI-powered summaries for installed parts.</p>
      </div>

          <Card className="shadow-rail-sm">
            <CardHeader>
              <CardTitle className="flex items-center"><BrainCircuit className="h-5 w-5 mr-2 text-primary" />Generate New Report</CardTitle>
              <CardDescription>Enter the UID of an installed part to generate an AI summary report.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerateReport} className="flex space-x-4">
                <div className="flex-1"><Label htmlFor="uid" className="sr-only">Part UID</Label><Input id="uid" value={uid} onChange={(e) => setUid(e.target.value)} placeholder="Enter Part UID (e.g., ERC-0001)" /></div>
                <Button type="submit" disabled={isGenerating} variant="hero">{isGenerating ? 'Generating...' : 'Generate Report'}</Button>
              </form>
            </CardContent>
          </Card>

          <Card className="shadow-rail-sm">
            <CardHeader>
              <CardTitle className="flex items-center"><FileText className="h-5 w-5 mr-2 text-primary" />Generated Reports</CardTitle>
              <CardDescription>A log of all previously generated reports.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader><TableRow><TableHead>Report ID</TableHead><TableHead>Part UID</TableHead><TableHead>Generated At</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {reports.length > 0 ? (
                      reports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.id}</TableCell>
                          <TableCell className="font-mono">{report.qrData}</TableCell>
                          <TableCell>{new Date(report.timestamp).toLocaleString()}</TableCell>
                          <TableCell className="text-right"><Button variant="outline" size="sm" onClick={() => handleViewReport(report)}>View Summary</Button></TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow><TableCell colSpan={4} className="h-24 text-center">No reports generated yet.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {summaryData && (
            <AISummaryModal isOpen={!!summaryData} onClose={() => setSummaryData(null)} title={summaryData.title} content={summaryData.content} reportId={summaryData.id} photo={summaryData.photo} />
          )}
    </div>
  );
};

export default Reports;