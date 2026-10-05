"use client";

import { useCallback, useRef } from "react";

const CODE_LABELS = [
  "Premier chiffre",
  "Deuxième chiffre",
  "Troisième chiffre",
  "Quatrième chiffre",
  "Cinquième chiffre",
  "Sixième chiffre",
];

type Props = {
  digits: string[];
  onChange: (digits: string[]) => void;
  disabled?: boolean;
  id?: string;
};

export function SignupCodeInputs({ digits, onChange, disabled, id }: Props) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const setDigit = useCallback(
    (index: number, value: string) => {
      const next = [...digits];
      next[index] = value;
      onChange(next);
    },
    [digits, onChange],
  );

  const applyDigits = useCallback(
    (chars: string[], startIndex = 0) => {
      const next = [...digits];
      chars.forEach((ch, i) => {
        const pos = startIndex + i;
        if (pos < 6) next[pos] = ch;
      });
      onChange(next);
      const focusIndex = Math.min(startIndex + chars.length, 5);
      refs.current[focusIndex]?.focus();
    },
    [digits, onChange],
  );

  return (
    <div className="fd-code-boxes" id={id} aria-label="Code à six chiffres">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            refs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={digit}
          disabled={disabled}
          aria-label={CODE_LABELS[index]}
          onChange={(event) => {
            const raw = event.target.value.replace(/\D/g, "");
            if (raw.length > 1) {
              applyDigits(raw.slice(0, 6 - index).split(""), index);
              return;
            }
            setDigit(index, raw.slice(-1));
            if (raw && refs.current[index + 1]) refs.current[index + 1]?.focus();
          }}
          onKeyDown={(event) => {
            if (event.key === "Backspace" && !digit && index > 0) {
              refs.current[index - 1]?.focus();
            }
          }}
          onPaste={(event) => {
            event.preventDefault();
            const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
            if (pasted.length > 0) applyDigits(pasted.split(""), index);
          }}
        />
      ))}
    </div>
  );
}
