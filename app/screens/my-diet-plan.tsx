import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { supabase } from '../utils/supabase';
import { Octicons } from '@expo/vector-icons';
import { Button } from 'react-native-elements';

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

  const toggleDietSelected = (diet: string) => {
     if (selectedDiets.includes(diet)) {
      // If diet already exists, remove it
      setSelectedDiets(selectedDiets.filter(item => item !== diet));
    } else {
      // If diet doesn't exist, add it
      setSelectedDiets([...selectedDiets, diet]);
    }
  }

  return (
    <View className="flex-1 bg-gray-100 text-black">
      {/* Header */}
      <View className="flex flex-col bg-white border-b border-b-gray-300 mb-8 pt-20 pb-4 px-4">
        <Text className="text-2xl font-[montserrat-bold]">Diet Plan</Text>
      </View>

      {/* Buttons */}
      <View className="flex flex-row flex-wrap gap-2 justify-center mt-2 grow">
        <Pressable
          className="items-center"
          onPress={() => toggleDietSelected('Vegan')}
        >
          <View className="bg-green-500 h-20 w-20 flex items-center justify-center">
            <Ionicons
              name="leaf-outline"
              size={32}
              color="white"
            />
          </View>
          <Text className="mt-2">Vegan</Text>
        </Pressable>

        <Pressable
          className="items-center"
          onPress={() => toggleDietSelected('Keto')}
        >
          <View className="bg-green-500 h-20 w-20 flex items-center justify-center">
            <Ionicons
              name="sad-outline"
              size={32}
              color="white"
            />
          </View>
          <Text className="mt-2">Keto</Text>
        </Pressable>

        <View className="items-center p-2 bg-white rounded-md shadow-lg">
          <Pressable
            className={`bg-gray-100 h-20 w-20 rounded-md flex items-center justify-center ${
              selectedDiets.includes('Paleo') && 'bg-[#5e9e38]'
            }`}
            onPress={() => toggleDietSelected('Paleo')}
          >
            <Ionicons
              name="fish-outline"
              size={32}
              color={selectedDiets.includes('Paleo') ? 'white' : 'black'}
            />
            <Ionicons
              name="egg-outline"
              size={32}
              color={selectedDiets.includes('Paleo') ? 'white' : 'black'}
            />
          </Pressable>
          <Text className='mt-2'>Paleo</Text>
        </View>


      </View>

      {/* Save changes button */}
      <View>
        <Pressable><Text>Save</Text></Pressable>
      </View>
    </View>
  );
};

export default MyDietPlanScreen;
