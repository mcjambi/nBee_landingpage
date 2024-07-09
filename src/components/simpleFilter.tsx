import { IndexFilters, IndexFiltersProps, useSetIndexFiltersMode } from '@shopify/polaris';
import helpers from 'helpers/index';
import __ from 'languages/index';
import { useCallback, useEffect, useMemo, useState } from 'react';

/**
 * @label string
 * @value string
 */
type TypedOptionFilter = {
  label: string;
  value: string | (() => void);
  field?: string;
};

type TypedSort = {
  label: string;
  field: string;
};

/**
 * simple filter module for many entity
 * @onCallback callback when some button is click
 * @loading boolean
 * @options TypedOptionFilter[]
 * @sortField TypedSort , default is createdDate
 */

export default function SimpleFilter({
  onCallback,
  loading,
  options,
  sortField,
}: {
  onCallback: (output: any) => void;
  options: TypedOptionFilter[];
  loading: boolean;
  sortField: TypedSort[];
}) {
  let mainQuery: any = helpers.ExtractUrl(window.location.search) || false;
  const { sort, query } = mainQuery;
  const [sortSelected, setSortSelected] = useState<string[]>([helpers.colonToOldSort(sort) || 'createdAt, desc']);
  const [queryValue, setQueryValue] = useState<string>(query);
  const [selected, setSelected] = useState(0);

  const handleSelectedChange = useCallback((field: string, _value: string | (() => void)) => {
    if (typeof _value === 'function') {
      _value.call(this, null);
      setSelected(0); // reset nút active, nếu không cóa thì không thể nào mà nó hoạt động ý
    } else {
      onCallback({ [field]: _value, page: 1 });
    }
  }, []);

  const searchHandleCallback = useCallback((value: string) => {
    onCallback({ query: value, page: 1 });
  }, []);

  const itemStrings = [...[{ label: 'Tất cả', value: '0', field: '' }], ...options];
  const changeTabFilterAction = (index: number) => {
    if (index === 0) {
      onCallback(false);
    } else {
      handleSelectedChange(itemStrings[index]?.field, itemStrings[index]?.value);
    }
  };

  const tabs: any = itemStrings.map((item, index) => ({
    content: item.label,
    index,
    onAction: () => {
      changeTabFilterAction(index);
    },
    id: `${item.label}-${index}`,
    isLocked: index === 0,
    actions: [],
  }));

  // const { mode, setMode } = useSetIndexFiltersMode(IndexFiltersMode.Filtering); // default search field
  const { mode, setMode } = useSetIndexFiltersMode();
  const handleFiltersQueryChange = useCallback((value: string) => {
    setQueryValue(value);
    onChangeCallback(value);
  }, []);

  const onChangeCallback = useMemo(() => helpers.debounce((_value) => searchHandleCallback?.call(this, _value), 800), []);

  const handleQueryValueRemove = useCallback(() => {
    setQueryValue('');
    searchHandleCallback('');
  }, []);

  const handleFiltersClearAll = useCallback(() => {
    handleQueryValueRemove();
  }, [handleQueryValueRemove]);

  const [sortOptions, setSortOptions] = useState<IndexFiltersProps['sortOptions']>([
    { label: 'Ngày tạo', value: 'createdAt, asc', directionLabel: __('ascending') },
    { label: 'Ngày tạo', value: 'createdAt, desc', directionLabel: __('descending') },
  ]);

  useEffect(() => {
    let _s: any[] = sortOptions;
    if (sortField) {
      for (let s of sortField) {
        _s = [
          ..._s,
          ...[
            {
              label: s.label || '_',
              value: s.field + `, asc`,
              directionLabel: __('ascending'),
            },
            {
              label: s.label || '_',
              value: s.field + `, desc`,
              directionLabel: __('descending'),
            },
          ],
        ];
      }
      setSortOptions(_s);
    }
  }, [sortField]);

  useEffect(() => {
    if (!sortSelected) return;
    let sortString = '';
    if (Array.isArray(sortSelected)) {
      sortString = sortSelected.join('');
    } else {
      sortString = sortSelected;
    }
    onCallback({ sort: helpers.oldSortToColon(sortString) });
  }, [sortSelected]);

  return (
    <IndexFilters
      sortOptions={sortOptions}
      sortSelected={sortSelected}
      queryValue={queryValue}
      queryPlaceholder={__('search')}
      onQueryChange={handleFiltersQueryChange}
      onQueryClear={handleFiltersClearAll}
      onSort={setSortSelected}
      loading={loading || false}
      cancelAction={{
        onAction: () => {},
        disabled: false,
        loading: false,
      }}
      tabs={tabs}
      selected={selected}
      onSelect={setSelected}
      canCreateNewView={false}
      onCreateNewView={null}
      onClearAll={handleFiltersClearAll}
      mode={mode}
      setMode={setMode}
      filters={[]}
    />
  );
}
