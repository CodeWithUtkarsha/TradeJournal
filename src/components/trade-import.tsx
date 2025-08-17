import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tradeService } from '@/lib/tradeService';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface TradeImportProps {
  onImportComplete?: () => void;
}

export default function TradeImport({ onImportComplete }: TradeImportProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const importMutation = useMutation({
    mutationFn: (file: File) => tradeService.importTrades(file),
    onSuccess: (result) => {
      toast({
        title: "Import Successful",
        description: `Successfully imported ${result.imported || 0} trades from your XM broker data.`,
      });
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      queryClient.invalidateQueries({ queryKey: ['performanceMetrics'] });
      setSelectedFile(null);
      // Close the modal if callback provided
      if (onImportComplete) {
        onImportComplete();
      }
    },
    onError: (error: any) => {
      toast({
        title: "Import Failed",
        description: error.message || "Failed to import trades. Please check your CSV format.",
        variant: "destructive",
      });
    },
  });

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
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setSelectedFile(file);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please select a CSV file.",
          variant: "destructive",
        });
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setSelectedFile(file);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please select a CSV file.",
          variant: "destructive",
        });
      }
    }
  };

  const handleImport = () => {
    if (selectedFile) {
      importMutation.mutate(selectedFile);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5" />
          Import XM Broker Trades
        </CardTitle>
        <CardDescription>
          Upload your XM broker trading history CSV file to import all your trades automatically.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>How to export from XM:</strong> Go to your XM trading platform → Account History → Select date range → Export as CSV
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <Label htmlFor="csv-upload">Upload CSV File</Label>
          
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : selectedFile
                ? "border-green-500 bg-green-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="space-y-2">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto" />
                <p className="text-sm font-medium text-green-700">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-green-600">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Drag and drop your CSV file here, or
                  </p>
                  <Input
                    id="csv-upload"
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Label
                    htmlFor="csv-upload"
                    className="inline-flex items-center px-4 py-2 mt-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-300 rounded-md cursor-pointer hover:bg-blue-100"
                  >
                    Choose file
                  </Label>
                </div>
                <p className="text-xs text-gray-500">
                  CSV files only, up to 10MB
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            <p className="font-medium mb-2">Expected CSV Format:</p>
            <div className="bg-gray-50 p-3 rounded text-xs font-mono">
              Date, Symbol, Action, Volume, Price, S/L, T/P, Profit, Comment
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleImport}
              disabled={!selectedFile || importMutation.isPending}
              className="flex-1"
            >
              {importMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Import Trades
                </>
              )}
            </Button>
            
            {selectedFile && (
              <Button
                variant="outline"
                onClick={() => setSelectedFile(null)}
                disabled={importMutation.isPending}
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Your trades will be automatically validated and duplicates will be filtered out based on timestamp and order ID.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}