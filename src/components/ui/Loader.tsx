import React from 'react';

import { IonSpinner } from '@ionic/react';
import type { CSSProperties } from 'styled-components';

interface LoaderProps {
  isLoading: boolean;
}
const loaderstyle:CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
};

const Loader: React.FC<LoaderProps> = ({isLoading}) => {
  return (
    isLoading && <IonSpinner style={loaderstyle} name='dots'/>
  );
};

export default Loader;
