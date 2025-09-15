import React, { useRef } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  acceptedFileTypes?: string;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  acceptedFileTypes = '.pdf',
  className = ''
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0] || null;
    if (file && file.type === 'application/pdf') {
      onFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          border: '2px dashed #ccc',
          borderRadius: '8px',
          padding: '40px',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: '#f9f9f9',
          transition: 'border-color 0.3s ease',
          marginBottom: '20px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#007bff';
          e.currentTarget.style.backgroundColor = '#f0f8ff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#ccc';
          e.currentTarget.style.backgroundColor = '#f9f9f9';
        }}
      >
        <div style={{
          fontSize: '48px',
          marginBottom: '16px',
          color: '#666'
        }}>
          📄
        </div>
        <div style={{
          fontSize: '18px',
          fontWeight: 'bold',
          marginBottom: '8px',
          color: '#333'
        }}>
          Click to upload or drag and drop
        </div>
        <div style={{
          fontSize: '14px',
          color: '#666'
        }}>
          PDF files only
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFileTypes}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default FileUpload;