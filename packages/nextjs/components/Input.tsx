import React, { FC, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  name?: string;
}

const Input: FC<InputProps> = ({ placeholder, name, ...rest }) => {
  return (
    <input
      className="h-[50px] rounded-lg bg-carina-deep-light text-primary px-4 py-2"
      placeholder={placeholder}
      name={name}
      {...rest} // Spread the rest of the props
    />
  );
};

export default Input;
