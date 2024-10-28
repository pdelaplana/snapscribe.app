import type { PropsWithChildren } from 'react';
import React from 'react';

interface BottomContainerProps extends PropsWithChildren {

}

const BottomContainer: React.FC<BottomContainerProps> = ({children}) => {

  const bottomFixedStyle = {
    position: 'fixed',
    bottom: '0',
    left: '0',
    width: '100%',
    backgroundColor: '#f8f9fa',
    textAlign: 'center',
    padding: '0px 0'
  } as React.CSSProperties;

  return (
    <div style={bottomFixedStyle}>
      {children}
    </div>
  );

};

export default BottomContainer;
