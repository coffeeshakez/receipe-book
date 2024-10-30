interface DropdownProps {
  label: string;
  options: { label: string; value: number }[];
  onSelect: (value: number) => void;
  disabled?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({ label, options, onSelect, disabled }) => {
  return (
    <div className="dropdown">
      <select 
        onChange={(e) => onSelect(Number(e.target.value))}
        disabled={disabled}
        defaultValue=""
      >
        <option value="" disabled>{label}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}; 