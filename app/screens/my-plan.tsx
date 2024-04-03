import { Button, View, Text, Pressable, TextInput } from "react-native"
import { supabase } from "../utils/supabase";
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
  const [allergy, setAllergy] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = await supabase.auth.getUser().then((res) => res.data.user?.id)
        console.log('User ID', id);
        setUserId(id);

        const { data, error } = await supabase
          .from('user_allergies')
          .select('allergy')
          .eq('user_id', id)

        if (error) {
          console.error('Error fetching data:', error.message);
        } else {
          console.log('Data fetched successfully:', data);
          const allergies = data.map((d) => d.allergy);
          setUserAllergies(allergies);
        }
      } catch (error) {
        console.error('Error:');
      }

    };
    fetchData();
  }, [])

  useEffect(() => {
    const getCommonAllergies = async () => {
      try {
        const { data, error } = await supabase
          .from('common_allergies').select('Allergy')
        if (error) {
          console.error('Error fetching data:', error.message);
        } else {
          console.log('Data fetched successfully:', data);
          const allergies = data.map((d) => d.Allergy);
          setCommonAllergies(allergies);
        }
      } catch (error) {
        console.error('Error with get common allergies');
      }
    };
    getCommonAllergies();
  }, []);

  const createUserAllergies = async (allergyInput?: string) => {

    let i = allergyInput ? allergyInput : allergy.toLowerCase();

    try {
      const { data, error } = await supabase
        .from('user_allergies')
        .insert({ user_id: userId, allergy: i })

      if (error) {
        console.log(error)
      }
      else {
        console.log("Data inserted successfully.")
        setAllergy('');
      }

    } catch (error) {
      console.error(error)
    }
  }



  return (
    <View className="flex-1 items-center justify-center">
      <View className="flex-wrap flex-row justify-center">
        {commonAllergies?.map((Allergy) => (
          <View
            key={Allergy}
          >
            <Pressable className="bg-[#5e9e38] rounded-lg px-4 py-2"
              onPress={() => createUserAllergies(Allergy)}>
              <Text className="text-white">{Allergy}</Text>
            </Pressable>
          </View>
        ))}
        {/* {commonAllergies.map((allergy) => (
          <Button>{allergy}</Button>
    ))} */}
      </View>
      <View>
          <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 }}
            placeholder="Enter new allergy"
            value={allergy}
            onChangeText={text => setAllergy(text)}
          />
          <Pressable
            className="bg-[#5e9e38] rounded-lg px-4 py-2"
            onPress={() => createUserAllergies()}>
            <Text className="text-white">Create New Allergy</Text>
          </Pressable>
        </View>
    </View>
  );
}

export default MyPlanScreen;
