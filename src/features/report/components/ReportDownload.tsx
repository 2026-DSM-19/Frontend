import { useState } from "react";
import type { ReactElement } from "react";

import {
  ReportDownloadButton,
  ReportDownloadSection,
} from "../styles/reportStyles";
import { ReportAddressDialog } from "./ReportAddressDialog";

export function ReportDownload(): ReactElement {
  const handleChatbotClick = () => {
    window.location.href = "/chatbot";
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <ReportDownloadSection>
      <ReportDownloadButton
        type="button"
        aria-haspopup="dialog"
        onClick={() => {
          setIsDialogOpen(true);
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3v12m0 0 4-4m-4 4-4-4" />
          <path d="M5 17v3h14v-3" />
        </svg>
        보고서 다운로드
      </ReportDownloadButton>

      <ReportDownloadButton type="button" onClick={handleChatbotClick}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
        </svg>
        챗봇 이용하기
      </ReportDownloadButton>

      {isDialogOpen && (
        <ReportAddressDialog
          onClose={() => {
            setIsDialogOpen(false);
          }}
        />
      )}
    </ReportDownloadSection>
  );
}
