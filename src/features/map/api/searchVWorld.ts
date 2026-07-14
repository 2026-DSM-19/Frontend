import { getErrorMessage } from "../../../shared/utils/errors";
import { isRecord } from "../../../shared/utils/isRecord";
import type {
  SearchPoint,
  SearchRequestOptions,
  SearchResultModel,
  SearchTarget,
  SearchTargetType,
} from "../types/search";

const SEARCH_TARGETS: readonly SearchTarget[] = [
  { type: "place" },
  { type: "address", category: "road" },
  { type: "address", category: "parcel" },
];

const DEFAULT_RESULT_TITLE = "이름 없는 검색 결과";
const SEARCH_REQUEST_ERROR = "VWorld 검색 요청에 실패했습니다.";

interface NormalizedSearchResponse {
  status: string | null;
  errorText: string | null;
  items: readonly Record<string, unknown>[];
}

function getString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function getResultId(value: unknown): string {
  return typeof value === "string" || typeof value === "number"
    ? String(value)
    : "undefined";
}

function toSearchPoint(value: unknown): SearchPoint | null {
  if (!isRecord(value)) return null;

  const { x, y } = value;
  const hasValidX = typeof x === "string" || typeof x === "number";
  const hasValidY = typeof y === "string" || typeof y === "number";

  return hasValidX && hasValidY ? { x, y } : null;
}

function toSearchResult(
  item: Record<string, unknown>,
  type: SearchTargetType,
): SearchResultModel {
  const address = isRecord(item.address) ? item.address : {};
  const roadAddress = getString(address.road);
  const parcelAddress = getString(address.parcel);

  return {
    id: `${type}-${getResultId(item.id)}`,
    type,
    title:
      getString(item.title) ||
      roadAddress ||
      parcelAddress ||
      DEFAULT_RESULT_TITLE,
    roadAddress,
    parcelAddress,
    category: getString(item.category),
    point: toSearchPoint(item.point),
  };
}

function normalizeSearchResponse(data: unknown): NormalizedSearchResponse {
  const root = isRecord(data) ? data : {};
  const response = isRecord(root.response) ? root.response : {};
  const error = isRecord(response.error) ? response.error : {};
  const result = isRecord(response.result) ? response.result : {};
  const rawItems = Array.isArray(result.items) ? result.items : [];

  return {
    status: typeof response.status === "string" ? response.status : null,
    errorText: typeof error.text === "string" ? error.text : null,
    items: rawItems.filter(isRecord),
  };
}

async function parseSearchResponse(response: Response): Promise<unknown> {
  const responseText = await response.text();

  if (!response.ok) {
    throw new Error("VWorld 검색 서버에 연결하지 못했습니다.");
  }

  try {
    const parsed: unknown = JSON.parse(responseText);
    return parsed;
  } catch {
    throw new Error("VWorld 검색 응답을 확인할 수 없습니다.");
  }
}

async function searchTarget(
  keyword: string,
  apiKey: string,
  target: SearchTarget,
  signal: AbortSignal | undefined,
): Promise<SearchResultModel[]> {
  const params = new URLSearchParams({
    service: "search",
    request: "search",
    version: "2.0",
    format: "json",
    errorformat: "json",
    size: "5",
    page: "1",
    query: keyword,
    type: target.type,
    key: apiKey,
  });

  if (target.category) params.set("category", target.category);

  const requestOptions: RequestInit | undefined = signal ? { signal } : undefined;
  const response = await fetch(`/vworld-api/req/search?${params}`, requestOptions);
  const data = normalizeSearchResponse(await parseSearchResponse(response));

  if (data.status === "ERROR") {
    if (data.errorText) throw new Error(data.errorText);
    throw new Error(SEARCH_REQUEST_ERROR);
  }

  return data.items.map((item) => toSearchResult(item, target.type));
}

export async function searchVWorld(
  query: string,
  options: SearchRequestOptions = {},
): Promise<SearchResultModel[]> {
  const keyword = query.trim();
  const apiKey = import.meta.env.VITE_V_WORLD_API_TOKEN;

  if (!keyword) return [];

  if (!apiKey) {
    throw new Error("VWorld API 키가 설정되지 않았습니다.");
  }

  const responses = await Promise.allSettled(
    SEARCH_TARGETS.map((target) =>
      searchTarget(keyword, apiKey, target, options.signal),
    ),
  );
  const fulfilledResponses = responses.filter(
    (result) => result.status === "fulfilled",
  );
  const successfulResults = fulfilledResponses.flatMap(
    (result) => result.value,
  );

  if (fulfilledResponses.length === 0) {
    const firstFailure = responses.find(
      (result) => result.status === "rejected",
    );
    throw new Error(
      getErrorMessage(firstFailure?.reason, SEARCH_REQUEST_ERROR),
    );
  }

  return successfulResults.filter(
    (result, index, allResults) =>
      index ===
      allResults.findIndex(
        (candidate) =>
          candidate.title === result.title &&
          candidate.point?.x === result.point?.x &&
          candidate.point?.y === result.point?.y,
      ),
  );
}
