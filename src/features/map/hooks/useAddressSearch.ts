import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FocusEvent, SyntheticEvent } from "react";

import { getErrorMessage } from "../../../shared/utils/errors";
import { searchVWorld } from "../api/searchVWorld";
import type { SearchPoint, SearchResultModel } from "../types/search";

interface UseAddressSearchOptions {
  focusPoint: (point: SearchPoint | null) => void;
}

interface UseAddressSearchResult {
  query: string;
  searchResults: SearchResultModel[];
  searchError: string;
  isSearching: boolean;
  isSearchFocused: boolean;
  handleSearch: (event: SyntheticEvent<HTMLFormElement>) => Promise<void>;
  handleQueryChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSearchFocus: () => void;
  handleSearchBlur: (event: FocusEvent<HTMLFormElement>) => void;
  handleChooseSearchResult: (result: SearchResultModel) => void;
}

export function useAddressSearch({
  focusPoint,
}: UseAddressSearchOptions): UseAddressSearchResult {
  const selectedSearchTitleRef = useRef("");
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResultModel[]>([]);
  const [searchError, setSearchError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const keyword = query.trim();

    if (!isSearchFocused || keyword.length < 2) return;

    if (selectedSearchTitleRef.current === keyword) {
      selectedSearchTitleRef.current = "";
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      const loadSuggestions = async (): Promise<void> => {
        setIsSearching(true);
        setSearchError("");

        try {
          const results = await searchVWorld(keyword, {
            signal: controller.signal,
          });

          if (!controller.signal.aborted) {
            setSearchResults(results.slice(0, 6));
            if (results.length === 0) {
              setSearchError("검색 결과가 없습니다.");
            }
          }
        } catch (requestError: unknown) {
          if (!controller.signal.aborted) {
            setSearchResults([]);
            setSearchError(
              getErrorMessage(
                requestError,
                "자동완성 검색에 실패했습니다.",
              ),
            );
          }
        } finally {
          if (!controller.signal.aborted) setIsSearching(false);
        }
      };

      void loadSuggestions();
    }, 350);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query, isSearchFocused]);

  const handleSearch = async (
    event: SyntheticEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setSearchError("");

    try {
      const results = await searchVWorld(query);
      setSearchResults(results.slice(0, 6));
      if (results[0]?.point) focusPoint(results[0].point);
      if (results.length === 0) setSearchError("검색 결과가 없습니다.");
    } catch (requestError: unknown) {
      setSearchResults([]);
      setSearchError(getErrorMessage(requestError, "검색에 실패했습니다."));
    } finally {
      setIsSearching(false);
    }
  };

  const handleChooseSearchResult = (result: SearchResultModel): void => {
    focusPoint(result.point);
    selectedSearchTitleRef.current = result.title;
    setQuery(result.title);
    setSearchResults([]);
  };

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const nextQuery = event.target.value;
    selectedSearchTitleRef.current = "";
    setQuery(nextQuery);
    setSearchError("");

    if (nextQuery.trim().length < 2) {
      setSearchResults([]);
    }
  };

  const handleSearchFocus = (): void => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = (event: FocusEvent<HTMLFormElement>): void => {
    const nextTarget = event.relatedTarget;
    const isFocusStillInside =
      nextTarget instanceof Node && event.currentTarget.contains(nextTarget);

    if (!isFocusStillInside) {
      setIsSearchFocused(false);
      setSearchResults([]);
    }
  };

  return {
    query,
    searchResults,
    searchError,
    isSearching,
    isSearchFocused,
    handleSearch,
    handleQueryChange,
    handleSearchFocus,
    handleSearchBlur,
    handleChooseSearchResult,
  };
}
