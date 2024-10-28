import { useMutation } from '@tanstack/react-query';
import { deleteDoc, doc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '../../firebaseConfig';

type DeletePhotoData = {
  documentId: string;
  imagePath: string;
};

const useDeletePhotoMutation = () => {
  return useMutation({
    mutationFn: async ({ documentId, imagePath }: DeletePhotoData) => {
      // Step 1: Delete the image from Firebase Storage
      const imageRef = ref(storage, imagePath);
      if (imageRef !== null) {
        await deleteObject(imageRef);
      }

      // Step 2: Delete the document from Firestore
      const docRef = doc(db, 'photos', documentId);
      if (docRef !== null) {
        await deleteDoc(docRef);
      }

      // Return a success message or the deleted document ID
      return { documentId };
    },
    onSuccess: (data) => {
      console.log(
        `Document and image deleted successfully! Document ID: ${data.documentId}`,
      );
    },
    onError: (error: unknown) => {
      console.error('Error deleting document or image: ', error);
    },
  });
};

export default useDeletePhotoMutation;
