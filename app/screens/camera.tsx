import { Camera, CameraType } from 'expo-camera';
import React, { useState, useRef } from 'react';
import { Button, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface Props {
  navigation: {
    navigate: (route: string) => void;
  };
}

const CameraScreen = ({ navigation }: Props) => {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const cameraRef = useRef<Camera>(null);


  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-center">We need your permission to show the camera</Text>
        <Button
          onPress={requestPermission}
          title="grant permission"
        />
      </View>
    );
  }

  const toggleCameraType = () => {
    setType((current) => (current === CameraType.back ? CameraType.front : CameraType.back));
  };

  // const takePicture = async () => {
  //   if (cameraRef.current) {
  //     try {
  //       const { uri } = await (cameraRef.current as any).takePictureAsync();
  //       console.log('Picture taken:', uri);
  //     } catch (error) {
  //       console.error('Error taking picture:', error);
  //     }
  //   }
  // };
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const { uri } = await (cameraRef.current as any).takePictureAsync();
        console.log('Picture taken:', uri);
        setIsLoading(true);
        // Call uploadImage function with the captured image URI
        await uploadImage(uri);
      } catch (error) {
        console.error('Error taking picture:', error);
        setIsLoading(false);
      }
    } else {
      console.warn('Camera is not ready yet. Please wait for onCameraReady callback.');
    }
  };

  const uploadImage = async (imageUri: string) => {
    const imageName = `image_${Date.now()}.jpg`;

    try {
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        name: imageName,
        type: 'image/jpeg',
      });

      const response = await fetch('https://7b3a-146-7-15-17.ngrok-free.app/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const text = await response.text();
      console.log('Server response:', text);

      try {
        const data = JSON.parse(text);

        if (data.success) {
          setUploadStatus('Image uploaded successfully!');
        } else {
          console.error('Error uploading image:', data.message);
          setUploadStatus('Error uploading image. Please try again.');
        }
      } catch (jsonError) {
        console.error('JSON Parse error:', (jsonError as Error).message);
        setUploadStatus('Invalid JSON response from the server');
      }
    } catch (uploadError) {
      console.error('Error uploading image:', (uploadError as Error).message);
      setUploadStatus('Error uploading image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1">
      <Camera
        type={type}
        ref={cameraRef}
        className="flex-1"
      >
        <View className="flex-1 mx-4 mt-24">
          {/* Close and flip camera icons */}
          <View className="flex-row justify-between">
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
              <Ionicons
                name="close"
                size={32}
                color="white"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleCameraType}>
              <Ionicons
                name="camera-reverse-outline"
                size={32}
                color="white"
              />
            </TouchableOpacity>
          </View>

          {/* Box showing where to scan */}
          <View className="relative mx-auto my-24 h-72 w-72">
            {/* Top left corner */}
            <View className="absolute top-0 left-0 h-16 w-16 border-white border-t-2 border-l-2 rounded-tl-3xl" />
            {/* Top right corner */}
            <View className="absolute top-0 right-0 h-16 w-16 border-white border-t-2 border-r-2 rounded-tr-3xl" />
            {/* Bottom left corner */}
            <View className="absolute bottom-0 left-0 h-16 w-16 border-white border-b-2 border-l-2 rounded-bl-3xl" />
            {/* Top right corner */}
            <View className="absolute bottom-0 right-0 h-16 w-16 border-white border-b-2 border-r-2 rounded-br-3xl" />
          </View>

          <View className="flex-1" />

          {/* Camera button */}
          <View className="mx-auto mb-28 w-[80px] h-[80px] rounded-full bg-white flex items-center justify-center">
            <TouchableOpacity
              onPress={takePicture}
              className="w-[70px] h-[70px] rounded-full bg-white border-2 border-black"
            />
          </View>
        </View>
      </Camera>
    </View>
  );
};

export default CameraScreen;

