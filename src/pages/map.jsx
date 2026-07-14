import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useSafetyMap } from "../hooks/useSafetyMap";
import { addSearch } from "../utils/AddSearch";

const CRIME_OPTIONS = [
  { id: "all", label: "범죄 전체" },
  { id: "theft", label: "절도" },
  { id: "sexual-violence", label: "성폭력" },
  { id: "violence", label: "폭력" },
  { id: "robbery", label: "강도" },
  { id: "child-crime", label: "아동대상 범죄" },
  { id: "senior-crime", label: "노인대상 범죄" },
];

const MAIN_OPTIONS = [
  { id: "security-light", label: "보안등", icon: "light" },
  { id: "traffic-accident-hotspot", label: "교통사고", icon: "traffic" },
  { id: "flood-trace", label: "침수", icon: "flood" },
  { id: "cctv", label: "CCTV", icon: "cctv" },
  { id: "police-facility", label: "치안센터", icon: "police" },
];

const Page = styled.main`
  display: flex;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  min-height: 0;
  overflow: hidden;
  color: #17191d;
  background: #e8edf3;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.aside`
  position: relative;
  z-index: 40;
  display: flex;
  flex-direction: column;
  flex: 0 0 292px;
  height: 100%;
  overflow-y: auto;
  padding: 32px 24px 28px;
  background: rgba(240, 241, 243, 0.96);
  border-right: 1px solid rgba(21, 35, 58, 0.1);
  box-shadow: 10px 0 32px rgba(27, 39, 58, 0.08);
  scrollbar-width: thin;

  @media (max-width: 760px) {
    flex-basis: 230px;
    padding: 24px 16px;
  }

  @media (max-width: 640px) {
    width: 100%;
    max-height: 46dvh;
    flex: 0 0 auto;
    padding: 18px 16px 20px;
    border-right: 0;
    border-bottom: 1px solid rgba(21, 35, 58, 0.1);
    box-shadow: 0 10px 28px rgba(27, 39, 58, 0.1);
  }
`;

const Logo = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 0 4px 42px;
  color: #1e4fc4;
  font-size: 1.42rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  text-decoration: none;

  img {
    width: 220px;
    height: auto;
  }

  span:first-of-type {
    color: #15181d;
  }

  @media (max-width: 640px) {
    margin-bottom: 22px;
    font-size: 1.2rem;

    img {
      width: 190px;
    }
  }
`;

const SectionLabel = styled.label`
  display: block;
  margin: 0 4px 10px;
  color: #272b31;
  font-size: 0.86rem;
  font-weight: 700;
`;

const SearchForm = styled.form`
  position: relative;
  margin-bottom: 30px;

  @media (max-width: 640px) {
    margin-bottom: 16px;
  }
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  height: 44px;
  padding: 0 8px 0 15px;
  background: white;
  border: 1px solid ${({ $hasError }) => ($hasError ? "#dc5b5b" : "#d6dae1")};
  border-radius: 24px;
  box-shadow: 0 5px 18px rgba(24, 37, 58, 0.06);

  &:focus-within {
    border-color: #356bd7;
    box-shadow: 0 0 0 3px rgba(53, 107, 215, 0.12);
  }
`;

const SearchInput = styled.input`
  min-width: 0;
  flex: 1;
  border: 0;
  outline: 0;
  color: #17191d;
  background: transparent;
  font: inherit;
  font-size: 0.86rem;

  &::placeholder {
    color: #a1a5ad;
  }
`;

const SearchButton = styled.button`
  display: grid;
  width: 32px;
  height: 32px;
  flex: 0 0 auto;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 50%;
  color: #2a2d32;
  background: transparent;
  cursor: pointer;

  &:hover {
    background: #eef2f8;
  }
`;

const SearchResults = styled.div`
  position: absolute;
  z-index: 50;
  top: 52px;
  right: 0;
  left: 0;
  overflow: hidden;
  padding: 6px;
  background: white;
  border: 1px solid #dce0e6;
  border-radius: 14px;
  box-shadow: 0 16px 32px rgba(25, 37, 57, 0.16);
`;

const SearchResult = styled.button`
  width: 100%;
  padding: 9px 10px;
  border: 0;
  border-radius: 9px;
  color: #22262c;
  background: transparent;
  text-align: left;
  cursor: pointer;

  &:hover {
    background: #f0f4fa;
  }

  strong,
  small {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  strong {
    font-size: 0.8rem;
  }

  small {
    margin-top: 3px;
    color: #7a8089;
    font-size: 0.68rem;
  }
`;

