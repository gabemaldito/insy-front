import { useState } from 'react';
import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';
import { supabase } from '../utils/supabase';

// Helper to determine the correct backend URL based on environment
export const getBackendApiUrl = () => {
  // 1. Prioritize environment variable if set (e.g. for Production or configured locally)
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  
  // 2. Fallbacks for Local Development
  // - iOS Simulator: 'http://localhost:3000/api/process'
  // - Android Emulator: 'http://10.0.2.2:3000/api/process'
  // - Physical Device: requires your machine's local IP. 
  //   Change '10.0.0.35' to your actual local IP (e.g. 192.168.1.x)
  
  // Defaulting to the IP already present in your store, but this is the central place to change it.
  return 'http://10.0.0.35:3000/api/process';
};

export function useAudioUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadAndProcessAudio = async (uri: string) => {
    setIsUploading(true);
    setError(null);

    try {
      // 1. Get Supabase Auth Session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.user?.id) {
        throw new Error("User not authenticated or session expired.");
      }

      // 2. Prepare FormData with the audio file
      const formData = new FormData();
      formData.append('audio', {
        uri: uri,
        name: `recording_${Date.now()}.m4a`,
        type: 'audio/m4a'
      } as any);

      // 3. Send POST request to Next.js API with Auth
      const backendUrl = getBackendApiUrl();
      
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session.access_token}`,
          // Let fetch set the boundary for multipart/form-data automatically
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Backend processing API returned ${response.status}`);
      }

      // 5. Return the resulting Vault Item from the Next.js API
      // Since Next.js returns the full generated JSON data to be displayed in the UI instantly
      return result.item; 
    } catch (err: any) {
      console.error("Audio Bridge Upload Error:", err);
      const resultingError = err instanceof Error ? err : new Error(String(err));
      setError(resultingError);
      throw resultingError;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadAndProcessAudio,
    isUploading,
    error,
  };
}
