import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import CameraScreen from './screens/camera';
import HomeScreen from './screens/home';
import ProfileScreen from './screens/profile';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import SplashScreen from './screens/splash';
import 'react-native-url-polyfill/auto';
import { useState, useEffect } from 'react';
import { supabase } from './utils/supabase';
import Auth from './screens/signup-flow/create-account';
// import Account from './components/Account'
import { View, Text, StatusBar } from 'react-native';
import { Session } from '@supabase/supabase-js';
import HistoryScreen from './screens/history';
import MyPlanScreen from './screens/my-plan';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const Tab = createBottomTabNavigator();

  setTimeout(() => {
    setLoading(false);
  }, 3000);

  if (loading) return <SplashScreen />;

  return (
    <>
      <StatusBar barStyle={'dark-content'} />
      <NavigationContainer>
        {session && session.user ? (
          <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                switch (route.name) {
                  case 'Home':
                    iconName = 'home';
                    break;
                  case 'History':
                    iconName = 'time-outline';
                    break;
                  case 'Camera':
                    iconName = 'camera';
                    break;
                  case 'My Plan':
                    iconName = 'list';
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
              headerShown: false,
              tabBarActiveTintColor: 'green',
              tabBarInactiveTintColor: 'gray',
            })}
          >
            <Tab.Screen
              name="Home"
              component={HomeScreen}
            />
            <Tab.Screen
              name="History"
              component={HistoryScreen}
            />
            <Tab.Screen
              name="Camera"
              component={CameraScreen}
              options={{
                tabBarStyle: {
                  position: 'absolute',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  borderTopColor: '#000000',
                  opacity: 1,
                },
              }}
            />
            <Tab.Screen
              name="My Plan"
              component={MyPlanScreen}
            />
            <Tab.Screen
              name="Profile"
              component={ProfileScreen}
            />
          </Tab.Navigator>
        ) : (
          <Auth />
        )}
      </NavigationContainer>
    </>
  );
};

export default App;
