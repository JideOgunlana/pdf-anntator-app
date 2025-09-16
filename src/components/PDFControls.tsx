import React from 'react';
import type { PDFControlsProps } from '../types/pdf';

type ExtendedPDFControlsProps = PDFControlsProps & {
  onAddTextBox?: () => void;
};

const PDFControls: React.FC<ExtendedPDFControlsProps> = ({
  numPages,
  pageNumber,
  onPageChange,
  scale,
  onScaleChange,
  onAddTextBox,
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

      {/* Page navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button onClick={handlePrevPage} disabled={pageNumber <= 1}>←</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <input
            type="number"
            value={pageNumber}
            onChange={handlePageInputChange}
            min={1}
            max={numPages}
          />
          <span>of {numPages}</span>
        </div>
        <button onClick={handleNextPage} disabled={pageNumber >= numPages}>→</button>
      </div>

      {/* Zoom + Text Tool */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}> 
        <select value={scale} onChange={handleScaleChange}>
          <option value={1.0}>100%</option>
          <option value={1.25}>125%</option>
          <option value={1.5}>150%</option>
          <option value={2.0}>200%</option>
        </select>

        <button 
          onClick={onAddTextBox} 
          style={{
            padding: '6px 10px',
            border: '1px solid #333',
            borderRadius: '4px',
            backgroundColor: '#333',
            cursor: 'pointer'
          }}
        >
          Add Text
        </button>
      </div>
    </div>
  );
};

export default PDFControls;
