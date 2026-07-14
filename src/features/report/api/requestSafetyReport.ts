import { isRecord } from "../../../shared/utils/isRecord";
import type {
  AnalyzeReportRequest,
  ReportFile,
  ReportRequestOptions,
} from "../types/report";

const ANALYZE_REPORT_URL = "http://127.0.0.1:8000/analyze";

const DEFAULT_REQUEST_ERROR = "보고서 생성 요청에 실패했습니다.";
const CONNECTION_ERROR = "분석 서버에 연결할 수 없습니다.";

function getErrorText(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (!isRecord(value)) return null;

  return (
    getErrorText(value.detail) ??
    getErrorText(value.message) ??
    getErrorText(value.error)
  );
}

function parseJson(value: string): unknown {
  try {
    const parsed: unknown = JSON.parse(value);
    return parsed;
  } catch {
    return null;
  }
}

async function getResponseError(response: Response): Promise<string> {
  const fallback = `${DEFAULT_REQUEST_ERROR} (${String(response.status)})`;
  const responseText = await response.text();

  if (!responseText.trim()) return fallback;

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return getErrorText(parseJson(responseText)) ?? fallback;
  }

  return responseText.length <= 200 ? responseText : fallback;
}

function decodeFileName(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function sanitizeFileName(value: string): string {
  const fileName = value.split(/[\\/]/).at(-1)?.trim() ?? "";
  return fileName.replace(/[<>:"|?*]/g, "-");
}

function getContentDispositionFileName(
  contentDisposition: string | null,
): string | null {
  if (!contentDisposition) return null;

  const utf8FileName = /filename\*=UTF-8''([^;]+)/i.exec(
    contentDisposition,
  )?.[1];
  if (utf8FileName) {
    const decodedFileName = sanitizeFileName(decodeFileName(utf8FileName));
    if (decodedFileName) return decodedFileName;
  }

  const quotedFileName = /filename="([^"]+)"/i.exec(contentDisposition)?.[1];
  const plainFileName = /filename=([^;]+)/i.exec(contentDisposition)?.[1];
  const headerFileName = quotedFileName ?? plainFileName;
  if (!headerFileName) return null;

  const sanitizedFileName = sanitizeFileName(headerFileName);
  return sanitizedFileName || null;
}

function getFileExtension(contentType: string): string {
  if (contentType.includes("application/pdf")) return ".pdf";
  if (
    contentType.includes(
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    )
  ) {
    return ".docx";
  }
  if (contentType.includes("application/json")) return ".json";
  if (contentType.includes("text/html")) return ".html";
  if (contentType.includes("text/plain")) return ".txt";
  if (contentType.includes("application/zip")) return ".zip";
  return ".bin";
}

function createFallbackFileName(address: string, contentType: string): string {
  const addressFileName = sanitizeFileName(address).slice(0, 60) || "주소";
  return `SafeScope-${addressFileName}-안전분석보고서${getFileExtension(contentType)}`;
}

export async function requestSafetyReport(
  address: string,
  options: ReportRequestOptions = {},
): Promise<ReportFile> {
  const request: AnalyzeReportRequest = { address };
  const requestInit: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  };

  if (options.signal) requestInit.signal = options.signal;

  let response: Response;
  try {
    response = await fetch(ANALYZE_REPORT_URL, requestInit);
  } catch (requestError: unknown) {
    if (requestError instanceof DOMException && requestError.name === "AbortError") {
      throw requestError;
    }
    throw new Error(CONNECTION_ERROR, { cause: requestError });
  }

  if (!response.ok) {
    throw new Error(await getResponseError(response));
  }

  const blob = await response.blob();
  if (blob.size === 0) {
    throw new Error("생성된 보고서 파일이 비어 있습니다.");
  }

  const contentType = response.headers.get("content-type") ?? blob.type;
  const fileName =
    getContentDispositionFileName(
      response.headers.get("content-disposition"),
    ) ?? createFallbackFileName(address, contentType);

  return { blob, fileName };
}

export function saveReportFile({ blob, fileName }: ReportFile): void {
  const objectUrl = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");

  downloadLink.href = objectUrl;
  downloadLink.download = fileName;
  downloadLink.hidden = true;
  document.body.append(downloadLink);
  downloadLink.click();
  downloadLink.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, 0);
}
