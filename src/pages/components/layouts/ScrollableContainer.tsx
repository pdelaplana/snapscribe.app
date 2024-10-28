import type { PropsWithChildren } from 'react';
import React from 'react';

interface ScrollableContainerProps extends PropsWithChildren {
  height?: string;
}

const ScrollableContainer: React.FC<ScrollableContainerProps> = ({ height = '70dvh', children }) => {

  return (
    <div style={{height: height, overflowY: 'scroll'  }}>
      {children}
    </div>
  );
};

export default ScrollableContainer;
