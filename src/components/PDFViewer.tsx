import React, { useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { PDFViewerProps, LoadSuccessParams } from '../types/pdf';
import PDFControls from './PDFControls';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min?url';


// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

const PDFViewer: React.FC<PDFViewerProps> = ({
  file,
  className = '',
  onLoadSuccess,
  onLoadError
}) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoadSuccess = useCallback((pdf: LoadSuccessParams) => {
    setNumPages(pdf.numPages);
    setPageNumber(1);
    setLoading(false);
    setError(null);
    onLoadSuccess?.(pdf);
  }, [onLoadSuccess]);

  const handleLoadError = useCallback((error: Error) => {
    setError(error.message);
    setLoading(false);
    onLoadError?.(error);
  }, [onLoadError]);

  const handleLoadStart = useCallback(() => {
    setLoading(true);
    setError(null);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setPageNumber(page);
  }, []);

  const handleScaleChange = useCallback((newScale: number) => {
    setScale(newScale);
  }, []);

  if (!file) {
    return (
      <div className={`pdf-viewer ${className}`} style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '400px',
        border: '2px dashed #ccc',
        borderRadius: '8px',
        color: '#666',
        fontSize: '16px'
      }}>
        No PDF file selected
      </div>
    );
  }

  return (
    <div className={`pdf-viewer ${className}`} style={{
      border: '1px solid #ccc',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      {numPages > 0 && (
        <PDFControls
          numPages={numPages}
          pageNumber={pageNumber}
          onPageChange={handlePageChange}
          scale={scale}
          onScaleChange={handleScaleChange}
        />
      )}
      
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        backgroundColor: '#f9f9f9',
        overflow: 'auto'
      }}>
        {loading && (
          <div style={{ 
            color: '#666', 
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              border: '2px solid #ccc',
              borderTop: '2px solid #333',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            Loading PDF...
          </div>
        )}
        
        {error && (
          <div style={{ 
            color: '#d32f2f', 
            fontSize: '16px',
            textAlign: 'center',
            padding: '20px'
          }}>
            Error loading PDF: {error}
          </div>
        )}

        <Document
          file={file}
          onLoadSuccess={handleLoadSuccess}
          onLoadError={handleLoadError}
          onLoadStart={handleLoadStart}
          loading=""
          error=""
        >
          {!loading && !error && numPages > 0 && (
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            //   style={{
            //     boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            //     margin: '20px'
            //   }}
            />
          )}
        </Document>
      </div>

      <style >{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PDFViewer;