import React from 'react';
import type { PDFControlsProps } from '../types/pdf';

const PDFControls: React.FC<PDFControlsProps> = ({
  numPages,
  pageNumber,
  onPageChange,
  scale,
  onScaleChange,
  className = ''
}) => {
  const handlePrevPage = () => {
    if (pageNumber > 1) {
      onPageChange(pageNumber - 1);
    }
  };

  const handleNextPage = () => {
    if (pageNumber < numPages) {
      onPageChange(pageNumber + 1);
    }
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = parseInt(e.target.value, 10);
    if (!isNaN(page) && page >= 1 && page <= numPages) {
      onPageChange(page);
    }
  };

  const handleZoomIn = () => {
    onScaleChange(Math.min(scale + 0.1, 3.0));
  };

  const handleZoomOut = () => {
    onScaleChange(Math.max(scale - 0.1, 0.5));
  };

  const handleScaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onScaleChange(parseFloat(e.target.value));
  };

  return (
    <div className={`pdf-controls ${className}`} style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px',
      borderBottom: '1px solid #ccc',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button 
          onClick={handlePrevPage} 
          disabled={pageNumber <= 1}
          style={{
            padding: '8px 12px',
            border: '1px solid #ccc',
            backgroundColor: 'white',
            cursor: pageNumber <= 1 ? 'not-allowed' : 'pointer',
            borderRadius: '4px'
          }}
        >
          ←
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <input
            type="number"
            value={pageNumber}
            onChange={handlePageInputChange}
            min={1}
            max={numPages}
            style={{
              width: '60px',
              padding: '4px',
              textAlign: 'center',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <span>of {numPages}</span>
        </div>

        <button 
          onClick={handleNextPage} 
          disabled={pageNumber >= numPages}
          style={{
            padding: '8px 12px',
            border: '1px solid #ccc',
            backgroundColor: 'white',
            cursor: pageNumber >= numPages ? 'not-allowed' : 'pointer',
            borderRadius: '4px'
          }}
        >
          →
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button 
          onClick={handleZoomOut}
          style={{
            padding: '8px 12px',
            border: '1px solid #ccc',
            backgroundColor: 'white',
            cursor: 'pointer',
            borderRadius: '4px'
          }}
        >
          -
        </button>
        
        <select 
          value={scale} 
          onChange={handleScaleChange}
          style={{
            padding: '4px 8px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        >
          <option value={0.5}>50%</option>
          <option value={0.75}>75%</option>
          <option value={1.0}>100%</option>
          <option value={1.25}>125%</option>
          <option value={1.5}>150%</option>
          <option value={2.0}>200%</option>
        </select>

        <button 
          onClick={handleZoomIn}
          style={{
            padding: '8px 12px',
            border: '1px solid #ccc',
            backgroundColor: 'white',
            cursor: 'pointer',
            borderRadius: '4px'
          }}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default PDFControls;