const SearchMessage = styled.p`
  margin: 8px 5px 0;
  color: #c23f3f;
  font-size: 0.7rem;
`;

const LayerMenuHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 0 5px 10px;

  strong {
    color: #272b31;
    font-size: 0.82rem;
  }
`;

const ClearSelectionButton = styled.button`
  padding: 5px 8px;
  border: 0;
  border-radius: 8px;
  color: #526171;
  background: rgba(255, 255, 255, 0.7);
  font-size: 0.7rem;
  font-weight: 700;
  cursor: pointer;

  &:hover:not(:disabled) {
    color: #174dbb;
    background: white;
  }

  &:disabled {
    color: #a8adb4;
    cursor: not-allowed;
    opacity: 0.65;
  }
`;

const Menu = styled.nav`
  display: grid;
  gap: 6px;
`;

const SidebarCopyright = styled.p`
  margin-top: auto;
  padding: 30px 6px 2px;
  color: #8b919a;
  font-size: 0.68rem;
  line-height: 1.5;
  text-align: center;
`;

const MenuButton = styled.button`
  display: flex;
  width: 100%;
  min-height: 47px;
  align-items: center;
  gap: 13px;
  padding: 9px 11px;
  border: 0;
  border-radius: 13px;
  color: ${({ $active }) => ($active ? "#174dbb" : "#181b20")};
  background: ${({ $active }) => ($active ? "#ffffff" : "transparent")};
  box-shadow: ${({ $active }) =>
    $active ? "0 7px 20px rgba(29, 54, 96, 0.09)" : "none"};
  font: inherit;
  font-size: 0.94rem;
  font-weight: ${({ $active }) => ($active ? 700 : 600)};
  text-align: left;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.75);
  }
`;

const IconWrap = styled.span`
  display: grid;
  width: 28px;
  height: 28px;
  flex: 0 0 28px;
  place-items: center;
  color: currentColor;
`;

const ChoiceIndicator = styled.span`
  width: 17px;
  height: 17px;
  margin-left: auto;
  border: 1.5px solid ${({ $active }) => ($active ? "#235fcf" : "#adb2ba")};
  border-radius: 5px;
  background: ${({ $active }) => ($active ? "#235fcf" : "transparent")};
  box-shadow: ${({ $active }) => ($active ? "inset 0 0 0 3px white" : "none")};
`;

const Chevron = styled.span`
  margin-left: auto;
  color: #656b74;
  transform: rotate(${({ $open }) => ($open ? "180deg" : "0deg")});
  transition: transform 160ms ease;
`;

const CrimeOptions = styled.div`
  display: grid;
  gap: 2px;
  margin: 3px 0 8px 42px;
  padding: 4px 0 4px 13px;
  border-left: 1px solid #c7ccd4;
`;

const CrimeChoice = styled.button`
  display: flex;
  min-height: 34px;
  align-items: center;
  gap: 9px;
  padding: 5px 8px;
  border: 0;
  border-radius: 9px;
  color: ${({ $active }) => ($active ? "#174dbb" : "#353940")};
  background: ${({ $active }) =>
    $active ? "rgba(255,255,255,.9)" : "transparent"};
  font: inherit;
  font-size: 0.81rem;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  text-align: left;
  cursor: pointer;

  &:hover {
    background: white;
  }
`;

const Dot = styled.span`
  width: 7px;
  height: 7px;
  flex: 0 0 7px;
  border: 1px solid ${({ $active }) => ($active ? "#225dcf" : "#8d939c")};
  border-radius: 50%;
  background: ${({ $active }) => ($active ? "#225dcf" : "transparent")};
`;

const MapShell = styled.section`
  position: relative;
  min-width: 0;
  min-height: 0;
  flex: 1;
  height: 100%;

  @media (max-width: 640px) {
    width: 100%;
    height: auto;
  }
`;

const MapCanvas = styled.div`
  width: 100%;
  height: 100%;
  background: #d8e1ea;
`;

const Status = styled.div`
  position: absolute;
  z-index: 30;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 24px;
  color: ${({ $error }) => ($error ? "#b42318" : "#334155")};
  background: rgba(238, 242, 247, 0.82);
  text-align: center;
`;

const rotate = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const LoadingContent = styled.div`
  display: grid;
  place-items: center;
  gap: 14px;
  color: #243653;
  font-size: 0.88rem;
  font-weight: 700;
