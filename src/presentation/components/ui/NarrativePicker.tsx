import { useMemo, useState } from 'react';
import { inputClass } from './Field';
import { HudModal } from './HudModal';
import {
  formatHistoryValue,
  getNarrativeCategories,
  getNarrativeExamples,
  NARRATIVE_PICKER_COPY,
  parseHistoryValue,
  type NarrativePickerKind,
} from '../../../shared/data/beamSaberNarrativeExamples';

export function NarrativePicker({
  kind,
  value,
  onChange,
  modalTitle,
}: {
  kind: NarrativePickerKind;
  value: string;
  onChange: (value: string) => void;
  modalTitle: string;
}) {
  const categories = getNarrativeCategories(kind);
  const parsedHistory = useMemo(
    () => (kind === 'history' ? parseHistoryValue(value) : null),
    [kind, value],
  );

  const [open, setOpen] = useState(false);
  const [customMode, setCustomMode] = useState(
    () => value !== '' && !categories.includes(value as (typeof categories)[number]) && !parsedHistory,
  );
  const [historyCategory, setHistoryCategory] = useState<string | null>(parsedHistory?.category ?? null);

  const selectValue = useMemo(() => {
    if (customMode) return '__custom__';
    if (kind === 'history' && parsedHistory) return parsedHistory.category;
    if (categories.includes(value as (typeof categories)[number])) return value;
    return '';
  }, [customMode, kind, parsedHistory, categories, value]);

  const openExamples = (category: string) => {
    setHistoryCategory(category);
    setOpen(true);
  };

  const openListModal = () => {
    setHistoryCategory(null);
    setOpen(true);
  };

  const handleCategoryChange = (category: string) => {
    if (!category) {
      onChange('');
      setCustomMode(false);
      return;
    }
    if (kind === 'history') {
      openExamples(category);
      return;
    }
    onChange(category);
    setCustomMode(false);
    setOpen(true);
  };

  const applyExample = (text: string) => {
    if (kind === 'history' && historyCategory) {
      onChange(formatHistoryValue(historyCategory, text));
    } else {
      onChange(text);
    }
    setCustomMode(false);
    setOpen(false);
  };

  const modalExamples = historyCategory
    ? getNarrativeExamples(kind, historyCategory)
    : kind === 'history'
      ? []
      : getNarrativeExamples(kind, '');

  const preview = value.trim() || 'Nenhum texto escolhido ainda.';

  return (
    <div className="narrative-picker">
      <select
        className={`${inputClass} hud-select cursor-pointer`}
        value={selectValue}
        onChange={(e) => {
          const next = e.target.value;
          if (next === '__custom__') {
            setCustomMode(true);
            if (!customMode) onChange('');
            return;
          }
          handleCategoryChange(next);
        }}
      >
        <option value="">Selecione…</option>
        {categories.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
        <option value="__custom__">{NARRATIVE_PICKER_COPY.customize}…</option>
      </select>

      <div className="narrative-picker__preview hud-info-box">
        <p className="narrative-picker__preview-text">{preview}</p>
        <div className="narrative-picker__actions">
          <button type="button" className="hud-btn hud-btn--primary" onClick={openListModal}>
            {NARRATIVE_PICKER_COPY.choose}
          </button>
          {value && (
            <button
              type="button"
              className="hud-btn"
              onClick={() => {
                onChange('');
                setCustomMode(false);
              }}
            >
              {NARRATIVE_PICKER_COPY.clear}
            </button>
          )}
        </div>
      </div>

      {customMode && (
        <textarea
          className={inputClass}
          rows={3}
          value={value}
          placeholder={NARRATIVE_PICKER_COPY.customPlaceholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      <HudModal
        open={open}
        title={modalTitle}
        onClose={() => setOpen(false)}
      >
        {kind === 'history' && !historyCategory ? (
          <div className="narrative-picker__grid">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className="narrative-picker__choice"
                onClick={() => setHistoryCategory(category)}
              >
                <strong>{category}</strong>
                <span>{getNarrativeExamples('history', category)[0]}</span>
              </button>
            ))}
          </div>
        ) : (
          <>
            {kind === 'history' && historyCategory && (
              <button
                type="button"
                className="narrative-picker__back hud-btn mb-3"
                onClick={() => setHistoryCategory(null)}
              >
                ← {NARRATIVE_PICKER_COPY.back}: {historyCategory}
              </button>
            )}
            <ul className="narrative-picker__list">
              {modalExamples.map((example) => (
                <li key={example}>
                  <button
                    type="button"
                    className={`narrative-picker__option ${
                      value === example ||
                      (kind === 'history' &&
                        historyCategory &&
                        value === formatHistoryValue(historyCategory, example))
                        ? 'narrative-picker__option--active'
                        : ''
                    }`}
                    onClick={() => applyExample(example)}
                  >
                    <span>{example}</span>
                    <span className="narrative-picker__use">{NARRATIVE_PICKER_COPY.useText}</span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </HudModal>
    </div>
  );
}
