import { Pressable, Text, View } from "react-native";
import { supabase } from "../utils/supabase";
import Toast from "react-native-root-toast";
import { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

interface Props {
  navigation: {
    navigate: (route: string) => void;
  };
}

const ProfileScreen = ({ navigation }: Props) => {
  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [userHistoryCount, setUserHistoryCount] = useState<number>();

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    Toast.show("Signed out successfully", {
      duration: Toast.durations.SHORT,
      position: Toast.positions.TOP,
    });

    if (error) {
      console.error(error);
    }
  };

  useFocusEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const metadata = user?.user_metadata;
        setFirstName(metadata?.first_name || "User");
        setLastName(metadata?.last_name || "");
        setEmail(user?.email);
      } catch (err) {
        console.log("error");
      }
    };
    fetchUserInfo();
  });

  return (
    <View className="flex-1">
      <View className="flex flex-col bg-white border-b border-b-gray-300 mb-8 pt-20 pb-4 px-4">
        <Text className="text-2xl font-[montserrat-bold]">Profile</Text>
      </View>
      <View className="flex flex-1 flex-col items-center justify-center p-4">
        <View className="flex w-full py-12 px-4 bg-white border rounded-2xl mb-24">
          <Text className="text-xl font-bold">Basic info:</Text>
          <Text className="text-lg">&#x2022; First name: {firstName}</Text>
          <Text className="text-lg">&#x2022; Last name: {lastName}</Text>
          <Text className="text-lg">&#x2022; Email: {email}</Text>
        </View>
        <Pressable
          className="bg-[#5e9e38] rounded-lg px-4 py-2"
          onPress={signOut}
        >
          <Text className="text-white">Log Out</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ProfileScreen;
