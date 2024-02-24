import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../utils/supabase';
import React, { useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Octicons } from '@expo/vector-icons';

interface Props {
  navigation: {
    navigate: (route: string) => void;
  };
}

const HomeScreen = ({ navigation }: Props) => {
  const [nutritionTips, setNutritionTips] = useState<string[]>([]);

  useEffect(() => {
    const fetchNutritionTips = async () => {
      try {
        // TODO make this select random rows
        const { data, error } = await supabase.from('nutrition_tips').select().limit(3);
        if (error) {
          throw error;
        }
        const tips = data.map((d) => d.tip);
        setNutritionTips(tips);
      } catch (error: any) {
        console.error('Error fetching nutrition tips:', error.message);
      }
    };

    fetchNutritionTips();
  }, []);

  return (
    <View className="flex-1 bg-gray-100 text-black">
      {/* Greeting */}
      <View className="flex flex-col bg-white border-b border-b-gray-300 mb-8 pt-20 pb-4 px-4">
        {/* TODO add some kind of greeting by user's name - "Hey John!" */}
        <Text className="text-2xl font-bold">Hey user!</Text>
      </View>

      {/* Buttons */}
      <View className="flex flex-row bg-white justify-center p-4 mb-4 gap-4">
        <Pressable
          className="flex flex-col items-center"
          onPress={() => navigation.navigate('Camera')}
        >
          <View className="bg-green-500 h-12 w-12 rounded-lg flex items-center justify-center">
            <Ionicons
              name="camera-outline"
              size={32}
              color="white"
            />
          </View>
          <Text className="mt-2">Camera</Text>
        </Pressable>
        <Pressable
          className="flex flex-col items-center"
          onPress={() => navigation.navigate('History')}
        >
          <View className="bg-orange-500 h-12 w-12 rounded-lg flex items-center justify-center">
            <Octicons
              name="history"
              size={28}
              color="white"
            />
          </View>
          <Text className="mt-2">History</Text>
        </Pressable>
      </View>

      {/* Nutrition tips */}
      <View className="mb-4 p-4 bg-white">
        <Text className="text-xl font-bold mb-2">Nutrition Tips</Text>
        <View className="rounded-lg bg-gray-200 divide-y p-2">
          {nutritionTips?.map((tip) => (
            <View
              key={tip}
              className="p-2"
            >
              <Text className="textpbase">{tip}</Text>
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
