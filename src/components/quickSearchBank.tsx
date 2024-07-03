import React, { useEffect } from 'react';
import bankList from 'config/bank_list.json';
import { Autocomplete, Icon } from '@shopify/polaris';
import { SearchIcon } from '@shopify/polaris-icons';
import { useState, useCallback, useMemo } from 'react';

export default function QuickSearchBank({ current_bank_id, onClose }: { current_bank_id?: string; onClose?: (bank_id: string) => void }) {
  const deselectedOptions = useMemo(() => {
    return bankList.map((el) => {
      return {
        value: el.shortName,
        label: el.name,
      };
    });
  }, []);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(['MBBank']);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState(deselectedOptions);

  useEffect(() => {
    if (current_bank_id) {
      let [currentData] = deselectedOptions.filter((el) => el.value === current_bank_id);
      setInputValue(currentData.label);
    }
  }, [current_bank_id]);

  const updateText = useCallback(
    (value: string) => {
      setInputValue(value);

      if (value === '') {
        setOptions(deselectedOptions);
        return;
      }

      const filterRegex = new RegExp(value, 'i');
      const resultOptions = deselectedOptions.filter((option) => option.label.match(filterRegex));
      setOptions(resultOptions);
    },
    [deselectedOptions]
  );

  const updateSelection = useCallback(
    (selected: string[]) => {
      const selectedValue = selected.map((selectedItem) => {
        const matchedOption = options.find((option) => {
          return option.value.match(selectedItem);
        });
        return matchedOption && matchedOption.label;
      });

      setSelectedOptions(selected);
      setInputValue(selectedValue[0] || '');
      onClose(selected[0]); // call back
    },
    [options]
  );

  const textField = (
    <Autocomplete.TextField
      onChange={updateText}
      label="Chọn ngân hàng"
      value={inputValue}
      prefix={<Icon source={SearchIcon} tone="base" />}
      placeholder="Search"
      autoComplete="off"
    />
  );

  return <Autocomplete options={options} selected={selectedOptions} onSelect={updateSelection} textField={textField} />;
}
