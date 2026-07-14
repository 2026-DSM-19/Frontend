import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { Link } from "react-router";

interface ActiveStyleProps {
  $active: boolean;
}

interface OpenStyleProps {
  $open: boolean;
}

interface ErrorStyleProps {
  $error: boolean;
}

interface HasErrorStyleProps {
  $hasError: boolean;
}

export const Page = styled.main`
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

export const Sidebar = styled.aside`
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

export const Logo = styled(Link)`
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

export const SectionLabel = styled.label`
  display: block;
  margin: 0 4px 10px;
  color: #272b31;
  font-size: 0.86rem;
  font-weight: 700;
`;

export const SearchForm = styled.form`
  position: relative;
  margin-bottom: 30px;

  @media (max-width: 640px) {
    margin-bottom: 16px;
  }
`;

export const SearchBox = styled.div<HasErrorStyleProps>`
  display: flex;
  align-items: center;
  height: 44px;
  padding: 0 8px 0 15px;
  background: white;
  border: 1px solid
    ${({ $hasError }) => ($hasError ? "#dc5b5b" : "#d6dae1")};
  border-radius: 24px;
  box-shadow: 0 5px 18px rgba(24, 37, 58, 0.06);

  &:focus-within {
    border-color: #356bd7;
    box-shadow: 0 0 0 3px rgba(53, 107, 215, 0.12);
  }
`;

export const SearchInput = styled.input`
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

export const SearchButton = styled.button`
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

export const SearchResults = styled.div`
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

export const SearchResult = styled.button`
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

export const SearchMessage = styled.p`
  margin: 8px 5px 0;
  color: #c23f3f;
  font-size: 0.7rem;
`;

export const LayerMenuHeader = styled.div`
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

export const ClearSelectionButton = styled.button`
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

export const Menu = styled.nav`
  display: grid;
  gap: 6px;
`;

export const SidebarCopyright = styled.p`
  margin-top: auto;
  padding: 30px 6px 2px;
  color: #8b919a;
  font-size: 0.68rem;
  line-height: 1.5;
  text-align: center;
`;

export const MenuButton = styled.button<ActiveStyleProps>`
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

export const IconWrap = styled.span`
  display: grid;
  width: 28px;
  height: 28px;
  flex: 0 0 28px;
  place-items: center;
  color: currentColor;
`;

export const ChoiceIndicator = styled.span<ActiveStyleProps>`
  width: 17px;
  height: 17px;
  margin-left: auto;
  border: 1.5px solid
    ${({ $active }) => ($active ? "#235fcf" : "#adb2ba")};
  border-radius: 5px;
  background: ${({ $active }) => ($active ? "#235fcf" : "transparent")};
  box-shadow: ${({ $active }) =>
    $active ? "inset 0 0 0 3px white" : "none"};
`;

export const Chevron = styled.span<OpenStyleProps>`
  margin-left: auto;
  color: #656b74;
  transform: rotate(${({ $open }) => ($open ? "180deg" : "0deg")});
  transition: transform 160ms ease;
`;

export const CrimeOptions = styled.div`
  display: grid;
  gap: 2px;
  margin: 3px 0 8px 42px;
  padding: 4px 0 4px 13px;
  border-left: 1px solid #c7ccd4;
`;

export const CrimeChoice = styled.button<ActiveStyleProps>`
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

export const Dot = styled.span<ActiveStyleProps>`
  width: 7px;
  height: 7px;
  flex: 0 0 7px;
  border: 1px solid ${({ $active }) => ($active ? "#225dcf" : "#8d939c")};
  border-radius: 50%;
  background: ${({ $active }) => ($active ? "#225dcf" : "transparent")};
`;

export const MapShell = styled.section`
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

export const MapCanvas = styled.div`
  width: 100%;
  height: 100%;
  background: #d8e1ea;
`;

export const Status = styled.div<ErrorStyleProps>`
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

export const LoadingContent = styled.div`
  display: grid;
  place-items: center;
  gap: 14px;
  color: #243653;
  font-size: 0.88rem;
  font-weight: 700;
`;

export const LoadingSpinner = styled.span`
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
