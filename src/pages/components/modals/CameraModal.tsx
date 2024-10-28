import React from 'react';
import { IonContent, IonButton, IonHeader, IonToolbar, IonTitle, useIonModal, IonButtons, IonFooter } from '@ionic/react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { OverlayEventDetail } from '@ionic/core';

interface CameraModalProps {
  onDismiss: (data?: string | null | undefined | number, role?: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({ onDismiss }) => {
  //const { takePhoto } = usePhotoGallery();

  const takePhoto = async () => {
    const image = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 90,
    });

    console.log(image.webPath); // You can use image.webPath to display the image
    onDismiss(); // Close the modal after taking the photo
  };
  
  return (
    <>
      <IonHeader className='ion-no-border'>
        <IonToolbar>
          <IonTitle>Take a Photo</IonTitle>
          <IonButtons slot='end'>
            <IonButton onClick={() => onDismiss('', 'cancel')} strong={true}>
              x
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        <IonButton onClick={takePhoto}>Take Photo</IonButton>
      
      </IonContent>
    </>
  );
};


export const useCameraModal = (): { open: () => void } => {
  const [present, dismiss] = useIonModal(CameraModal, {
    onDismiss: (data: string, role: string) => dismiss(data, role),
  });

  return {
    open: () => {
      present({
        onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
          if (ev.detail.role === 'confirm') {

          }
        },
      });
    }};
};

