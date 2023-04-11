import { useCombobox } from 'downshift';
import { useMemo } from 'react';
import type { UseFormRegisterReturn, UseFormSetValue } from 'react-hook-form';

export type DropdownOptionType = {
  id: string;
  value: string;
};
const DropDown = ({
  options,
  value,
  placeholder,
  disabled,
  register,
  setValue,
  inputName,
}: {
  options: DropdownOptionType[];
  inputName: string;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  setValue: UseFormSetValue<any>;
  value: string;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  register: UseFormRegisterReturn<any>;
  placeholder?: string;
  disabled?: boolean;
}) => {
  const {
    getInputProps,
    isOpen,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    onInputValueChange(e) {
      setValue(inputName, e.inputValue || '');
    },
    items: options,
    itemToString(item) {
      return item?.value ?? '';
    },
  });

  const filteredOptions = useMemo<DropdownOptionType[]>(() => {
    if (!value) {
      return options;
    }

    return options.filter((option) =>
      option.value.toLowerCase().includes(value.toLowerCase())
    );
  }, [value, options]);

  const dropdownHidden = !(isOpen && filteredOptions.length > 0);
  const getInputPropsResult = getInputProps();

  return (
    <div className="relative flex w-full flex-col">
      <input
        data-testid="dropdown-input"
        type="text"
        ref={(e) => {
          register.ref(e);
          getInputPropsResult.ref(e);
        }}
        {...getInputPropsResult}
        onChange={(e) => {
          getInputPropsResult.onChange(e);
          register.onChange(e);
        }}
        onBlur={(e) => {
          getInputPropsResult.onBlur(e);
          register.onChange(e);
        }}
        className="input"
        placeholder={placeholder}
        disabled={disabled}
      />

      <ul
        data-testid="dropdown-list"
        {...getMenuProps()}
        className="absolute top-full max-h-[170px] w-full translate-y-3 overflow-y-auto rounded-xl bg-white p-2 shadow-lg"
        hidden={dropdownHidden}
      >
        {filteredOptions.map((option, idx) => (
          <li
            className={`${
              highlightedIndex === idx
                ? 'bg-slate-100 text-black'
                : 'text-neutral'
            } rounded-lg p-4 font-medium transition`}
            key={option.id}
            {...getItemProps({ item: option, index: idx })}
          >
            {option.value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DropDown;
