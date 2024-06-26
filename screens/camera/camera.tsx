import { CameraType, CameraView, useCameraPermissions } from 'expo-camera/next';
import React, { useState, useRef } from 'react';
import { Button, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface Props {
  navigation: {
    navigate: (route: string, params?: any) => void;
  };
}

const CameraScreen = ({ navigation }: Props) => {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isLoading, setIsLoading] = useState(false);
  const cameraRef = useRef<CameraView>(null);

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
          title="Grant permission"
        />
      </View>
    );
  }

  const toggleCameraType = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  return (
    <View className="flex-1">
      <CameraView
      facing={facing}
        ref={cameraRef}
        className="flex-1"
        onBarcodeScanned={(scanningResult) => {
          // TODO BRADEN move this into a named function
          navigation.navigate('Results', { barcodeData: JSON.stringify(scanningResult) });
        }}
      >
        <View className="mx-4 mt-24">
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

          <Text className="text-white text-lg mt-24 mb-4 text-center">Scan a barcode to get started!</Text>

          {/* Box showing where to scan */}
          <View className="relative mx-auto h-72 w-72">
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

          {/* Camera button, unhide this if we reimplement it */}
          <View className="mx-auto mb-32 w-[80px] h-[80px] rounded-full bg-transparent flex items-center justify-center">
            {/* <TouchableOpacity
              onPress={takePicture}
              className="w-[70px] h-[70px] rounded-full bg-transparent"
            /> */}
          </View>
        </View>
      </CameraView>
    </View>
  );
};

export default CameraScreen;
