import React from 'react';
import './TextInputWithButton.module.scss';

type TextInputWithButtonProps = {
  buttonText: string;
  placeholder: string;
  onClick: () => void;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const TextInputWithButton = ({
  buttonText,
  placeholder,
  onClick,
  value,
  onChange
}: TextInputWithButtonProps) => {
  const handleButtonClick = () => {
    if (value.length < 1) return;
    onClick();
  };

  return (
    <div className="input-container">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-label="Add items to grocery list"
      />
      <button onClick={handleButtonClick} className="input-button">
        {buttonText}
      </button>
    </div>
  );
};

export default TextInputWithButton;
