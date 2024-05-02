import { View, Text, Pressable } from "react-native";
import { supabase } from "../../utils/supabase";
import HistoryItem from "./history-item";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

interface Props {
  navigation: {
    navigate: (route: string, params?: any) => void;
  };
}

interface Product {
  // TODO maybe change this to product to be a global type
  product_name: string;
  brand_name: string;
  created_at: string;
  upc: string;
}

const HistoryScreen = ({ navigation }: Props) => {
  const [userHistory, setUserHistory] = useState<Product[]>();

  const getUserID = async () => {
    try {
      const id = await supabase.auth.getUser().then((res) => res.data.user?.id);
      if (id) {
        return id;
      }
    } catch (error) {
      console.log("Error getting User ID:", error);
    }
  };

  useFocusEffect(() => {
    const fetchHistory = async () => {
      const userID = await getUserID();
      const { data, error } = await supabase
        .from("user_history")
        .select("brand_name, product_name, created_at, upc")
        .order("created_at", {ascending: false})
        .eq("user_id", userID)
        .limit(8);

      if (error) {
        console.error("Error fetching data:", error.message);
      } else {
        setUserHistory(data);
      }
    };
    fetchHistory();
  });

  if (!userHistory) {
    return (
      <View className="flex-1 items-center justify-center p-8">
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View className="flex flex-col bg-white border-b border-b-gray-300 mb-4 pt-20 pb-4 px-4">
        <Text className="text-2xl font-[montserrat-bold]">History</Text>
      </View>
      <View className="divide-y">
        {userHistory!.map((item) => (
          <Pressable
            onPress={
              () =>
              navigation.navigate("CameraLayout", {
                screen: "Results",
                params: {barcodeData: JSON.stringify({data: item.upc})},
              })
            }
            key={item.created_at}
            className="mx-4"
          >
            <HistoryItem item={item} />
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default HistoryScreen;
