import { IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { images, person } from 'ionicons/icons';
import { Route, Redirect } from 'react-router';
import GalleryPage from './pages/Gallery/GalleryPage';
import ProtectedRoute from './components/routes/ProtectedRoute';
import ProfilePage from './pages/Profile/ProfilePage';

const TabsRouter: React.FC = () => (
  <IonTabs>
    <IonRouterOutlet>
      <ProtectedRoute exact path='/gallery' component={GalleryPage}/>
      <ProtectedRoute exact path='/profile' component={ProfilePage}/>
      <Route exact path='/'>
        <Redirect to='/gallery' />
      </Route>
    </IonRouterOutlet>
    <IonTabBar slot='bottom'>
      <IonTabButton tab='tab2' href='/gallery'>
        <IonIcon aria-hidden='true' icon={images} />
        <IonLabel>Gallery</IonLabel>
      </IonTabButton>
      <IonTabButton tab='tab3' href='/profile'>
        <IonIcon aria-hidden='true' icon={person} />
        <IonLabel>Profile</IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
);

export default TabsRouter;