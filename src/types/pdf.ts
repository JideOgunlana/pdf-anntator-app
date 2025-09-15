export interface PDFViewerProps {
  file: File | string | null;
  className?: string;
  onLoadSuccess?: (pdf: any) => void;
  onLoadError?: (error: Error) => void;
}

export interface PDFPageProps {
  pageNumber: number;
  width?: number;
  scale?: number;
  className?: string;
}

export interface PDFControlsProps {
  numPages: number;
  pageNumber: number;
  onPageChange: (page: number) => void;
  scale: number;
  onScaleChange: (scale: number) => void;
  className?: string;
}

export interface PDFDocument {
  numPages: number;
}

export interface LoadSuccessParams {
  numPages: number;
}