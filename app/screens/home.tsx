import { Button, Text, View } from "react-native"

interface Props {
  navigation: {
    navigate: (route: string) => void;
  };
}

const HomeScreen = ({ navigation }: Props) => {
  return (
    <View>
      <Button title="Open camera" onPress={() => navigation.navigate('Camera')} />
    </View>
  )
}

export default HomeScreen;