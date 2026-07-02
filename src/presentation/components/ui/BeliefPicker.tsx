import { useState } from 'react';
import { HudModal } from './HudModal';
import { NARRATIVE_PICKER_COPY } from '../../../shared/data/beamSaberNarrativeExamples';

export function BeliefPickerButton({
  suggestions,
  onPick,
}: {
  suggestions: readonly string[];
  onPick: (belief: string) => void;
}) {
  const [open, setOpen] = useState(false);

  if (suggestions.length === 0) return null;

  return (
    <>
      <button
        type="button"
        className="belief-picker-btn hud-btn"
        onClick={() => setOpen(true)}
      >
        {NARRATIVE_PICKER_COPY.choose}
      </button>
      <HudModal open={open} title="Exemplos de crenças" onClose={() => setOpen(false)}>
        <ul className="narrative-picker__list">
          {suggestions.map((belief) => (
            <li key={belief}>
              <button
                type="button"
                className="narrative-picker__option"
                onClick={() => {
                  onPick(belief);
                  setOpen(false);
                }}
              >
                <span>{belief}</span>
                <span className="narrative-picker__use">{NARRATIVE_PICKER_COPY.useText}</span>
              </button>
            </li>
          ))}
        </ul>
      </HudModal>
    </>
  );
}
