import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';


/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import './theme/app.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import SigninPage from './pages/Signin/SigninPage';
import TabsRouter from './TabsRouter';
import SignupPage from './pages/Signup/SignupPage';
import { AuthProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PhotoGalleryProvider } from './context/PhotoGalleryContext';

setupIonicReact();

// Create a client
const queryClient = new QueryClient();

const App: React.FC = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <PhotoGalleryProvider >
        <IonApp>
          <IonReactRouter>
            <Route path='/'>
              <TabsRouter/>
            </Route>
            <Route path='/signin' exact>
              <SigninPage />
            </Route>
            <Route path='/signup' exact>
              <SignupPage />
            </Route>
          </IonReactRouter>
        </IonApp>
      </PhotoGalleryProvider>
      { false && <ReactQueryDevtools initialIsOpen={false}  /> }
    </QueryClientProvider>
  </AuthProvider>
);

export default App;
