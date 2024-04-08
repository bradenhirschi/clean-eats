import { Button, View, Text, Pressable, TextInput } from 'react-native';
import { supabase } from '../utils/supabase';
import React, { useEffect, useState } from 'react';

interface Props {
  navigation: {
    navigate: (route: string) => void;
  };
}

const MyPlanScreen = ({ navigation }: Props) => {
  const [userAllergies, setUserAllergies] = useState<string[]>([]);
  const [commonAllergies, setCommonAllergies] = useState<string[]>([]);
  const [userId, setUserId] = useState<string>();
  const [allergyInput, setAllergyInput] = useState('');
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = await supabase.auth.getUser().then((res) => res.data.user?.id);
        setUserId(id);

        const { data, error } = await supabase
          .from('user_allergies')
          .select('allergy')
          .eq('user_id', id);

        if (error) {
          console.error('Error fetching data:', error.message);
        } else {
          console.log('Data fetched successfully:', data);
          const allergies = data.map((d) => d.allergy);
          setUserAllergies(allergies);
        }
      } catch (err) {
        console.error('Error: ', err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const getCommonAllergies = async () => {
      const { data, error } = await supabase.from('common_allergies').select('name');
      if (error) {
        console.error('Error fetching data:', error.message);
      } else {
        const allergies = data.map((row) => row.name);
        setCommonAllergies(allergies);
      }
    };
    getCommonAllergies();
  }, []);

  const createUserAllergy = async (selectedAllergy?: string) => {
    let i = selectedAllergy ? selectedAllergy : allergyInput.toLowerCase();

    const { error } = await supabase.from('user_allergies').insert({ user_id: userId, allergy: i });

    if (error) {
      console.log(error);
    } else {
      setAllergyInput('');
    }
  };

  return (
    <View className="flex-1 bg-gray-100 text-black">
      {/* Header */}
      <View className="flex flex-col bg-white border-b border-b-gray-300 mb-8 pt-20 pb-4 px-4">
        <Text className="text-2xl font-[montserrat-bold]">My Plan</Text>
      </View>

      {/* Common allergy chips */}
      <View className="grow flex-wrap flex-row gap-2 justify-center">
        {commonAllergies?.map((allergy) => (
          <View key={allergy}>
            <Pressable
              className={`bg-gray-300 rounded-lg px-4 py-2 ${
                userAllergies.includes(allergy) && 'bg-[#5e9e38]'
              }`}
              onPress={() => createUserAllergy(allergy)}
            >
              <Text className="text-white">{allergy}</Text>
            </Pressable>
          </View>
        ))}
      </View>

      {/* Custom allergy input */}
      <View className="items-center justify-center py-4">
        <Text className="text-red-700 text-sm mb-2">{error}</Text>
        <TextInput
          className="rounded-md h-8 w-60 py-4 px-4 m-2 border"
          placeholder="Enter custom allergy"
          value={allergyInput}
          onChangeText={(text) => setAllergyInput(text)}
        />
        <Pressable
          className="bg-[#5e9e38] rounded-lg px-4 py-2"
          onPress={() => createUserAllergy()}
        >
          <Text className="text-white">Create New Allergy</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default MyPlanScreen;