`;

const LoadingSpinner = styled.span`
  width: 44px;
  height: 44px;
  border: 4px solid rgba(35, 95, 207, 0.18);
  border-top-color: #235fcf;
  border-radius: 50%;
  animation: ${rotate} 0.8s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation-duration: 1.6s;
  }
`;

function MenuIcon({ type }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      aria-hidden="true"
      {...common}
    >
      {type === "light" && (
        <path d="M9 21h6M10 17h4M8.7 14.5a6 6 0 1 1 6.6 0c-.9.7-1.3 1.4-1.3 2.5h-4c0-1.1-.4-1.8-1.3-2.5Z" />
      )}
      {type === "traffic" && (
        <path d="M8 3h8v18H8zM5 7H3m2 5H3m2 5H3m16-10h-2m2 5h-2m2 5h-2M12 7v10m-2-5h4" />
      )}
      {type === "crime" && (
        <path d="M7 4h10v4H7zM9 8v12m6-12v12M6 20h12M5 8h14M9 13h6" />
      )}
      {type === "flood" && (
        <path d="M3 8h18M5 4h14M4 13c2 0 2 1.5 4 1.5s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5M4 18c2 0 2 1.5 4 1.5s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5" />
      )}
      {type === "cctv" && (
        <path d="m4 8 12-3 1 5-12 3zM17 7l3 1v5l-3-1M10 12v5m-3 3h6m-3-3-3 3m3-3 3 3" />
      )}
      {type === "police" && (
        <path d="M4 9h16M6 9v10m12-10v10M3 20h18M12 3l9 5H3zM9 13h6" />
      )}
    </svg>
  );
}

function MapPage() {
  const mapElementRef = useRef(null);
  const selectedSearchTitleRef = useRef("");
  const [selectedMapTypes, setSelectedMapTypes] = useState([]);
  const [crimeOpen, setCrimeOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const { status, error, focusPoint } = useSafetyMap({
    mapElementRef,
    selectedMapTypes,
  });

  useEffect(() => {
    const keyword = query.trim();

    if (!searchFocused || keyword.length < 2) return;

    if (selectedSearchTitleRef.current === keyword) {
      selectedSearchTitleRef.current = "";
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => {
      const loadSuggestions = async () => {
        setSearching(true);
        setSearchError("");

        try {
          const results = await addSearch(keyword, {
            signal: controller.signal,
          });

          if (!controller.signal.aborted) {
            setSearchResults(results.slice(0, 6));
            if (results.length === 0) {
              setSearchError("검색 결과가 없습니다.");
            }
          }
        } catch (requestError) {
          if (!controller.signal.aborted) {
            setSearchResults([]);
            setSearchError(
              requestError.message || "자동완성 검색에 실패했습니다.",
            );
          }
        } finally {
          if (!controller.signal.aborted) setSearching(false);
        }
      };

      loadSuggestions();
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, searchFocused]);

  const toggleLayer = (mapLayerType) => {
    setSelectedMapTypes((current) => {
      const isCrimeLayer = CRIME_OPTIONS.some(({ id }) => id === mapLayerType);

      if (mapLayerType === "all") {
        const withoutCrimeLayers = current.filter(
          (item) => !CRIME_OPTIONS.some(({ id }) => id === item),
        );

        return current.includes("all")
          ? withoutCrimeLayers
          : [...withoutCrimeLayers, "all"];
      }

      if (isCrimeLayer) {
        const withoutCrimeAll = current.filter((item) => item !== "all");

        return withoutCrimeAll.includes(mapLayerType)
          ? withoutCrimeAll.filter((item) => item !== mapLayerType)
          : [...withoutCrimeAll, mapLayerType];
      }

      return current.includes(mapLayerType)
        ? current.filter((item) => item !== mapLayerType)
        : [...current, mapLayerType];
    });
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!query.trim()) return;

    setSearching(true);
    setSearchError("");
    try {
      const results = await addSearch(query);
      setSearchResults(results.slice(0, 6));
      if (results[0]?.point) focusPoint(results[0].point);
      if (results.length === 0) setSearchError("검색 결과가 없습니다.");
    } catch (requestError) {
      setSearchResults([]);
      setSearchError(requestError.message || "검색에 실패했습니다.");
    } finally {
      setSearching(false);
    }
  };

  const chooseSearchResult = (result) => {
    focusPoint(result.point);
    selectedSearchTitleRef.current = result.title;
    setQuery(result.title);
    setSearchResults([]);
  };

  const handleQueryChange = (event) => {
    const nextQuery = event.target.value;
    selectedSearchTitleRef.current = "";
    setQuery(nextQuery);
    setSearchError("");

    if (nextQuery.trim().length < 2) {
      setSearchResults([]);
    }
  };

  const handleSearchBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setSearchFocused(false);
      setSearchResults([]);
    }
  };

  const crimeSelected = CRIME_OPTIONS.some(({ id }) =>
    selectedMapTypes.includes(id),
  );

  return (
    <Page>
      <Sidebar>
        <Logo to="/" aria-label="Safe Scope 홈으로 이동">
          <img src="/logo.svg" alt="" />
        </Logo>

        <SectionLabel htmlFor="map-address-search">주소 검색</SectionLabel>
        <SearchForm onSubmit={handleSearch} onBlur={handleSearchBlur}>
          <SearchBox $hasError={Boolean(searchError)}>
            <SearchInput
              id="map-address-search"
              value={query}
              onChange={handleQueryChange}
              onFocus={() => setSearchFocused(true)}
              placeholder="장소 또는 주소를 입력하세요"
              autoComplete="off"
              aria-expanded={searchFocused && searchResults.length > 0}
            />
            <SearchButton
              type="submit"
              aria-label="주소 검색"
              disabled={searching}
            >
              {searching ? "…" : "⌕"}
            </SearchButton>
          </SearchBox>
          {searchFocused && searchResults.length > 0 && (
            <SearchResults>
              {searchResults.map((result) => (
                <SearchResult
                  type="button"
                  key={result.id}
                  onClick={() => chooseSearchResult(result)}
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

        <LayerMenuHeader>
          <strong>안전 레이어</strong>
          <ClearSelectionButton
            type="button"
            disabled={selectedMapTypes.length === 0}
            onClick={() => setSelectedMapTypes([])}
          >
            전체 선택 해제
          </ClearSelectionButton>
        </LayerMenuHeader>

        <Menu aria-label="안전 지도 레이어">
          {MAIN_OPTIONS.slice(0, 2).map((item) => {
            const active = selectedMapTypes.includes(item.id);
            return (
              <MenuButton
                type="button"
                key={item.id}
                $active={active}
                aria-pressed={active}
                onClick={() => toggleLayer(item.id)}
              >
                <IconWrap>
                  <MenuIcon type={item.icon} />
                </IconWrap>
                {item.label}
                <ChoiceIndicator $active={active} />
              </MenuButton>
            );
          })}

          <MenuButton
            type="button"
            $active={crimeSelected}
            aria-expanded={crimeOpen}
            onClick={() => setCrimeOpen((open) => !open)}
          >
            <IconWrap>
              <MenuIcon type="crime" />
            </IconWrap>
            범죄
            <Chevron $open={crimeOpen}>⌃</Chevron>
          </MenuButton>
          {crimeOpen && (
            <CrimeOptions aria-label="범죄 레이어 선택">
              {CRIME_OPTIONS.map((item) => {
                const active = selectedMapTypes.includes(item.id);
                return (
                  <CrimeChoice
                    type="button"
                    key={item.id}
                    $active={active}
                    aria-pressed={active}
                    onClick={() => toggleLayer(item.id)}
                  >
                    <Dot $active={active} />
                    {item.label}
                  </CrimeChoice>
                );
              })}
            </CrimeOptions>
          )}

          {MAIN_OPTIONS.slice(2).map((item) => {
            const active = selectedMapTypes.includes(item.id);
            return (
              <MenuButton
                type="button"
                key={item.id}
                $active={active}
                aria-pressed={active}
                onClick={() => toggleLayer(item.id)}
              >
                <IconWrap>
                  <MenuIcon type={item.icon} />
                </IconWrap>
                {item.label}
                <ChoiceIndicator $active={active} />
              </MenuButton>
            );
          })}
        </Menu>

        <SidebarCopyright>
          © {new Date().getFullYear()} Safe Scope. All rights reserved.
        </SidebarCopyright>
      </Sidebar>

      <MapShell>
        <MapCanvas ref={mapElementRef} />
        {status !== "ready" && (
          <Status
            $error={status === "error"}
            role={status === "error" ? "alert" : "status"}
          >
            {status === "error" ? (
              error
            ) : (
              <LoadingContent>
                <LoadingSpinner aria-hidden="true" />
                <span>지도를 불러오는 중입니다.</span>
              </LoadingContent>
            )}
          </Status>
        )}
      </MapShell>
    </Page>
  );
}

export default MapPage;
