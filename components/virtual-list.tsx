'use client';

import { forwardRef, useCallback, useImperativeHandle, useRef, useState, type HTMLAttributes, type ReactNode, type UIEvent } from 'react';

export type VirtualListHandle = {
  /** Scrolls just enough to bring row `index` into view. */
  scrollToIndex: (index: number) => void;
  resetScroll: () => void;
};

type VirtualListProps<T> = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onScroll'> & {
  items: T[];
  /** Every row must be exactly this tall (px). */
  rowHeight: number;
  /** Height of the scroll box (px). Shrinks to fit when there are fewer rows. */
  height: number;
  /** Extra rows rendered above and below the visible window, so fast scrolling doesn't flash blank. */
  overscan?: number;
  getKey: (item: T, index: number) => string;
  renderRow: (item: T, index: number) => ReactNode;
};

/**
 * Renders only the rows in view (plus `overscan`) inside a fixed-height scroll box,
 * so a long list costs the same as a short one. Rows are absolutely positioned.
 */
function VirtualListInner<T>({ items, rowHeight, height, overscan = 6, getKey, renderRow, style, ...rest }: VirtualListProps<T>, ref: React.Ref<VirtualListHandle>) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const boxHeight = Math.min(height, items.length * rowHeight);

  useImperativeHandle(ref, () => ({
    scrollToIndex(index) {
      const box = boxRef.current;
      if (!box) return;
      const top = index * rowHeight;
      if (top < box.scrollTop) box.scrollTop = top;
      else if (top + rowHeight > box.scrollTop + box.clientHeight) box.scrollTop = top + rowHeight - box.clientHeight;
    },
    resetScroll() {
      if (boxRef.current) boxRef.current.scrollTop = 0;
      setScrollTop(0);
    },
  }), [rowHeight]);

  const handleScroll = useCallback((event: UIEvent<HTMLDivElement>) => setScrollTop(event.currentTarget.scrollTop), []);

  const first = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const last = Math.min(items.length, Math.ceil((scrollTop + boxHeight) / rowHeight) + overscan);
  const rows: ReactNode[] = [];
  for (let index = first; index < last; index += 1) {
    const item = items[index];
    rows.push(<div key={getKey(item, index)} style={{ position: 'absolute', top: index * rowHeight, left: 0, right: 0, height: rowHeight }}>{renderRow(item, index)}</div>);
  }

  return <div ref={boxRef} onScroll={handleScroll} style={{ ...style, height: boxHeight, overflowY: 'auto', position: 'relative' }} {...rest}>
    <div style={{ height: items.length * rowHeight, position: 'relative' }}>{rows}</div>
  </div>;
}

export const VirtualList = forwardRef(VirtualListInner) as <T>(props: VirtualListProps<T> & { ref?: React.Ref<VirtualListHandle> }) => ReturnType<typeof VirtualListInner>;
