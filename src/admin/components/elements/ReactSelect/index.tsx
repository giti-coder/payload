import React, { KeyboardEventHandler } from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { useTranslation } from 'react-i18next';
import { arrayMove } from '@dnd-kit/sortable';
import { Props as ReactSelectAdapterProps } from './types';
import Chevron from '../../icons/Chevron';
import { getTranslation } from '../../../../utilities/getTranslation';
import { SingleValue } from './SingleValue';
import { MultiValueLabel } from './MultiValueLabel';
import { MultiValue } from './MultiValue';
import { ValueContainer } from './ValueContainer';
import { ClearIndicator } from './ClearIndicator';
import { MultiValueRemove } from './MultiValueRemove';
import { Control } from './Control';
import DraggableSortable from '../DraggableSortable';
import type { Option } from './types';

import './index.scss';


const createOption = (label: string) => ({
  label,
  value: label,
});



const SelectAdapter: React.FC<ReactSelectAdapterProps> = (props) => {

  const { t, i18n } = useTranslation();

  const {
    className,
    showError,
    options,
    onChange,
    value,
    disabled = false,
    placeholder = t('general:selectValue'),
    isSearchable = true,
    isClearable = true,
    filterOption = undefined,
    isLoading,
    onMenuOpen,
    components,
  } = props;

  const classes = [
    className,
    'react-select',
    showError && 'react-select--error',
  ].filter(Boolean).join(' ');

  const [inputValue, setInputValue] = React.useState('');
  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (!value) return;
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        onChange([...value as Option[], createOption(inputValue)]);
        setInputValue('');
        event.preventDefault();
        break;
      default:
        break;
    }
  };


  if (!isMultiText) {
    return (
      <Select
        isLoading={isLoading}
        placeholder={getTranslation(placeholder, i18n)}
        captureMenuScroll
        {...props}
        value={value}
        onChange={onChange}
        disabled={disabled ? 'disabled' : undefined}
        className={classes}
        classNamePrefix="rs"
        options={options}
        isSearchable={isSearchable}
        isClearable={isClearable}
        filterOption={filterOption}
        onMenuOpen={onMenuOpen}
        menuPlacement="auto"
        selectProps={{
          ...selectProps,
        }}
        components={{
          ValueContainer,
          SingleValue,
          MultiValue,
          MultiValueLabel,
          MultiValueRemove,
          DropdownIndicator: Chevron,
          ClearIndicator,
          Control,
          ...components,
        }}
      />
    );
  }
  return (
    <CreatableSelect
      isLoading={isLoading}
      placeholder={getTranslation(placeholder, i18n)}
      captureMenuScroll
      {...props}
      value={value}
      onChange={onChange}
      isDisabled={disabled}
      className={classes}
      classNamePrefix="rs"
      options={options}
      isSearchable={isSearchable}
      isClearable={isClearable}
      filterOption={filterOption}
      onMenuOpen={onMenuOpen}
      menuPlacement="auto"
      inputValue={inputValue}
      onInputChange={(newValue) => setInputValue(newValue)}
      onKeyDown={handleKeyDown}
      components={{
        ValueContainer,
        SingleValue,
        MultiValue,
        MultiValueLabel,
        MultiValueRemove,
        DropdownIndicator: Chevron,
        ClearIndicator,
        Control,
        ...components,
      }}
    />
  );
};

const SortableSelect: React.FC<ReactSelectAdapterProps> = (props) => {
  const {
    onChange,
    value,
  } = props;

  let ids: string[] = [];
  if (value) ids = Array.isArray(value) ? value.map((item) => item?.value as string) : [value?.value as string]; // TODO: fix these types

  return (
    <DraggableSortable
      ids={ids}
      className="react-select-container"
      onDragEnd={({ moveFromIndex, moveToIndex }) => {
        let sorted = value;
        if (value && Array.isArray(value)) {
          sorted = arrayMove(value, moveFromIndex, moveToIndex);
        }
        onChange(sorted);
      }}
    >
      <SelectAdapter {...props} />
    </DraggableSortable>
  );
};

const ReactSelect: React.FC<ReactSelectAdapterProps> = (props) => {
  const {
    isMulti,
    isSortable,
  } = props;

  if (isMulti && isSortable) {
    return (
      <SortableSelect {...props} />
    );
  }

  return (
    <SelectAdapter {...props} />
  );
};

export default ReactSelect;
