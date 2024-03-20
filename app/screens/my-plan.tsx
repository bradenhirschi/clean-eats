import { Button, View, Text } from "react-native"
import { supabase } from "../utils/supabase";
import React, { useEffect, useState } from 'react';

interface Props {
  navigation: {
    navigate: (route: string) => void;
  };
}

const MyPlanScreen = ({ navigation }: Props) => {
  const [userAllergies, setUserAllergies] = useState<string[]>([]);
  const [id, setUserId] = useState<string[]>([]);

  useEffect(() => {
    const getUserID = async() => {
      try{
        const id = await supabase.auth.getUser().then((res) => res.data.user?.id)
        console.log('User ID', id)
      }
    catch (error){
      console.log('error');
    }
};
getUserID();
}, [])

  useEffect(() => {
    const getUserAllergies= async() => {
    try{
      const { data, error } = await supabase
    .from('user_allergies')
    .select('allergy').match(id)
    // .eq({user_id: id}) //user...allergies
    // const id = await supabase.auth.getUser().then((res) => res.data.user?.id)
    if (error){
      console.error('Error fetching data:', error.message);
    }else{
      console.log('Data fetched successfully:', data);
      console.log('User ID', id)
      const allergies = data.map((d) => d.allergy);
      setUserAllergies(allergies);
    }
    }catch (error) {
      console.error('Error:');
    }
  };
  getUserAllergies();
}, []);
  

  return (
    <View className="flex-1 items-center justify-center">
    <View className="flex-1 items-center justify-center">
          {userAllergies?.map((allergies) => (
            <View
              key={allergies}
              className="p-2"
            >
              <Text className="textpbase">{allergies}</Text>
            </View>
          ))}
          </View>
      </View>

  );
}

export default MyPlanScreen;
