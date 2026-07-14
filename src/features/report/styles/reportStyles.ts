import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

interface ErrorStyleProps {
  $hasError: boolean;
}

export const ReportDownloadSection = styled.div`
  margin-top: 22px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ReportDownloadButton = styled.button`
  display: flex;
  width: 100%;
  min-height: 48px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 11px 16px;
  border: 0;
  border-radius: 13px;
  color: white;
  background: #2768dc;
  font: inherit;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 160ms ease,
    box-shadow 160ms ease;

  &:hover {
    box-shadow: 0 11px 24px rgba(23, 77, 187, 0.26);
  }

  &:focus-visible {
    outline: 3px solid rgba(53, 107, 215, 0.25);
    outline-offset: 3px;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const ReportDialogBackdrop = styled.div`
  position: fixed;
  z-index: 1000;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(13, 29, 61, 0.42);
  backdrop-filter: blur(4px);

  @media (max-width: 640px) {
    align-items: end;
    padding: 12px;
  }
`;

export const ReportDialog = styled.section`
  width: min(520px, 100%);
  max-height: min(720px, calc(100dvh - 48px));
  overflow-y: auto;
  padding: 26px;
  border: 1px solid rgba(21, 35, 58, 0.1);
  border-radius: 22px;
  color: #17191d;
  background: #f8f9fb;
  box-shadow: 0 28px 70px rgba(13, 29, 61, 0.28);

  @media (max-width: 640px) {
    max-height: calc(100dvh - 24px);
    padding: 22px 18px;
    border-radius: 20px;
  }
`;

export const ReportDialogHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;

  h2 {
    color: #172033;
    font-size: 1.25rem;
    line-height: 1.35;
  }
`;

export const ReportDialogCloseButton = styled.button`
  display: grid;
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 50%;
  color: #555d69;
  background: #e9ecf1;
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;

  &:hover {
    color: #172033;
    background: #dde2e9;
  }
`;

export const ReportDialogDescription = styled.p`
  margin-top: 8px;
  color: #687181;
  font-size: 0.86rem;
  line-height: 1.6;
`;

export const ReportSearchForm = styled.form`
  margin-top: 24px;
`;

export const ReportSearchLabel = styled.label`
  display: block;
  margin: 0 4px 9px;
  color: #303746;
  font-size: 0.78rem;
  font-weight: 700;
`;

export const ReportSearchBox = styled.div<ErrorStyleProps>`
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 7px 0 16px;
  border: 1px solid ${({ $hasError }) => ($hasError ? "#d45858" : "#ced4de")};
  border-radius: 14px;
  background: white;
  box-shadow: 0 5px 18px rgba(24, 37, 58, 0.06);

  &:focus-within {
    border-color: #356bd7;
    box-shadow: 0 0 0 3px rgba(53, 107, 215, 0.12);
  }
`;

export const ReportSearchInput = styled.input`
  min-width: 0;
  flex: 1;
  border: 0;
  outline: 0;
  color: #17191d;
  background: transparent;
  font: inherit;
  font-size: 0.9rem;

  &::placeholder {
    color: #9da4af;
  }

  &:disabled {
    cursor: wait;
  }
`;

export const ReportSearchSubmitButton = styled.button`
  display: grid;
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 10px;
  color: white;
  background: #235fcf;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #174dbb;
  }

  &:disabled {
    cursor: wait;
    opacity: 0.65;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const ReportSearchResults = styled.ul`
  display: grid;
  max-height: 280px;
  gap: 7px;
  overflow-y: auto;
  margin-top: 12px;
  padding: 7px;
  border: 1px solid #dce0e6;
  border-radius: 14px;
  background: white;
  box-shadow: 0 12px 28px rgba(25, 37, 57, 0.1);
`;

export const ReportSearchResultItem = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 9px 10px 11px;
  border-radius: 10px;

  &:hover {
    background: #f1f4f9;
  }
`;

export const ReportSearchResultContent = styled.div`
  min-width: 0;
  flex: 1;

  strong,
  small {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  strong {
    color: #242a35;
    font-size: 0.82rem;
  }

  small {
    margin-top: 4px;
    color: #737b88;
    font-size: 0.72rem;
  }
`;

export const ReportResultSelectButton = styled.button`
  flex: 0 0 auto;
  padding: 7px 11px;
  border: 1px solid #bfd0ef;
  border-radius: 9px;
  color: #174dbb;
  background: #edf3ff;
  font: inherit;
  font-size: 0.74rem;
  font-weight: 700;
  cursor: pointer;

  &:hover:not(:disabled) {
    color: white;
    background: #235fcf;
    border-color: #235fcf;
  }

  &:disabled {
    cursor: wait;
    opacity: 0.55;
  }
`;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const ReportStatus = styled.p<ErrorStyleProps>`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 4px 0;
  color: ${({ $hasError }) => ($hasError ? "#bd3e3e" : "#31527d")};
  font-size: 0.76rem;
  line-height: 1.5;
`;

export const ReportProgressSpinner = styled.span`
  width: 15px;
  height: 15px;
  flex: 0 0 15px;
  border: 2px solid rgba(35, 95, 207, 0.2);
  border-top-color: #235fcf;
  border-radius: 50%;
  animation: ${spin} 0.75s linear infinite;
`;
