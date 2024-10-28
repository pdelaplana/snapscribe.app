import { useMutation } from '@tanstack/react-query';
import { addDoc, collection, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { StoredPhoto } from '../../types/storedPhoto';

type AddPhotoData = {
  imageUrl: string;
  userId: string;
  rating: number;
  caption: string;
};

const useAddPhotoMutation = () => {
  return useMutation({
    mutationFn: async (data: AddPhotoData) => {
      try {
        const docRef = await addDoc(collection(db, 'photos'), {
          ...data,
          timestamp: new Date(),
        });
        const docSnapshot = await getDoc(docRef);
        return {
          id: docSnapshot.id,
          ...(docSnapshot.data() as Omit<StoredPhoto, 'id'>),
        };
      } catch (error) {
        throw new Error('Error adding document: ' + error);
      }
    },
    onSuccess: (data) => {
      console.log('Document written with ID: ', data.id);
    },
    onError: (error: unknown) => {
      console.error('Error adding document: ', error);
    },
  });
};

export default useAddPhotoMutation;
