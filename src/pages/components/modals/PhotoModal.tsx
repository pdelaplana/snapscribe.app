import React, { useEffect, useState } from 'react';
import { 
  IonContent, 
  IonButton, 
  IonHeader, 
  IonToolbar, 
  useIonModal, 
  IonButtons, 
  IonFooter,
  IonItem, 
  IonLabel, 
  IonList, 
  IonIcon, 
  IonTextarea, 
  IonNote, 
  IonText, 
  IonSkeletonText,
  useIonActionSheet,
  useIonAlert} from '@ionic/react';
import { OverlayEventDetail } from '@ionic/core';
import ImageContainer from '../layouts/ImageContainer';
import { checkmark,close, ellipsisVertical, happyOutline, sparklesSharp } from 'ionicons/icons';
import StarRatings from '../ui/StarRatings';
import useCaptionGenerator from '../../../hooks/useCaptionGenerator';
import useDeletePhotoMutation from '../../../hooks/mutations/useDeletePhotoMutation';


interface PhotoModalProps {
  id: string;
  path: string;
  initialCaption?: string;
  initialRating?: number;
  onDismiss: (data?: any, role?: string) => void;
}

export const PhotoModal: React.FC<PhotoModalProps> = ({ path, id, initialCaption, initialRating, onDismiss }) => {

  const [caption, setCaption] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const [blobImage, setBlobImage] = useState<Blob>();
  const [error, setError] = useState<string>('');
  const [captionIndex, setCaptionIndex] = useState<number>(0);

  const [present] = useIonActionSheet();
  const [presentAlert] = useIonAlert();

  const { mutateAsync: deletePhotoAsync } = useDeletePhotoMutation();

  const { captions, isPending, error: captionError, generateCaptions} = useCaptionGenerator();

  const rateCaption = (value: number) => {
    setRating(value);
  }

  const confirmAndDelete = async (id: string, imagePath: string) => {
    presentAlert({
      header: 'Confirm Delete',
      message: 'Cannot be undone. Are you sure you want to delete this photo?',
      buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Alert canceled');
            }
          },
          {
            text: 'OK',
            role: 'confirm',
            handler: async () => {
              console.log('Alert confirmed');
              await deletePhotoAsync({documentId: id, imagePath: imagePath});
              onDismiss({ isDeleted : true }, 'confirm');
            },
          },
        ]
    })
  };

  const openActionSheet = (id: string, imagePath: string) => {
    present({
      buttons: [
      {
        text: 'Delete',
        role: 'destructive',
        icon: 'trash-bin-outline',
        handler: async () => {
          confirmAndDelete(id, imagePath);
        },
        data: {
          action: 'delete',
        },
      },
          
      {
        text: 'Cancel',
        role: 'cancel',
        icon: 'close',
        data: {
          action: 'cancel',
        },
      },

      ],
    })
  }

  const getNextCaption = async () => {
    if (captions.length === 0 || captionIndex === captions.length) {
      const response = await fetch(path);
      const blob = await response.blob();
      generateCaptions(blob);
      setCaptionIndex(0);
      return;
    }
    setCaptionIndex((prevCaptionIndex) => prevCaptionIndex + 1);
  }

  const uploadPhoto = async (webPath: string) => {
    console.log('uploading photo');
    try {
      // Fetch the image as a Blob
      const response = await fetch(webPath);
      const blob = await response.blob();
      setBlobImage(blob);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    }
  }

  useEffect(() => {
    setCaption(captions[captionIndex]);
  }, [captionIndex]);

  useEffect(() => {
    setCaption(captions.length > 0 ? captions[0]: '');
  }, [captions]);

  useEffect(() => {
    setRating(initialRating ?? 0);
  }, [initialRating]);

  useEffect(() => {
    setCaption(initialCaption ?? '');
  }, [initialCaption]);


  const loader = (
      <IonItem lines='none' >
        <IonLabel>
          <div style={{height:'110px'}} >
          <IonNote color='medium' className='ion-flex ion-align-items-center ion-justify-content-start ion-flex-gap-5'>
            <IonSkeletonText animated={true} style={{ width: '40px', height: '40px', borderRadius: '50%',  }}></IonSkeletonText> 
            <IonSkeletonText animated={true} style={{ height:'20px'}}></IonSkeletonText>
          </IonNote>
          <IonSkeletonText animated={true} style={{ width: '100%',}}></IonSkeletonText>
          <IonSkeletonText animated={true} style={{ width: '100%',}}></IonSkeletonText>
          <IonSkeletonText animated={true} style={{ width: '100%',}}></IonSkeletonText>
          </div>
          <IonToolbar>
            <IonSkeletonText animated={true} style={{ width: '80px',}}></IonSkeletonText>
            <IonSkeletonText animated={true} style={{ width: '200px',}}></IonSkeletonText>
            <IonButtons className='' slot='end'>
              <IonButton disabled size='small' fill='clear'>
                <IonIcon slot='icon-only' icon={checkmark}></IonIcon>
              </IonButton>
              <IonButton disabled size='small' fill='clear'>
                <IonIcon slot='icon-only' icon={sparklesSharp} ></IonIcon>
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonLabel>
      </IonItem>
  );

  const form = (
          <IonItem lines='none' >
        <IonLabel>
          <IonNote color='medium' className='ion-flex ion-align-items-center ion-justify-content-start ion-flex-gap-5'>
            <IonIcon icon={happyOutline} size='large' ></IonIcon> 
            <IonText className=''>
              Here's your caption! Feel free to use it, tweak it, or create another one.  Don't forget to rate it!
            </IonText>
          </IonNote>
          <IonTextarea label='' 
            placeholder='Type a caption here or click on generate button to create one' 
            labelPlacement='stacked' 
            autoGrow 
            rows={3}
            value={caption}
            debounce={500}
            onIonChange={(e) => setCaption(e.detail.value!)} 
          ></IonTextarea>
          <IonToolbar>
            <div >
              <StarRatings initialRating={rating} onRate={rateCaption}  />
              <IonText color='medium'><small>Rating this caption will help make us better.</small></IonText>
            </div>
            <IonButtons className='' slot='end'>
              <IonButton  disabled={isPending} size='small' fill='clear' onClick={() => onDismiss({path, caption, rating}, 'confirm')} >
                <IonIcon slot='icon-only' icon={checkmark}></IonIcon>
              </IonButton>
              <IonButton disabled={isPending} size='small' fill='clear' onClick={() => getNextCaption()}>
                <IonIcon slot='icon-only' icon={sparklesSharp} ></IonIcon>
              </IonButton>
              { id && 
                <IonButton disabled={isPending} size='small' fill='clear' onClick={() => openActionSheet(id, path) }>
                <IonIcon slot='icon-only' icon={ellipsisVertical} ></IonIcon>
              </IonButton>
              }
            
            </IonButtons>
          </IonToolbar>  
        </IonLabel>     
      </IonItem>

  );

  return (
    <>
      <IonHeader className='ion-no-border' hidden>
        <IonToolbar>
          <IonButtons slot='end'>
            <IonButton onClick={() => onDismiss('', 'cancel')} strong={true}>
              <IonIcon icon={close} slot='icon-only'></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className='' fullscreen={true}>
        <ImageContainer src={path ?? ''} height='100%' fit='contain' />
      </IonContent>
      <IonFooter >
        { error && <IonText color='danger'>{error}</IonText>}
        <IonList className=''>
          {isPending ? loader : form}
        </IonList>
      </IonFooter>
    </>
  );
};


export const usePhotoModal = (): { open: (path: string, caption?: string, rating?: number, id?: string) 
  => Promise<{caption: string, rating: number, isDeleted?: boolean}> } => {
  
  const [inputs, setInputs] = useState<{path: string, caption: string, rating: number, id?: string}>({path: '', caption: '', rating: 0, id: ''});

  const [present, dismiss] = useIonModal(PhotoModal, {
    path: inputs.path ?? '',
    initialCaption: inputs.caption ?? '',
    initialRating: inputs.rating ?? 0, 
    id: inputs.id ?? '',
    onDismiss: (data: any, role: string) => dismiss(data, role),
  });

  return {
    open: (path, caption, rating, id) => {
      setInputs({path, caption: caption ?? '', rating: rating ?? 0, id: id ?? ''});
      return new Promise(async (resolve) => {
        present({
          onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
            if (ev.detail.role === 'confirm') {
              resolve(ev.detail.data); // Return the data to the parent component
            }
          },
        });
      });
      
    }};
};

