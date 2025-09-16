import React, { useState, useCallback, act } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { PDFViewerProps, LoadSuccessParams } from '../types/pdf';
import PDFControls from './PDFControls';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min?url';
import { Rnd, RndResizeCallback, RndDragCallback } from "react-rnd";
import './pdfViewer.css';



// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

type TextBox = {
  id: number;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  active?: boolean;
};


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

    const [textBoxes, setTextBoxes] = useState<TextBox[]>([]);
  
    const addTextBox = () => {
      setTextBoxes((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: "Edit text",
          x: 50,
          y: 50,
          width: 150,
          height: 40,
          active: true
        },
      ]);
    };
  
    const updateTextBox = (id: number, updates: Partial<TextBox>) => {
      setTextBoxes((prev) =>
        prev.map((box) => (box.id === id ? { ...box, ...updates } : box))
      );
    };
  
    const handleDragStop: (id: number) => RndDragCallback =
      (id) => (_e, d) => {
        updateTextBox(id, { x: d.x, y: d.y });
      };
  
    const handleResizeStop: (id: number) => RndResizeCallback =
      (id) => (_e, _dir, ref, _delta, pos) => {
        updateTextBox(id, {
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height),
          x: pos.x,
          y: pos.y,
        });
      };

      const handleBoxActive = (id: number) => {
        setTextBoxes((prev) =>
          prev.map((box) => (box.id === id ? { ...box, active: true } : { ...box, active: false }))
        );
        console.log(textBoxes)
      }

      const handleBoxInactive = (id: number) => {
          //if some box is active, deactivate all
          setTextBoxes((prev) =>
            prev.map((box) => ( box.id === id ? { ...box, active: false } : box))
          );
          console.log("Inactive", textBoxes)
      }

      
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
      overflow: 'hidden',
      position: 'relative'
    }}>
      {numPages > 0 && (
        <PDFControls
          numPages={numPages}
          pageNumber={pageNumber}
          onPageChange={handlePageChange}
          scale={scale}
          onScaleChange={handleScaleChange}
          onAddTextBox={addTextBox}
        />
      )}
      
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        backgroundColor: '#f9f9f9',
        overflow: 'auto'
      }}
      >
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
            />
          )}
          
          {textBoxes.map((box) => (
            <Rnd
              key={box.id}
              size={{ width: box.width, height: box.height }}
              position={{ x: box.x, y: box.y }}
              onDragStop={handleDragStop(box.id)}
              onResizeStop={handleResizeStop(box.id)}
              bounds="parent"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "2px",
                backgroundColor: "transparent",
                position: "absolute",
                zIndex: 1,
              }}
              onMouseLeave={() => handleBoxInactive(box.id)}
            >
              <input
                type="text"
                value={box.text}
                onChange={(e) =>
                  updateTextBox(box.id, { text: e.target.value })
                }
                onMouseDown={() => handleBoxActive(box.id)}
                className={`${box.active ? 'rnd-box-active' : 'rnd-box'}`}
                style={
                  {
                    width: '100%',
                    height: '60%',
                    // border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontSize: '14px',
                    color: '#333',
                  }
                }
              />
            </Rnd>
          ))}
        </Document>

        
      </div>
    </div>
  );
};

export default PDFViewer;