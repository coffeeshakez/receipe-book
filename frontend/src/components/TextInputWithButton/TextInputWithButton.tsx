import React, {useState} from 'react';
import './TextInputWithButton.module.scss';

type TextInputWithButtonProps = {
  buttonText: string;
  placeholder: string;
  onClick: (inputValue: string) => void;
};

export const TextInpuWithButton = ({buttonText, placeholder, onClick}: TextInputWithButtonProps) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length < 1) return;
    setInputValue(event.target.value);
  };

  const handleButtonClick = () => {
    if (inputValue.length < 1) return;
    onClick(inputValue);
    setInputValue('');
    inputRef.current?.focus();
  };

  return (
    <div className="input-container">
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        aria-label="Add items to grocery list"
      />
      <button onClick={handleButtonClick} className="input-button">
        {buttonText}
      </button>
    </div>
  );
};

export default TextInpuWithButton;
