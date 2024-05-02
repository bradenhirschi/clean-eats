import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { supabase } from "../utils/supabase";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Octicons } from "@expo/vector-icons";

interface Props {
  navigation: {
    navigate: (route: string) => void;
  };
}

const HomeScreen = ({ navigation }: Props) => {
  const [nutritionTips, setNutritionTips] = useState<string[]>([]);

  useEffect(() => {
    setNutritionTips([]);

    const fetchNutritionTips = async () => {
      try {
        // TODO make this select random rows
        const { data, error } = await supabase.from("nutrition_tips").select();
        if (error) {
          throw error;
        }
        const tips = data.map((d) => d.tip);
        const tipsToDisplay: string[] = [];

        for (let i = 0; i < 4; i++) {
          const newTip = tips[Math.floor(Math.random() * tips.length)]; // Choose random new tip
          const existingTip = tipsToDisplay.find((tip) => tip === newTip); // Check if tip already exists in tipsToDisplay
          existingTip ? i-- : tipsToDisplay.push(newTip); // If so, decrement the count and try again. Otherwise add new tip
        }

        setNutritionTips(tipsToDisplay);
      } catch (error: any) {
        console.error("Error fetching nutrition tips:", error.message);
      }
    };

    fetchNutritionTips();
  }, []);

  return (
    <View className="flex-1 bg-gray-100 text-black">
      {/* Greeting */}
      <View className="flex flex-col bg-white border-b border-b-gray-300 mb-8 pt-20 pb-4 px-4">
        {/* TODO add some kind of greeting by user's name - "Hey John!" */}
        <Text className="text-2xl font-[montserrat-bold]">Hey user!</Text>
      </View>

      {/* Buttons */}
      <View className="flex flex-row bg-white justify-center pb-8 mb-4 gap-8">
        <Pressable
          className="flex flex-col items-center"
          onPress={() => navigation.navigate("History")}
        >
          <View className="bg-orange-500 h-[60px] w-[60px] rounded-3xl flex items-center justify-center">
            <Octicons name="history" size={28} color="white" />
          </View>
          <Text className="mt-2">History</Text>
        </Pressable>
        <Pressable
          className="flex flex-col items-center"
          onPress={() => navigation.navigate("CameraLayout")}
        >
          <View className="bg-[#5E9E38] h-[60px] w-[60px] rounded-3xl flex items-center justify-center">
            <Ionicons name="camera-outline" size={32} color="white" />
          </View>
          <Text className="mt-2">Camera</Text>
        </Pressable>
        <Pressable
          className="flex flex-col items-center"
          onPress={() => navigation.navigate("My Plan")}
        >
          <View className="bg-[#CB3034] h-[60px] w-[60px] rounded-3xl flex items-center justify-center">
            <Ionicons name="list" size={32} color="white" />
          </View>
          <Text className="mt-2">My Plan</Text>
        </Pressable>
      </View>

      {/* Nutrition tips */}
      <View className="mb-4 p-4 bg-white">
        <Text className="text-xl mb-2 font-[montserrat-bold]">
          Daily Nutrition Tips
        </Text>
        <View className="rounded-lg bg-gray-200 divide-y p-2">
          {nutritionTips?.map((tip) => (
            <View key={tip} className="p-2">
              <Text className="text-base">{tip}</Text>
            </View>
          ))}
        </View>
      </View>

      {/*  */}
      <View className="mb-4 p-4 bg-white"></View>
    </View>
  );
};

export default HomeScreen;
