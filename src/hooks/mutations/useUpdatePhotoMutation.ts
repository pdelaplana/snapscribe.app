import { useMutation } from '@tanstack/react-query';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { StoredPhoto } from '../../types/storedPhoto';

type UpdatePhotoData = {
  id: string;
  caption: string;
  rating: number;
};

const useUpdatePhotoMutation = () => {
  return useMutation({
    mutationFn: async ({ id, caption, rating }: UpdatePhotoData) => {
      // Step 1: Get the reference to the document by ID
      const docRef = doc(db, 'photos', id);

      // Step 2: Get the current document data
      const docSnapshot = await getDoc(docRef);
      if (!docSnapshot.exists()) {
        throw new Error('Document does not exist.');
      }

      // Step 3: Update the Firestore document
      await updateDoc(docRef, { caption, rating });

      // Step 4: Get the updated document data
      const updatedDocSnapshot = await getDoc(docRef);

      return {
        id: updatedDocSnapshot.id,
        ...(updatedDocSnapshot.data() as Omit<StoredPhoto, 'id'>),
      };
    },
    onSuccess: () => {
      console.log('Caption updated successfully!');
    },
    onError: (error: unknown) => {
      console.error('Error updating caption: ', error);
    },
  });
};

export default useUpdatePhotoMutation;
