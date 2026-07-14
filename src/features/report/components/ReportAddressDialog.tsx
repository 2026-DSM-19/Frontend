import { useEffect, useId, useRef, useState } from "react";
import type { MouseEvent, ReactElement, SyntheticEvent } from "react";
import { createPortal } from "react-dom";

import { getErrorMessage } from "../../../shared/utils/errors";
import { useAddressSearch } from "../../map/hooks/useAddressSearch";
import type { SearchResultModel } from "../../map/types/search";
import {
  requestSafetyReport,
  saveReportFile,
} from "../api/requestSafetyReport";
import {
  ReportDialog,
  ReportDialogBackdrop,
  ReportDialogCloseButton,
  ReportDialogDescription,
  ReportDialogHeader,
  ReportProgressSpinner,
  ReportResultSelectButton,
  ReportSearchBox,
  ReportSearchForm,
  ReportSearchInput,
  ReportSearchLabel,
  ReportSearchResultContent,
  ReportSearchResultItem,
  ReportSearchResults,
  ReportSearchSubmitButton,
  ReportStatus,
} from "../styles/reportStyles";

interface ReportAddressDialogProps {
  onClose: () => void;
}

function getResultAddress(result: SearchResultModel): string {
  return result.roadAddress || result.parcelAddress || result.title;
}

export function ReportAddressDialog({
  onClose,
}: ReportAddressDialogProps): ReactElement {
  const titleId = useId();
  const descriptionId = useId();
  const inputId = useId();
  const abortControllerRef = useRef<AbortController | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [reportError, setReportError] = useState("");
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
  } = useAddressSearch({});

  const handleClose = (): void => {
    abortControllerRef.current?.abort();
    onClose();
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        abortControllerRef.current?.abort();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      abortControllerRef.current?.abort();
    };
  }, [onClose]);

  const handleBackdropMouseDown = (
    event: MouseEvent<HTMLDivElement>,
  ): void => {
    if (event.target === event.currentTarget) handleClose();
  };

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>): void => {
    setReportError("");
    void handleSearch(event);
  };

  const handleSelectResult = async (
    result: SearchResultModel,
  ): Promise<void> => {
    const address = getResultAddress(result).trim();
    if (!address) {
      setReportError("분석에 사용할 주소를 확인할 수 없습니다.");
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current?.abort();
    abortControllerRef.current = controller;
    setIsDownloading(true);
    setReportError("");

    try {
      const reportFile = await requestSafetyReport(address, {
        signal: controller.signal,
      });

      if (controller.signal.aborted) return;

      saveReportFile(reportFile);
      abortControllerRef.current = null;
      setIsDownloading(false);
      onClose();
    } catch (requestError: unknown) {
      if (controller.signal.aborted) return;

      abortControllerRef.current = null;
      setIsDownloading(false);
      setReportError(
        getErrorMessage(requestError, "보고서 다운로드에 실패했습니다."),
      );
    }
  };

  const visibleError = reportError || searchError;

  return createPortal(
    <ReportDialogBackdrop onMouseDown={handleBackdropMouseDown}>
      <ReportDialog
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        aria-busy={isDownloading}
      >
        <ReportDialogHeader>
          <div>
            <h2 id={titleId}>보고서 다운로드</h2>
            <ReportDialogDescription id={descriptionId}>
              분석할 주소를 검색한 뒤 원하는 결과의 선택 버튼을 눌러주세요.
            </ReportDialogDescription>
          </div>
          <ReportDialogCloseButton
            type="button"
            aria-label="팝업 닫기"
            onClick={handleClose}
          >
            ×
          </ReportDialogCloseButton>
        </ReportDialogHeader>

        <ReportSearchForm onSubmit={handleSubmit} onBlur={handleSearchBlur}>
          <ReportSearchLabel htmlFor={inputId}>주소 검색</ReportSearchLabel>
          <ReportSearchBox $hasError={Boolean(visibleError)}>
            <ReportSearchInput
              id={inputId}
              value={query}
              onChange={handleQueryChange}
              onFocus={handleSearchFocus}
              placeholder="장소 또는 주소를 입력하세요"
              autoComplete="off"
              autoFocus
              disabled={isDownloading}
              aria-expanded={isSearchFocused && searchResults.length > 0}
            />
            <ReportSearchSubmitButton
              type="submit"
              aria-label="주소 검색"
              disabled={isSearching || isDownloading}
            >
              {isSearching ? (
                "…"
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="6" />
                  <path d="m16 16 4 4" />
                </svg>
              )}
            </ReportSearchSubmitButton>
          </ReportSearchBox>

          {isSearchFocused && searchResults.length > 0 && (
            <ReportSearchResults aria-label="주소 검색 결과">
              {searchResults.map((result) => {
                const address = getResultAddress(result);

                return (
                  <ReportSearchResultItem key={result.id}>
                    <ReportSearchResultContent>
                      <strong>{result.title}</strong>
                      <small>{address}</small>
                    </ReportSearchResultContent>
                    <ReportResultSelectButton
                      type="button"
                      disabled={isDownloading}
                      onClick={() => {
                        void handleSelectResult(result);
                      }}
                    >
                      선택
                    </ReportResultSelectButton>
                  </ReportSearchResultItem>
                );
              })}
            </ReportSearchResults>
          )}

          {isDownloading && (
            <ReportStatus $hasError={false} role="status">
              <ReportProgressSpinner aria-hidden="true" />
              안전 분석 보고서를 생성하고 있습니다.
            </ReportStatus>
          )}

          {!isDownloading && visibleError && (
            <ReportStatus $hasError role="alert">
              {visibleError}
            </ReportStatus>
          )}
        </ReportSearchForm>
      </ReportDialog>
    </ReportDialogBackdrop>,
    document.body,
  );
}
