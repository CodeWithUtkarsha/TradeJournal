import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, FileText, AlertCircle, CheckCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { tradeService } from "@/lib/tradeService";

interface ImportResult {
  success: boolean;
  imported: number;
  errors: string[];
  duplicates: number;
}

export function TradeImport() {
  const [dragActive, setDragActive] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const importMutation = useMutation({
    mutationFn: (file: File) => tradeService.importTrades(file),
    onSuccess: (result) => {
      setImportResult(result);
      // Invalidate trades query to refresh the dashboard
      queryClient.invalidateQueries({ queryKey: ['trades'] });
    },
    onError: (error: any) => {
      setImportResult({
        success: false,
        imported: 0,
        errors: [error.message || 'Import failed'],
        duplicates: 0
      });
    }
  });

  const handleFileSelect = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setImportResult({
        success: false,
        imported: 0,
        errors: ['Please select a CSV file'],
        duplicates: 0
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setImportResult({
        success: false,
        imported: 0,
        errors: ['File size must be less than 10MB'],
        duplicates: 0
      });
      return;
    }

    setImportResult(null);
    importMutation.mutate(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const downloadTemplate = () => {
    // Create CSV template
    const csvTemplate = `Symbol,Type,Entry Price,Exit Price,Quantity,Lot Size,Entry Time,Exit Time,P&L,Notes,Strategy
EURUSD,Long,1.0850,1.0920,10000,0.10,2025-01-10 08:30:00,2025-01-10 09:15:00,70.00,Good ECB news,News Trading
GBPJPY,Short,195.50,194.80,5000,0.05,2025-01-09 14:20:00,2025-01-09 15:45:00,35.00,Resistance held,Support/Resistance`;

    const blob = new Blob([csvTemplate], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'trade_import_template.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Import XM Broker Trades
        </CardTitle>
        <CardDescription>
          Upload your XM broker trade history as a CSV file to import all your real trading data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Template Download */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="text-sm">Need help formatting your data?</span>
          </div>
          <Button variant="outline" size="sm" onClick={downloadTemplate}>
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
        </div>

        {/* File Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-muted-foreground/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">
            {dragActive ? 'Drop your CSV file here' : 'Upload Trade History'}
          </h3>
          <p className="text-muted-foreground mb-4">
            Drag and drop your XM broker CSV export, or click to browse
          </p>
          <Button 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()}
            disabled={importMutation.isPending}
          >
            {importMutation.isPending ? 'Importing...' : 'Choose File'}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
          />
        </div>

        {/* Import Progress */}
        {importMutation.isPending && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Processing trades...</span>
              <span>Please wait</span>
            </div>
            <Progress value={undefined} className="w-full" />
          </div>
        )}

        {/* Import Results */}
        {importResult && (
          <Alert className={importResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            {importResult.success ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription>
              {importResult.success ? (
                <div className="space-y-1">
                  <p className="font-medium text-green-800">Import Successful!</p>
                  <p className="text-green-700">
                    ✅ {importResult.imported} trades imported successfully
                    {importResult.duplicates > 0 && (
                      <span className="block">⚠️ {importResult.duplicates} duplicates skipped</span>
                    )}
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="font-medium text-red-800">Import Failed</p>
                  <ul className="text-red-700">
                    {importResult.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Instructions */}
        <div className="text-sm text-muted-foreground space-y-2">
          <h4 className="font-medium">How to export from XM:</h4>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>Log in to your XM client portal</li>
            <li>Go to "Account History" or "Trade History"</li>
            <li>Select your date range</li>
            <li>Click "Export" and choose CSV format</li>
            <li>Upload the downloaded file here</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
