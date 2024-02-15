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
  const cameraRef = useRef(null);

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (permission.granted) {
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

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const { uri } = await (cameraRef.current as any).takePictureAsync();
        console.log('Picture taken:', uri);
      } catch (error) {
        console.error('Error taking picture:', error);
      }
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
