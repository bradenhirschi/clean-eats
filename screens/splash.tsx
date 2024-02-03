import { Text, View } from "react-native"
import { FontAwesome6 } from '@expo/vector-icons';

const SplashScreen = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl mb-4">CleanEats</Text>
      <FontAwesome6 name="apple-whole" size={100} color="red" />
    </View>
  )
}

export default SplashScreen;