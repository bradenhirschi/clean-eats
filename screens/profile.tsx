import { Pressable, Text, View } from 'react-native';
import { supabase } from '../utils/supabase';
import Toast from 'react-native-root-toast';

interface Props {
  navigation: {
    navigate: (route: string) => void;
  };
}

const ProfileScreen = ({ navigation }: Props) => {
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    Toast.show('Signed out successfully', {
      duration: Toast.durations.SHORT,
      position: Toast.positions.TOP
    });

    if (error) {
      console.error(error);
    }
  };

  return (
    <View className="flex-1">
      <View className="flex flex-col bg-white border-b border-b-gray-300 mb-8 pt-20 pb-4 px-4">
        <Text className="text-2xl font-[montserrat-bold]">Profile</Text>
      </View>
      <View className='flex flex-1 flex-col items-center justify-center'>
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
