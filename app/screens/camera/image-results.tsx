import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

interface Props {
  route: { params: { imageText: string } };
}

const ImageResultsScreen = ({ route }: Props) => {
  const barcodeInfo = JSON.parse(route.params.imageText);
  const upc = barcodeInfo.data;
  let backupUpc: string;

  const [data, setData] = useState<any>();

  useEffect(() => {
    const fetchUsdaData = async () => {

      if (upc.length === 13) {
        backupUpc = upc.substring(1);
      }

      const fetchUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${upc} ${backupUpc}&dataType=Branded&pageSize=1&api_key=hFNCTd2GoN19BAc9JS8gM6JwL1p8SQccGHJgnQlQ`

      const res = await fetch(fetchUrl);
      const data = await res.json();

      // Assuming the response contains an array of food items
      if (data.foods && data.foods.length > 0) {
        // Accessing the first food item in the response
        const firstFoodItem = data.foods[0];

        setData(firstFoodItem);
        if (firstFoodItem.ingredients.includes('milk')) {
          console.error('MILK FOUND');
        }

        // You can access other properties similarly
      } else {
        console.log('No food items found');
      }
    };
    fetchUsdaData();
  }, []);

  if (!data) {
    return (
      <View className='flex-1 p-8'>
        <Text>Loading...</Text>
      </View>
    )
  }

  return (
    <View className="flex-1 p-8">
      <View className=''>
        <Text className='font-bold text-xl'>{data.description || ''}</Text>
        <Text className='text-gray-500 text-xs'>{data.brandName || 'Unbranded'}</Text>
      </View>
      <Text className='font-semibold text-lg'>Ingredients</Text>
      <Text className=''>{data.ingredients.toLowerCase()}</Text>
      
    </View>
  );
};

export default ImageResultsScreen;
