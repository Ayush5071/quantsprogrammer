import React from 'react';

export const CheckBox = ({
  content,
  isChecked,
  onChange,
}: {
  content: string;
  isChecked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className="space-y-1">
      <label
        htmlFor={content}
        className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition"
      >
        <div className="relative flex items-center">
          <input
            type="checkbox"
            id={content}
            checked={isChecked}
            onChange={onChange}
            className="h-6 w-6 appearance-none rounded border-2 border-gray-300 checked:bg-green-600"
          />
          {isChecked && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="white"
              className="h-4 w-4 absolute left-1.5 top-1.5"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
        <div>
          <p className="text-neutral-200 text-base md:text-lg font-medium mb-1 mt-1 text-pretty">
            {content}
          </p>
        </div>
      </label>
    </div>
  );
};
