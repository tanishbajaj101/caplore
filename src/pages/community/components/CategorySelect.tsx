import { useState, useRef, useEffect } from "react";
import { CommunityIcon } from "./CommunityIcon";

type Option = {
  value: string;
  label: string;
};

type CategorySelectProps = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
};

export function CategorySelect({ options, value, onChange }: CategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="custom-select-container" ref={containerRef}>
      <button 
        type="button"
        className={`custom-select-button ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{selectedOption.label}</span>
        <CommunityIcon name="chevron" size={14} />
      </button>

      {isOpen && (
        <ul className="custom-select-dropdown" role="listbox">
          {options.map((option) => (
            <li 
              key={option.value}
              className={`custom-select-option ${option.value === value ? "selected" : ""}`}
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
              {option.value === value && <CommunityIcon name="check" size={14} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
