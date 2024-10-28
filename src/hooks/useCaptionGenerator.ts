import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';



const useCaptionGenerator = () => {
  const apiUrl = import.meta.env.VITE_CAPTIONING_API_URL;
  
  const [captions, setCaptions] = useState<string[]>([]);

  const { mutate: generateCaptions, isPending, error } = useMutation({
    mutationFn: async (image: Blob) => {
      const formData = new FormData();
      formData.append('file', image, 'image.jpg');

      const response = await fetch(`${apiUrl}/caption`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to generate captions. Please try again.');
      }

      return response.json();
    },
    onSuccess: (data) => {
      setCaptions(data.captions);
    }
  });

  return {
    captions,
    isPending,
    error: error ? (error instanceof Error ? error.message : 'An unknown error occurred.') : '',
    generateCaptions,
  };
};

export default useCaptionGenerator;
