import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

type PhotoData = {
  id: string;
  userId: string;
  imageUrl: string;
  caption: string;
  timestamp: Timestamp;
  rating: number;
};

const useFetchPhotos = () => {
  return useQuery({
    queryKey: ['captions'],
    queryFn: async () => {
      // Get reference to the collection
      const querySnapshot = await getDocs(collection(db, 'photos'));

      // Map over each document and return the data along with the document ID
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<PhotoData, 'id'>),
      }));
    },
  });
};

export default useFetchPhotos;
