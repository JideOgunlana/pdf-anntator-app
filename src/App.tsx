import React, { useState } from 'react';
import PDFViewer from './components/PDFViewer';
import FileUpload from './components/FileUpload';
import type { LoadSuccessParams } from './types/pdf';
import './App.css';

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pdfInfo, setPdfInfo] = useState<LoadSuccessParams | null>(null);

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    if (!file) {
      setPdfInfo(null);
    }
  };

  const handlePDFLoadSuccess = (pdf: LoadSuccessParams) => {
    setPdfInfo(pdf);
    console.log('PDF loaded successfully:', pdf);
  };

  const handlePDFLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
    setPdfInfo(null);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPdfInfo(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>PDF Viewer</h1>
        <p>Upload and view PDF documents</p>
      </header>

      <main className="app-main">
        {!selectedFile ? (
          <FileUpload 
            onFileSelect={handleFileSelect}
            className="file-upload-section"
          />
        ) : (
          <div className="pdf-section">
            <div className="file-info">
              <div className="file-details">
                <strong>File:</strong> {selectedFile.name} 
                ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                {pdfInfo && (
                  <span style={{ marginLeft: '20px' }}>
                    <strong>Pages:</strong> {pdfInfo.numPages}
                  </span>
                )}
              </div>
              <button 
                onClick={clearFile}
                className="clear-button"
              >
                Upload Different File
              </button>
            </div>
            
            <PDFViewer
              file={selectedFile}
              onLoadSuccess={handlePDFLoadSuccess}
              onLoadError={handlePDFLoadError}
              className="pdf-viewer-container"
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;