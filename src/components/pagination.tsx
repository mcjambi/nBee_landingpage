import React, { useCallback, useState, memo } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@shopify/polaris-icons';
import { useMemo } from 'react';
import { ActionList, Button, InlineStack, Icon, Popover, Text } from '@shopify/polaris';

export const DOTS = '...';

const range = (start: number, end: number) => {
  let length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

export const usePagination = ({ TotalRecord, pageSize = 20, siblingCount = 1, activeCurrentPage = 1 }) => {
  const paginationRange = useMemo(() => {
    const totalPageCount = Math.ceil(TotalRecord / pageSize);

    // Pages count is determined as siblingCount + firstPage + lastPage + activeCurrentPage + 2*DOTS
    const totalPageNumbers = siblingCount + 5;

    /*
        Case 1:
        If the number of pages is less than the page numbers we want to show in our
        paginationComponent, we return the range [1..totalPageCount]
      */
    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }

    /*
          Calculate left and right sibling index and make sure they are within range 1 and totalPageCount
      */
    const leftSiblingIndex = Math.max(activeCurrentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(activeCurrentPage + siblingCount, totalPageCount);

    /*
        We do not show dots just when there is just one page number to be inserted between the extremes of sibling and the page limits i.e 1 and totalPageCount. Hence we are using leftSiblingIndex > 2 and rightSiblingIndex < totalPageCount - 2
      */
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    /*
          Case 2: No left dots to show, but rights dots to be shown
      */
    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = range(1, leftItemCount);

      return [...leftRange, DOTS, totalPageCount];
    }

    /*
          Case 3: No right dots to show, but left dots to be shown
      */
    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = range(totalPageCount - rightItemCount + 1, totalPageCount);
      return [firstPageIndex, DOTS, ...rightRange];
    }

    /*
          Case 4: Both left and right dots to be shown
      */
    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }
  }, [TotalRecord, pageSize, siblingCount, activeCurrentPage]);

  return paginationRange;
};

/**
 * Display pagination page but in block
 */
export default function Pagination({
  TotalRecord,
  pageSize,
  siblingCount = 1,
  activeCurrentPage,
  onChange,
}: {
  TotalRecord: number;
  pageSize: number;
  siblingCount?: number;
  activeCurrentPage: number;
  onChange: (pageNum: number, limit: number) => void;
}) {
  const [selectNumberofRecord, setSelectNumberofRecord] = useState(false);
  const togglePopoverActive = useCallback(() => setSelectNumberofRecord((popoverActive) => !popoverActive), []);
  const [currentNumberOfRecord, setCurrentNumberOfRecord] = useState<string>(`${pageSize}`);
  const setCurrentNumberOfRecordCallback = useCallback((newNumm: string) => {
    setSelectNumberofRecord(false);
    setCurrentNumberOfRecord(newNumm);
    onChange(1, Number(newNumm));
  }, []);

  const onChangePage = useCallback(
    (pageNum: number | string) => {
      onChange(Number(pageNum), Number(currentNumberOfRecord));
    },
    [currentNumberOfRecord]
  );

  const paginationRange = usePagination({
    activeCurrentPage,
    TotalRecord,
    siblingCount,
    pageSize,
  });

  if (!paginationRange) return;

  // If there are less than 2 times in pagination range we shall not render the component
  if (activeCurrentPage === 0 || paginationRange.length < 2) {
    return null;
  }
  let lastPage = paginationRange[paginationRange.length - 1];

  function onNext() {
    if (activeCurrentPage === lastPage) return null;
    onChangePage(activeCurrentPage + 1);
  }

  function onPrevious() {
    if (activeCurrentPage === 1) return null;
    onChangePage(activeCurrentPage - 1);
  }

  return (
    <div className="paginationtable_wrap">
      <InlineStack wrap={false} align="start" blockAlign="center" gap={'200'}>
        <Text as="span" variant="bodySm" tone="subdued">
          Hiển thị
        </Text>{' '}
        {'  '}
        <Popover
          active={selectNumberofRecord}
          activator={
            <Button onClick={togglePopoverActive} disclosure variant="plain">
              {currentNumberOfRecord}
            </Button>
          }
          autofocusTarget="first-node"
          onClose={togglePopoverActive}
        >
          <ActionList
            actionRole="menuitem"
            items={[
              {
                content: '20',
                onAction: () => setCurrentNumberOfRecordCallback('20'),
              },
              {
                content: '50',
                onAction: () => setCurrentNumberOfRecordCallback('50'),
              },
              {
                content: '100',
                onAction: () => setCurrentNumberOfRecordCallback('100'),
              },
              {
                content: '200',
                onAction: () => setCurrentNumberOfRecordCallback('200'),
              },
            ]}
          />
        </Popover>
        <Text as="span" variant="bodySm" tone="subdued">
          {' '}
          {currentNumberOfRecord}/ tổng {TotalRecord}{' '}
        </Text>
        <div className={`paginationtable_item ` + (activeCurrentPage === 1 ? 'disabled' : '')} onClick={onPrevious} key="on_prev_pagination">
          <span className="arrow left">
            {' '}
            <Icon source={ChevronLeftIcon} tone="base" />{' '}
          </span>
        </div>
        {paginationRange?.map((pageNumber, index) => {
          // If the pageItem is a DOT, render the DOTS unicode character
          if (pageNumber === DOTS) {
            return (
              <div key={'hd_' + index} className="paginationtable_item dots">
                <a>&#8230;</a>
              </div>
            );
          }
          // Render our Page Pills
          return (
            <div
              className={`paginationtable_item ` + (pageNumber === activeCurrentPage ? 'active' : '')}
              onClick={() => onChangePage(pageNumber)}
              key={'A989_' + index}
            >
              <a>{pageNumber}</a>
            </div>
          );
        })}
        {/*  Right Navigation arrow */}
        <div className={`paginationtable_item ` + (activeCurrentPage === lastPage ? 'disabled' : '')} onClick={onNext} key="on_next_pagination">
          <span className="arrow right">
            {' '}
            <Icon source={ChevronRightIcon} tone="base" />{' '}
          </span>
        </div>
      </InlineStack>
    </div>
  );
}
