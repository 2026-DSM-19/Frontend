import type { ReactElement, SyntheticEvent } from "react";

import { useAddressSearch } from "../hooks/useAddressSearch";
import {
  SearchBox,
  SearchButton,
  SearchForm,
  SearchInput,
  SearchMessage,
  SearchResult,
  SearchResults,
  SectionLabel,
} from "../styles/mapStyles";
import type { SearchPoint } from "../types/search";

interface AddressSearchProps {
  focusPoint: (point: SearchPoint | null) => void;
}

export function AddressSearch({ focusPoint }: AddressSearchProps): ReactElement {
  const {
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
  } = useAddressSearch({ focusPoint });

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>): void => {
    void handleSearch(event);
  };

  return (
    <>
      <SectionLabel htmlFor="map-address-search">주소 검색</SectionLabel>
      <SearchForm onSubmit={handleSubmit} onBlur={handleSearchBlur}>
        <SearchBox $hasError={Boolean(searchError)}>
          <SearchInput
            id="map-address-search"
            value={query}
            onChange={handleQueryChange}
            onFocus={handleSearchFocus}
            placeholder="장소 또는 주소를 입력하세요"
            autoComplete="off"
            aria-expanded={isSearchFocused && searchResults.length > 0}
          />
          <SearchButton
            type="submit"
            aria-label="주소 검색"
            disabled={isSearching}
          >
            {isSearching ? "…" : "⌕"}
          </SearchButton>
        </SearchBox>

        {isSearchFocused && searchResults.length > 0 && (
          <SearchResults>
            {searchResults.map((result) => (
              <SearchResult
                type="button"
                key={result.id}
                onClick={() => {
                  handleChooseSearchResult(result);
                }}
              >
                <strong>{result.title}</strong>
                <small>{result.roadAddress || result.parcelAddress}</small>
              </SearchResult>
            ))}
          </SearchResults>
        )}

        {searchError && (
          <SearchMessage role="alert">{searchError}</SearchMessage>
        )}
      </SearchForm>
    </>
  );
}
