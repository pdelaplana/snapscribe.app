import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { isPlatform } from '@ionic/react';

import { Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';
import { StoredPhoto } from '../types/storedPhoto';
import { v4 as uuidv4 } from 'uuid';
import useAddPhotoMutation from '../hooks/mutations/useAddPhotoMutation';
import { useAuth } from './AuthContext';
import { storage } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import useFetchCaptions from '../hooks/queries/useFetchPhotos';
import useUpdatePhotoMutation from '../hooks/mutations/useUpdatePhotoMutation';


const PHOTO_STORAGE = 'photos';

// Define the context value type
interface PhotoGalleryContextValue {
  photos: StoredPhoto[];
  addPhoto: (photo: Photo, caption: string, rating: number) => Promise<void>;
  updatePhoto: (photo: StoredPhoto) => Promise<void>;
  removePhoto: (photoId: string) => Promise<void>;
}

// Create the context
const PhotoGalleryContext = createContext<PhotoGalleryContextValue | undefined>(undefined);

// Create the provider component
export const PhotoGalleryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [photos, setPhotos] = useState<StoredPhoto[]>([]);

  const { user } = useAuth();
  const { mutateAsync: addPhotoAsync } = useAddPhotoMutation();
  const { mutateAsync: updatePhotoAsync } = useUpdatePhotoMutation();
  
  const { data: captions, isLoading, error } = useFetchCaptions();

  /*
  useEffect(() => {
    const loadSaved = async () => {
      const { value } = await Preferences.get({ key: PHOTO_STORAGE });
      const photosInPreferences = (value ? JSON.parse(value) : []) as StoredPhoto[];

      // If running on the web...
      if (!isPlatform('hybrid')) {
        for (let photo of photosInPreferences) {
          const file = await Filesystem.readFile({
            path: photo.filepath,
            directory: Directory.Data,
          });
          // Web platform only: Load the photo as base64 data
          photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
        }
      }
      setPhotos(photosInPreferences);
    };
    loadSaved();

  }, []);
  */

  useEffect(() => {
    if (captions) {
      setPhotos(captions.map((photo) => ({
        id: photo.id,
        filepath: photo.imageUrl,
        webviewPath: photo.imageUrl,
        imageUrl: photo.imageUrl,
        caption: photo.caption,
        rating: photo.rating,
        date: photo.timestamp.toDate(),
      })));
    }
  }, [captions]);

  const savePicture = async (photo: Photo, caption: string, rating: number): Promise<StoredPhoto> => {
    const base64FromPath = async (path: string): Promise<string> => {
      const response = await fetch(path);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject('method did not return a string');
          }
        };
        reader.readAsDataURL(blob);
      });
    };

    const uploadDate = new Date();
    const fileName = uploadDate.getTime() + '.jpeg';

    let base64Data: string | Blob;
    // "hybrid" will detect Cordova or Capacitor;
    if (isPlatform('hybrid')) {
      const file = await Filesystem.readFile({
        path: photo.path!,
      });
      base64Data = file.data;
    } else {
      base64Data = await base64FromPath(photo.webPath!);
    }

    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });

    if (isPlatform('hybrid')) {
      return {
        id: uuidv4(),
        imageUrl: savedFile.uri,
        //webviewPath: Capacitor.convertFileSrc(savedFile.uri),
        caption,
        rating,
        date: uploadDate,
      };
    } else {
      return {
        id: uuidv4(),
        imageUrl: fileName,
        //webviewPath: photo.webPath,
        caption,
        rating,
        date: uploadDate,
      };
    }
  };

  const uploadPhoto = async (webPath: string) => {

    try{
      const response = await fetch(webPath);
      const blob = await response.blob();

      // Create a reference in Firebase Storage
      const storageRef = ref(storage, `images/${new Date().getTime()}.jpg`);

      // Upload the image
      await uploadBytes(storageRef, blob);

      // Get the download URL of the uploaded image
     return await getDownloadURL(storageRef);

    }catch (error) {
      console.error('Error uploading photo: ', error);
    }
  };

  const addPhoto = async (photo: Photo, caption: string, rating: number) => {
    //const savedFileImage = await savePicture(photo, caption, rating);

    //const imageUrl = await uploadPhoto(savedFileImage.webviewPath!);
    const imageUrl = await uploadPhoto(photo.webPath!);
    const added = await addPhotoAsync({
      imageUrl: imageUrl!,
      userId: user!.uid,
      rating: rating,
      caption:caption
    });

    //await Preferences.set({ key: PHOTO_STORAGE, value: JSON.stringify(newPhotos) });
    setPhotos(prevState => [...prevState, added]);
  };

  const updatePhoto = async (photo: StoredPhoto) => {
    const updated = await updatePhotoAsync({
      id: photo.id,
      rating: photo.rating,
      caption: photo.caption
    });
    //await Preferences.set({ key: PHOTO_STORAGE, value: JSON.stringify(newPhotos) });
    setPhotos(() => photos.map((p) => (p.id === updated.id ? updated : p)));
  };

  const removePhoto = async (photoId: string) => {
    setPhotos((prevState) => prevState.filter((p) => p.id !== photoId));
  };

  return (
    <PhotoGalleryContext.Provider value={{ photos, addPhoto, updatePhoto, removePhoto }}>
      {children}
    </PhotoGalleryContext.Provider>
  );
};

// Create a custom hook to use the PhotoGallery context
export const usePhotoGallery = (): PhotoGalleryContextValue  => {
  const context = useContext(PhotoGalleryContext);
  if (!context) {
    throw new Error('usePhotoGallery must be used within a PhotoGalleryProvider');
  }
  return context;
};
