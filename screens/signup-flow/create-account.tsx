import React, { useState } from 'react';
import {
  Alert,
  Button,
  Pressable,
  Modal,
  Keyboard,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  StyleSheet
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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
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
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        }
      }
    });

    if (error) Alert.alert(error.message);
    if (!session) Alert.alert('Please check your inbox for email verification!');
    setLoading(false);
  }

  return (
    <DismissKeyboard>
      <View className="p-12 mt-4">
        <View className="flex items-center my-12">
          <Text className="text-5xl">CleanEats {/* TODO BRADEN make this Montserrat font */}</Text>
        </View>
        <View className="py-2">
          <Input
              label="First Name"
              leftIcon={{ type: 'font-awesome', name: 'user' }}
              onChangeText={(text) => setFirstName(text)}
              value={firstName}
              placeholder="First name"
              autoCapitalize={'none'}
              textContentType='oneTimeCode' // this is a quick fix to hide the password toolbar in non-password inputs
            />
          <Input
            label="Last Name"
            leftIcon={{ type: 'font-awesome', name: 'address-card' }}
            onChangeText={(text) => setLastName(text)}
            value={lastName}
            placeholder="Last name"
            autoCapitalize={'none'}
            textContentType='oneTimeCode'
          />
          <Input
            label="Email"
            leftIcon={{ type: 'font-awesome', name: 'envelope' }}
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="Email"
            autoCapitalize={'none'}
            textContentType='oneTimeCode'
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
            className="bg-[#5e9e38] rounded-2xl p-4 items-center"
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
