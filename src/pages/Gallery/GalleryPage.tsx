import { 
  IonCol, 
  IonContent, 
  IonFab, 
  IonFabButton, 
  IonGrid, 
  IonHeader, 
  IonIcon,  
  IonPage, 
  IonRow, 
  IonTitle, 
  IonToolbar } from '@ionic/react';
import { cameraOutline } from 'ionicons/icons';

import { usePhotoGallery } from '../../context/PhotoGalleryContext';
import { usePhotoModal } from '../components/modals/PhotoModal';
import { useCamera } from '../../hooks/useCamera';

import PhotoCard from './components/PhotoCard';


const GalleryPage: React.FC = () => {  
  const {  photos, addPhoto } = usePhotoGallery();
  const { takePhoto } = useCamera(); 
  const { open: openPhotoModal } = usePhotoModal();

  const takePhotoAndOpenModal = async () => {
    const rawPhoto = await takePhoto();
    const {caption, rating} = await openPhotoModal(rawPhoto.webPath ?? '');
    addPhoto(rawPhoto,caption,rating);
  }

  return (
    <IonPage>
      <IonHeader className='ion-no-border'>
        <IonToolbar>
          <IonTitle>Gallery</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className='ion-padding-bottom' color='light'>
        <IonHeader collapse='condense'>
          <IonToolbar>
            <IonTitle size='large'>Gallery</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonGrid >
          <IonRow>
            {photos.map((photo, index) => (
              <IonCol size='12' key={photo.id}>
                 <PhotoCard initialPhoto={photo} />
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
        <IonFab vertical='bottom' horizontal='center' slot='fixed'>
            <IonFabButton onClick={() => takePhotoAndOpenModal()}>
            <IonIcon icon={cameraOutline}></IonIcon>
            </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default GalleryPage;
