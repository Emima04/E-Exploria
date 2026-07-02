import React from "react";

interface InputFieldProps {
  label: string;
  type?: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type = "text",
  name,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-cyan-300 text-sm tracking-widest uppercase">
        {label}
      </label>

      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="
          w-full
          rounded-xl
          border
          border-cyan-500/40
          bg-white/5
          px-4
          py-3
          text-white
          placeholder:text-gray-400
          backdrop-blur-lg
          outline-none
          focus:border-cyan-300
          focus:ring-2
          focus:ring-cyan-500/30
          transition-all
        "
      />
    </div>
  );
};

export default InputField;