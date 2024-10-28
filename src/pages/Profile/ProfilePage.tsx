import { IonButton, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonNote, IonPage, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import { useAuth } from '../../context/AuthContext';
import { pencil } from 'ionicons/icons';

const ProfilePage: React.FC = () => {
  const { signout, user } = useAuth();

  const router = useIonRouter();

  const onLogout = async () => {
    await signout();
    router.push('/signin', 'forward', 'replace');
  }

  return (
    <IonPage>
      <IonHeader className='ion-no-border'>
        <IonToolbar>
        
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div style={{height:'100px', backgroundColor:'--primary'}}>

        </div>
        <IonList lines='none' className='ion-padding'>
          <IonItem lines='full'>
            <IonLabel className='ion-padding'>
              {user?.displayName}
            </IonLabel>
            <IonButton slot='end' fill='outline'>
              <IonIcon slot='icon-only' icon={pencil}></IonIcon>
            </IonButton>
          </IonItem>

          <IonItem lines='full' >
            <IonLabel className='ion-padding'>
              {user?.email}
            </IonLabel>
            <IonButton slot='end' fill='outline'>
              <IonIcon slot='icon-only' icon={pencil}></IonIcon>
            </IonButton>
          </IonItem>

          <IonItem lines='full'>
            <IonLabel className='ion-padding'>
              <IonNote>
                Member since {user?.metadata?.creationTime}
              </IonNote>
            </IonLabel>
          </IonItem>

          <IonItem lines='full'>
            <IonLabel className='ion-padding'>
              <IonNote>
                Last updated {user?.metadata?.lastSignInTime}
              </IonNote>
            </IonLabel>
          </IonItem>

          <IonItem lines='full'>
            <IonLabel className='ion-padding'>
              Password
            </IonLabel>
            <IonButton slot='end' fill='clear'>
              Reset
            </IonButton>
          </IonItem>

          <IonItem lines='none'>
            <IonLabel>
              <IonButton onClick={onLogout} expand='block' size='default'>Sign Out</IonButton>
            </IonLabel>
            

          </IonItem>

        </IonList>
       
        
      </IonContent>
    </IonPage>
  );

}

export default ProfilePage;