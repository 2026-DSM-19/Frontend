export interface AnalyzeReportRequest {
  address: string;
}

export interface ReportFile {
  blob: Blob;
  fileName: string;
}

export interface ReportRequestOptions {
  signal?: AbortSignal;
}
