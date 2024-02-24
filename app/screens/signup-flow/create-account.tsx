import React, { useState } from 'react';
import {
  Alert,
  Button,
  Keyboard,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { supabase } from '../../utils/supabase';
import { Input } from 'react-native-elements';

const DismissKeyboard = ({ children }: { children: any }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    if (!session) Alert.alert('Please check your inbox for email verification!');
    setLoading(false);
  }

  return (
      <DismissKeyboard>
            <View className="p-12 mt-4">
        <View className="flex items-center my-24">
          <Text className="text-5xl">CleanEats</Text>
        </View>
        <View className="py-2">
          <Input
            label="Email"
            leftIcon={{ type: 'font-awesome', name: 'envelope' }}
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="email@address.com"
            autoCapitalize={'none'}
          />
        </View>
        <View className="py-2">
          <Input
            label="Password"
            leftIcon={{ type: 'font-awesome', name: 'lock' }}
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder="Password"
            autoCapitalize={'none'}
          />
        </View>
        <View className="py-2">
          <TouchableOpacity
            className="bg-green-700 rounded-full p-4 items-center"
            disabled={loading}
            onPress={() => signUpWithEmail()}
          >
            <Text className="text-white">Sign up</Text>
          </TouchableOpacity>
        </View>
        <View className="py-2 mt-4 flex flex-row">
          <Text>Already have an account?&nbsp;</Text>
          <Text
            className="underline"
            onPress={() => signInWithEmail()}
          >
            Sign in
          </Text>
        </View>
            </View>

      </DismissKeyboard>
  );
};

export default AuthScreen;
