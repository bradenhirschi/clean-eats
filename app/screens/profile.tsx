import { Pressable, Text, View } from "react-native"
import { supabase } from "../utils/supabase";

interface Props {
  navigation: {
    navigate: (route: string) => void;
  };
}

const ProfileScreen = ({ navigation }: Props) => {

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
    }
  }

  return (
    <View className="flex-1">
      <View className='flex flex-col bg-white border-b border-b-gray-300 mb-8 pt-20 pb-4 px-4'>
        {/* TODO add some kind of greeting by user's name - "Hey John!" */}
        <Text className='text-2xl font-bold'>Profile</Text>
      </View>
      <View className="flex flex-col">

      </View>
      <Pressable className="bg-green-700 rounded-lg px-4 py-2" onPress={signOut}><Text className="text-white">Log Out</Text></Pressable>
    </View>
  )
}

export default ProfileScreen;