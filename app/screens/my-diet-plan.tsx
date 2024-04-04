import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { supabase } from '../utils/supabase';
import { Octicons } from '@expo/vector-icons';

interface Props {
  navigation: {
    navigate: (route: string) => void;
  };
}

const MyDietPlanScreen = ({ navigation }: Props) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);

  useEffect(() => {
    const getUserID = async () => {
      try {
        const id = await supabase.auth.getUser().then((res) => res.data.user?.id);
        if (id) {
          setUserId(id);
        }
      } catch (error) {
        console.log('Error getting User ID:', error);
      }
    };
    getUserID();
  }, []);

  useEffect(() => {
    const fetchUserDietPlan = async () => {
      try {
        if (userId) {
          const { data: dietData, error: dietError } = await supabase
            .from('user_dietplan')
            .select('diet')
            .eq('user_id', userId);

          if (dietError) {
            console.error('Error fetching user diet plan:', dietError.message);
            return;
          }

          if (dietData && dietData.length > 0) {
            const diets = dietData.map((item: any) => item.diet);
            setSelectedDiets(diets);
          }
        }
      } catch (error) {
        console.error('Error fetching user diet plan:', error);
      }
    };

    fetchUserDietPlan();
  }, [userId]);

  const handleDietSelection = async (diet: string) => {
    try {
      if (userId) {
        const dietIndex = selectedDiets.indexOf(diet);

        if (dietIndex !== -1) {
          // Diet is already selected, do nothing
          return;
        } else {
          if (!selectedDiets.includes(diet)) {
            // Add the user's diet plan to the user_dietplan table
            setSelectedDiets((prevDiets) => [...prevDiets, diet]);

            const { data: insertData, error: insertError } = await supabase
              .from('user_dietplan')
              .insert([{ user_id: userId, diet, created_at: new Date() }]);

            if (insertError) {
              console.error('Error inserting diet plan:', insertError.message);
              return;
            }

            console.log('Diet plan inserted successfully:', insertData);
          }
        }
      }
    } catch (error) {
      console.error('Error handling diet selection:', error);
    }
  };

  return (
    <View className="flex-1 bg-gray-100 text-black">
      <View className="flex flex-col bg-white border-b border-b-gray-300 mb-8 pt-20 pb-4 px-4">
        <Text className="text-2xl font-[montserrat-bold]">Diet Plan</Text>
      </View>

      <View className="flex-1 bg-gray-100 px-4">
        {/* Buttons */}
        <View className="flex flex-row justify-center mt-2">
          <Pressable
            className="items-center mr-4"
            onPress={() => handleDietSelection('Vegan')}>
            <View className="bg-green-500 h-24 w-24  flex items-center justify-center">
              <Ionicons name="leaf-outline" size={32} color="white" />
            </View>
            <Text className="mt-2">Vegan</Text>
          </Pressable>

          <Pressable
            className="items-center"
            onPress={() => handleDietSelection('Keto')}>
            <View className="bg-green-500 h-24 w-24  flex items-center justify-center">
              <Ionicons name="sad-outline" size={32} color="white" />
            </View>
            <Text className="mt-2">Keto</Text>
          </Pressable>
        </View>

          <View className="flex flex-row justify-center mt-2">
          <Pressable
            className="items-center mr-4"
            onPress={() => handleDietSelection('Paleo')}>
            <View className="bg-green-500 h-24 w-24  flex items-center justify-center">
              <Ionicons name="fish-outline" size={32} color="white" />
              <Ionicons name="egg-outline" size={32} color="white" />
            </View>
            <Text className="mt-2">Paleo</Text>
          </Pressable>
          </View>
        {/* Selected diets */}
        <View className="mb-4 p-4 bg-white">
          <Text className="text-xl mb-2 font-[montserrat-bold]">Selected Diets</Text>
          <View className="rounded-lg bg-gray-200 divide-y p-2">
            {selectedDiets.length > 0 ? (
              selectedDiets.map((diet, index) => (
                <View key={index} className="p-2">
                  <Text className="text-base">{diet}</Text>
                </View>
              ))
            ) : (
              <Text>No diet plans selected</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default MyDietPlanScreen;
