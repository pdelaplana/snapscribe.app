import { IonIcon } from '@ionic/react';
import { starSharp } from 'ionicons/icons';
import { useEffect, useState } from 'react';

interface StarRatingsProps {
  initialRating?: number;
  readonly?: boolean;
  onRate?: (rating: number) => void;
}
const StarRatings : React.FC<StarRatingsProps> = ({initialRating=0, readonly=false, onRate}) => {
  const [rating, setRating] = useState<number>(initialRating);

  const handleRating = (rating: number) => {
    if(readonly) return;
    setRating(rating);
    onRate && onRate(rating);
  }

  useEffect(() => {
    setRating(initialRating);
  },[initialRating])

  return(
    
    <div>
      <IonIcon icon={starSharp} color={rating > 0 ? 'primary': 'medium'} onClick={() => handleRating(1)}></IonIcon>
      <IonIcon icon={starSharp} color={rating > 1 ? 'primary': 'medium'} onClick={() => handleRating(2)}></IonIcon>
      <IonIcon icon={starSharp} color={rating > 2 ? 'primary': 'medium'} onClick={() => handleRating(3)}></IonIcon>
      <IonIcon icon={starSharp} color={rating > 3 ? 'primary': 'medium'} onClick={() => handleRating(4)}></IonIcon>
      <IonIcon icon={starSharp} color={rating > 4 ? 'primary': 'medium'} onClick={() => handleRating(5)}></IonIcon>
    </div>
  );
}

export default StarRatings;