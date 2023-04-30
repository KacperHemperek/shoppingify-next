import classnames from 'classnames';
import { motion } from 'framer-motion';
import React from 'react';

export default function Checkbox({
  checked,
  newValue,
  wrapperClassName,
  setChecked,
  disabled = false,
}: {
  checked: boolean;
  wrapperClassName?: string;
  newValue?: boolean;
  setChecked?: (value: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label className={classnames('relative w-min', wrapperClassName)}>
      <input
        type="checkbox"
        defaultChecked={checked}
        className="hide-visually"
        onChange={(e) => {
          e.stopPropagation();
          !disabled && setChecked && setChecked(!!newValue);
        }}
        disabled={disabled}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 40 40"
        className={classnames(
          disabled
            ? 'stroke-neutral-light border-neutral-light cursor-not-allowed'
            : 'stroke-primary border-primary cursor-pointer',
          'w-6 h-6 rounded-md border-2  duration-100 group-focus:outline-4 stroke-[4px]'
        )}
      >
        <motion.path
          animate={{
            pathLength: checked ? 1 : 0,
            opacity: 1,
            transition: { ease: 'easeInOut' },
          }}
          fill="none"
          d="M 7 22
             l 7 8
             20-19"
          stroke-linejoin="round"
        />
      </svg>
    </label>
  );
}
