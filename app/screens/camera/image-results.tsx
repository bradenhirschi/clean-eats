import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { supabase } from '../../utils/supabase';

interface Props {
  route: { params: { imageText: string } };
}

const ImageResultsScreen = ({ route }: Props) => {
  const barcodeInfo = JSON.parse(route.params.imageText);
  const upc = barcodeInfo.data;
  let backupUpc: string;

  const [data, setData] = useState<any>();
  const [warning, setWarning] = useState<string>('');

  const getUserID = async () => {
    try {
      const id = await supabase.auth.getUser().then((res) => res.data.user?.id);
      if (id) {
        return id;
      }
    } catch (error) {
      console.log('Error getting User ID:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // Fetch food data from USDA
      if (upc.length === 13) {
        backupUpc = upc.substring(1);
      }
      const fetchUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${upc} ${backupUpc}&dataType=Branded&pageSize=1&api_key=hFNCTd2GoN19BAc9JS8gM6JwL1p8SQccGHJgnQlQ`;
      const res = await fetch(fetchUrl);
      const data = await res.json();

      // Get user's allergies
      let userAllergies: string[] = [];
      const userId = await getUserID();
      try {
        await supabase
          .from('user_allergies')
          .select('allergy_name')
          .eq('user_id', userId)
          .then(({ data, error }) => {
            if (error) {
              throw new Error(`Error fetching user allergies: ${error.message}`);
            }
            userAllergies = data.map((d) => d.allergy_name);
          });
      } catch (err) {
        console.error(err);
      }

      // Parse food data
      if (data.foods && data.foods.length > 0) {
        const firstFoodItem = data.foods[0];
        setData(firstFoodItem);
        {
          userAllergies.map((allergy) => {
            if (firstFoodItem.ingredients.toLowerCase().includes(allergy)) {
              const newWarning = `${warning}WARNING: this food includes ${allergy}\n`;
              setWarning(newWarning);
            }
          });
        }
      } else {
        console.log('No food items found');
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return (
      <View className="flex-1 p-8">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-8">
      <View className="border-b border-gray-300 pb-2">
        <Text className="font-bold text-xl">{data.description || ''}</Text>
        <Text className="text-gray-500 text-xs">{data.brandName || 'Unbranded'}</Text>
      </View>
      <View className="py-2">
        <Text className="font-semibold text-lg">Ingredients</Text>
        <Text className="mb-2">{data.ingredients.toLowerCase()}</Text>
        {warning && <Text className="text-red-700">{warning}</Text>}
      </View>
    </View>
  );
};

export default ImageResultsScreen;
