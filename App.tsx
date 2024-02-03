import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import CameraScreen from './screens/camera';
import HomeScreen from './screens/home';
import ProfileScreen from './screens/profile';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import SplashScreen from './screens/splash';

const App = () => {
  const [loading, setLoading] = useState(true);

  const Tab = createBottomTabNavigator();

  setTimeout(() => {
    setLoading(false);
  }, 3000);

  if (loading) return <SplashScreen />

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            switch (route.name) {
              case 'Home':
                iconName = 'home';
                break;
              case 'Camera':
                iconName = 'camera';
                break;
              case 'Profile':
                iconName = 'person';
                break;
            }

            return (
              <Ionicons
                name={iconName as any}
                size={size}
                color={color}
              />
            );
          },
          tabBarActiveTintColor: 'green',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
        />
        <Tab.Screen
          name="Camera"
          component={CameraScreen}
          options={{
            headerShown: false,
            tabBarStyle: {
              position: 'absolute',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              borderTopColor: '#000000',
              opacity: 1,
            },
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
