import type { ReactElement } from "react";

import { CRIME_OPTIONS, MAIN_OPTIONS } from "../constants/layers";
import {
  Chevron,
  ChoiceIndicator,
  ClearSelectionButton,
  CrimeChoice,
  CrimeOptions,
  Dot,
  IconWrap,
  LayerMenuHeader,
  Menu,
  MenuButton,
} from "../styles/mapStyles";
import type { MapLayerType } from "../types/map";
import { MenuIcon } from "./MenuIcon";

interface LayerMenuProps {
  selectedMapTypes: readonly MapLayerType[];
  isCrimeOpen: boolean;
  onToggleLayer: (mapLayerType: MapLayerType) => void;
  onToggleCrimeMenu: () => void;
  onClearSelection: () => void;
}

export function LayerMenu({
  selectedMapTypes,
  isCrimeOpen,
  onToggleLayer,
  onToggleCrimeMenu,
  onClearSelection,
}: LayerMenuProps): ReactElement {
  const isCrimeSelected = CRIME_OPTIONS.some(({ id }) =>
    selectedMapTypes.includes(id),
  );

  return (
    <>
      <LayerMenuHeader>
        <strong>안전 레이어</strong>
        <ClearSelectionButton
          type="button"
          disabled={selectedMapTypes.length === 0}
          onClick={onClearSelection}
        >
          전체 선택 해제
        </ClearSelectionButton>
      </LayerMenuHeader>

      <Menu aria-label="안전 지도 레이어">
        {MAIN_OPTIONS.slice(0, 2).map((item) => {
          const isActive = selectedMapTypes.includes(item.id);

          return (
            <MenuButton
              type="button"
              key={item.id}
              $active={isActive}
              aria-pressed={isActive}
              onClick={() => {
                onToggleLayer(item.id);
              }}
            >
              <IconWrap>
                <MenuIcon type={item.icon} />
              </IconWrap>
              {item.label}
              <ChoiceIndicator $active={isActive} />
            </MenuButton>
          );
        })}

        <MenuButton
          type="button"
          $active={isCrimeSelected}
          aria-expanded={isCrimeOpen}
          onClick={onToggleCrimeMenu}
        >
          <IconWrap>
            <MenuIcon type="crime" />
          </IconWrap>
          범죄
          <Chevron $open={isCrimeOpen}>⌃</Chevron>
        </MenuButton>

        {isCrimeOpen && (
          <CrimeOptions aria-label="범죄 레이어 선택">
            {CRIME_OPTIONS.map((item) => {
              const isActive = selectedMapTypes.includes(item.id);

              return (
                <CrimeChoice
                  type="button"
                  key={item.id}
                  $active={isActive}
                  aria-pressed={isActive}
                  onClick={() => {
                    onToggleLayer(item.id);
                  }}
                >
                  <Dot $active={isActive} />
                  {item.label}
                </CrimeChoice>
              );
            })}
          </CrimeOptions>
        )}

        {MAIN_OPTIONS.slice(2).map((item) => {
          const isActive = selectedMapTypes.includes(item.id);

          return (
            <MenuButton
              type="button"
              key={item.id}
              $active={isActive}
              aria-pressed={isActive}
              onClick={() => {
                onToggleLayer(item.id);
              }}
            >
              <IconWrap>
                <MenuIcon type={item.icon} />
              </IconWrap>
              {item.label}
              <ChoiceIndicator $active={isActive} />
            </MenuButton>
          );
        })}
      </Menu>
    </>
  );
}
