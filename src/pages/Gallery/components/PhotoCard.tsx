import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonText } from '@ionic/react';
import dayjs from 'dayjs';
import { StoredPhoto } from '../../../types/storedPhoto';
import { ImageContainer } from '../../components/layouts';
import StarRatings from '../../components/ui/StarRatings';
import { usePhotoModal } from '../../components/modals/PhotoModal';
import { usePhotoGallery } from '../../../context/PhotoGalleryContext';
import { useEffect, useState } from 'react';

interface PhotoCardProps {
  initialPhoto: StoredPhoto;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ initialPhoto }) => {
  const { updatePhoto, removePhoto } = usePhotoGallery();
  const [photo, setPhoto] = useState<StoredPhoto>(initialPhoto);
  const { open: openPhotoModal } = usePhotoModal();

  const handlePhotoCardClick = async () => {
    const { caption, rating, isDeleted } = await openPhotoModal(photo.imageUrl!, photo.caption, photo.rating, photo.id);
    if (isDeleted) {
      removePhoto(photo.id);
      return;
    }
    setPhoto({ ...photo, caption, rating });
  }

  useEffect(() => { if (initialPhoto !== photo) updatePhoto(photo); }, [photo]);

  return (
    <IonCard button onClick={() => handlePhotoCardClick()}>
      <ImageContainer src={photo.imageUrl ?? ''} text='' />
      <IonCardHeader>
        <IonCardTitle></IonCardTitle>
        <IonCardSubtitle>{photo.caption}</IonCardSubtitle>
                    
      </IonCardHeader>
      <IonCardContent className='ion-flex ion-justify-content-between'>
        <IonText>
          {dayjs(photo.date).format('DD/MM/YYYY')}
        </IonText>
        <StarRatings initialRating={photo.rating} readonly={false} />
      </IonCardContent>
    </IonCard>
  );

};

export default PhotoCard;