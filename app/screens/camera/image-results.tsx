import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

interface Props {
  route: { params: { imageText: string } };
}

const ImageResultsScreen = ({ route }: Props) => {
  const barcodeInfo = JSON.parse(route.params.imageText);
  const upc = barcodeInfo.data;

  const [data, setData] = useState<any>();

  useEffect(() => {
    const fetchUsdaData = async () => {

      console.log('upc', upc)

      // const fetchUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${upc}&dataType=Branded&pageSize=1&api_key=hFNCTd2GoN19BAc9JS8gM6JwL1p8SQccGHJgnQlQ`

      const fetchUrl = 'https://api.nal.usda.gov/fdc/v1/foods/search?query=030800846003&dataType=Branded&pageSize=1&api_key=hFNCTd2GoN19BAc9JS8gM6JwL1p8SQccGHJgnQlQ';

      const res = await fetch(fetchUrl);
      const data = await res.json();

      // Assuming the response contains an array of food items
      if (data.foods && data.foods.length > 0) {
        // Accessing the first food item in the response
        console.log(data.foods);
        const firstFoodItem = data.foods[0];

        setData(firstFoodItem);

        // Example: extracting the name and description of the first food item
        const name = firstFoodItem.description;
        const description = firstFoodItem.dataType;

        console.log('Name:', name);
        console.log('Description:', description);

        // You can access other properties similarly
      } else {
        console.log('No food items found');
      }
    };
    fetchUsdaData();
  });

  return (
    <View className="flex-1 p-8">
      <Text>{JSON.stringify(data)}</Text>
    </View>
  );
};

export default ImageResultsScreen;
