const SEARCH_TARGETS = [
  { type: "place" },
  { type: "address", category: "road" },
  { type: "address", category: "parcel" },
];

function toSearchResult(item, type) {
  const address = item.address ?? {};

  return {
    id: `${type}-${item.id}`,
    type,
    title: item.title || address.road || address.parcel || "이름 없는 검색 결과",
    roadAddress: address.road || "",
    parcelAddress: address.parcel || "",
    category: item.category || "",
    point: item.point ?? null,
  };
}

async function parseSearchResponse(response) {
  const responseText = await response.text();

  if (!response.ok) {
    throw new Error("VWorld 검색 서버에 연결하지 못했습니다.");
  }

  try {
    return JSON.parse(responseText);
  } catch {
    throw new Error("VWorld 검색 응답을 확인할 수 없습니다.");
  }
}

/**
 * VWorld 검색 API를 호출하고 화면에서 사용하기 쉬운 형태로 결과를 정리합니다.
 * @param {string} query 검색어
 * @param {{ signal?: AbortSignal }} options fetch 옵션
 */
export async function addSearch(query, { signal } = {}) {
  const keyword = query.trim();
  const apiKey = import.meta.env.VITE_V_WORLD_API_TOKEN;

  if (!keyword) return [];

  if (!apiKey) {
    throw new Error("VWorld API 키가 설정되지 않았습니다.");
  }

  const responses = await Promise.allSettled(
    SEARCH_TARGETS.map(async ({ type, category }) => {
      const params = new URLSearchParams({
        service: "search",
        request: "search",
        version: "2.0",
        format: "json",
        errorformat: "json",
        size: "5",
        page: "1",
        query: keyword,
        type,
        key: apiKey,
      });

      if (category) params.set("category", category);

      const response = await fetch(`/vworld-api/req/search?${params}`, {
        signal,
      });
      const data = await parseSearchResponse(response);

      if (data.response?.status === "ERROR") {
        throw new Error(
          data.response?.error?.text || "VWorld 검색 요청에 실패했습니다.",
        );
      }

      return (data.response?.result?.items ?? []).map((item) =>
        toSearchResult(item, type),
      );
    }),
  );

  const fulfilledResponses = responses.filter(
    (result) => result.status === "fulfilled",
  );
  const successfulResults = fulfilledResponses.flatMap(
    (result) => result.value,
  );

  if (fulfilledResponses.length === 0) {
    const firstFailure = responses.find((result) => result.status === "rejected");
    throw firstFailure?.reason || new Error("VWorld 검색 요청에 실패했습니다.");
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
