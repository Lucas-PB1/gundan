import { useEffect, useState } from 'react';
import { inputClass } from './Field';

const CUSTOM_VALUE = '__custom__';

export function OptionSelect({
  options,
  value,
  onChange,
  placeholder = 'Selecione…',
}: {
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const inList = value !== '' && options.includes(value);
  const [customMode, setCustomMode] = useState(!inList && value !== '');

  useEffect(() => {
    if (value === '') {
      setCustomMode(false);
      return;
    }
    if (!options.includes(value)) setCustomMode(true);
  }, [value, options]);

  const selectValue = customMode ? CUSTOM_VALUE : inList ? value : '';

  return (
    <div className="flex flex-col gap-2">
      <select
        className={`${inputClass} hud-select cursor-pointer`}
        value={selectValue}
        onChange={(e) => {
          const next = e.target.value;
          if (next === CUSTOM_VALUE) {
            setCustomMode(true);
            if (inList) onChange('');
            return;
          }
          setCustomMode(false);
          onChange(next);
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
        <option value={CUSTOM_VALUE}>Personalizado…</option>
      </select>
      {customMode && (
        <input
          className={inputClass}
          value={value}
          placeholder="Descreva o seu…"
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}
