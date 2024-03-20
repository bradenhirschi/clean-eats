import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CameraScreen from './camera';
import ImageResultsScreen from './image-results';

const CameraLayout = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Results"
        component={ImageResultsScreen}
      />
    </Stack.Navigator>
  );
};

export default CameraLayout;
