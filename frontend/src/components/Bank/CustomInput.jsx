import React from 'react';
import { useController } from 'react-hook-form';

const CustomInput = ({ control, name, label, placeholder }) => {
  const {
    field,
    formState: { errors },
  } = useController({ name, control });

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <input
          id={name}
          name={name}
          placeholder={placeholder}
          type={name === 'password' ? 'password' : 'text'}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          {...field}
        />
        {errors[name] && (
          <p className="text-red-500 text-xs mt-2">{errors[name]?.message}</p>
        )}
      </div>
    </div>
  );
};

export default CustomInput;
