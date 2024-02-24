import { View, Text } from "react-native"
import { supabase } from "../utils/supabase";

interface Props {
  navigation: {
    navigate: (route: string) => void;
  };
}

const MyPlanScreen = ({ navigation }: Props) => {

  return (
    <View>
      <Text>Hey</Text>
    </View>
  )
}

export default MyPlanScreen;