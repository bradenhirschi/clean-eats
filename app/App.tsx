import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import CameraLayoutScreen from './screens/camera/camera-layout';
import HomeScreen from './screens/home';
import ProfileScreen from './screens/profile';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import 'react-native-url-polyfill/auto';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from './utils/supabase';
import Auth from './screens/signup-flow/create-account';
import { View, StatusBar } from 'react-native';
import { Session } from '@supabase/supabase-js';
import HistoryScreen from './screens/history/history';
import MyPlanScreen from './screens/my-plan';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

SplashScreen.preventAutoHideAsync();

const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [appIsReady, setAppIsReady] = useState(false);

  const [fontsLoaded] = useFonts({
          'montserrat-bold': require('./assets/fonts/Montserrat-Bold.ttf'),
          'montserrat-medium': require('./assets/fonts/Montserrat-Medium.ttf'),
        });

  useEffect(() => {
    async function prepare() {
      try {
        await supabase.auth.getSession().then(({ data: { session } }) => {
          setSession(session);
        });

        await supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady && fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady || !fontsLoaded) {
    return null;
  }

  const Tab = createBottomTabNavigator();

  return (
    <View
      className="flex-1"
      onLayout={onLayoutRootView}
    >
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
                  case 'CameraLayout':
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
              tabBarActiveTintColor: '#5E9E38',
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
              name="CameraLayout"
              component={CameraLayoutScreen}
              options={{
                title: 'Camera',
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
    </View>
  );
};

export default App;
