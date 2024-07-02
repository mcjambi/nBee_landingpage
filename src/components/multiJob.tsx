import React, { memo, useMemo, useState, useCallback, useEffect } from 'react';
import job_title from 'config/job.title.json';
import { LegacyStack, Tag, EmptySearchResult, AutoSelection, Text, Listbox, Combobox } from '@shopify/polaris';
import helpers from 'helpers/index';

export default memo(function MultiJob({ onClose, current_value }: { onClose?: (selected: string[]) => void; current_value?: string[] }) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  /** default value ... */
  useEffect(() => {
    let defaultValue = [];
    if (current_value)
      for (let code of current_value) {
        if (typeof job_title[code] !== 'undefined') defaultValue.push(job_title[code]);
      }
    setSelectedTags(defaultValue);
  }, [current_value]);

  const [value, setValue] = useState('');
  const [suggestion, setSuggestion] = useState('');

  const handleActiveOptionChange = useCallback(
    (activeOption: string) => {
      const activeOptionIsAction = activeOption === value;

      if (!activeOptionIsAction && !selectedTags.includes(activeOption)) {
        setSuggestion(activeOption);
      } else {
        setSuggestion('');
      }
    },
    [value, selectedTags]
  );
  const updateSelection = useCallback(
    (selected: string) => {
      const nextSelectedTags = new Set([...selectedTags]);

      if (nextSelectedTags.has(selected)) {
        nextSelectedTags.delete(selected);
      } else {
        nextSelectedTags.add(selected);
      }
      setSelectedTags([...nextSelectedTags]);
      onChangeMainQueryCallback([...nextSelectedTags]);
      setValue('');
      setSuggestion('');
    },
    [selectedTags]
  );

  const removeTag = useCallback(
    (tag: string) => () => {
      updateSelection(tag);
    },
    [updateSelection]
  );

  const getAllTags = useCallback(() => {
    const savedTags = [];
    Object.values(job_title).forEach((element) => {
      savedTags.push(element);
    });
    return [...new Set([...savedTags, ...selectedTags].sort())];
  }, [selectedTags]);

  const formatOptionText = useCallback(
    (option: string) => {
      const trimValue = value.trim().toLocaleLowerCase();
      const matchIndex = option.toLocaleLowerCase().indexOf(trimValue);

      if (!value || matchIndex === -1) return option;

      const start = option.slice(0, matchIndex);
      const highlight = option.slice(matchIndex, matchIndex + trimValue.length);
      const end = option.slice(matchIndex + trimValue.length, option.length);

      return (
        <p>
          {start}
          <Text fontWeight="bold" as="span">
            {highlight}
          </Text>
          {end}
        </p>
      );
    },
    [value]
  );

  const options = useMemo(() => {
    let list: any;
    const allTags = getAllTags();
    const filterRegex = new RegExp(value, 'i');

    if (value) {
      list = allTags.filter((tag) => tag.match(filterRegex));
    } else {
      list = allTags;
    }

    return [...list];
  }, [value, getAllTags]);

  /**
   * work on remove tag
   * Delay...
   */
  const onChangeMainQueryCallback = useMemo(() => {
    return helpers.debounce((selectedTags) => {
      onCloseCallback?.call(this, selectedTags);
    }, 1000);
  }, []);
  const onCloseCallback = useCallback((selectedTags) => {
    let exportValue = [];
    for (let tagname of selectedTags) {
      for (let i in job_title) {
        let key = job_title[i];
        if (key === tagname) exportValue.push(i);
      }
    }
    onClose(exportValue);
  }, []);

  const verticalContentMarkup =
    selectedTags.length > 0 ? (
      <LegacyStack spacing="extraTight" alignment="center">
        {selectedTags.map((tag) => (
          <Tag key={`option-${tag}`} onRemove={removeTag(tag)}>
            {tag}
          </Tag>
        ))}
      </LegacyStack>
    ) : null;

  const optionMarkup =
    options.length > 0
      ? options.map((option) => {
          return (
            <Listbox.Option key={option} value={option} selected={selectedTags.includes(option)} accessibilityLabel={option}>
              <Listbox.TextOption selected={selectedTags.includes(option)}>{formatOptionText(option)}</Listbox.TextOption>
            </Listbox.Option>
          );
        })
      : null;

  const noResults = value && !getAllTags().includes(value);

  const actionMarkup = noResults ? <Listbox.Action value={value}>{`Add "${value}"`}</Listbox.Action> : null;

  const emptyStateMarkup = optionMarkup ? null : <EmptySearchResult title="" description={`No tags found matching "${value}"`} />;

  const listboxMarkup =
    optionMarkup || actionMarkup || emptyStateMarkup ? (
      <Listbox autoSelection={AutoSelection.None} onSelect={updateSelection} onActiveOptionChange={handleActiveOptionChange}>
        {actionMarkup}
        {optionMarkup}
      </Listbox>
    ) : null;

  return (
    <Combobox
      allowMultiple
      activator={
        <Combobox.TextField
          autoComplete="off"
          label="Nghề nghiệp chính"
          value={value}
          suggestion={suggestion}
          placeholder="Tìm một ngành"
          verticalContent={verticalContentMarkup}
          onChange={setValue}
        />
      }
      // onClose={onCloseCallback}
    >
      {listboxMarkup}
    </Combobox>
  );
});
