import { useRef } from "react";

export default function PinInput({ value, onChange }) {
  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/\D/g, "");
    if (!val) return;

    const newValue = value.split("");
    newValue[index] = val[0];
    onChange(newValue.join(""));

    // Move to next input
    if (index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newValue = value.split("");
      newValue[index] = "";
      onChange(newValue.join(""));

      // Move back if empty
      if (!value[index] && index > 0) inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-6 justify-start">
      {[...Array(4)].map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          type="password"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="w-12 h-12 text-center text-lg border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary outline-none"
        />
      ))}
    </div>
  );
}
