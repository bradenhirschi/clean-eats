import { View, Text, Pressable } from 'react-native';
import { supabase } from '../../utils/supabase';
import HistoryItem from './history-item';
import { useEffect, useState } from 'react';
import { getActionFromState } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';

interface Props {
  navigation: {
    navigate: (route: string, params?: any) => void;
  };
}

interface Product {
  // TODO maybe change this to product to be a global type
  product_name: string;
  brand_name: string;
  created_at: string;
  upc: string;
}

const HistoryScreen = ({ navigation }: Props) => {

  const [userHistory, setUserHistory] = useState<Product[]>();

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

  const navigateToResults: any = (upc: any) => {
    navigation.navigate('Results', { barcodeData: JSON.stringify(upc)});
  };

  useEffect(() => {
    const fetchHistory = async () => {
      const userID = await getUserID();
      const { data, error } = await supabase
        .from('user_history')
        .select('brand_name, product_name, created_at, upc')
        .eq('user_id', userID);

      if (error) {
        console.error('Error fetching data:', error.message);
      } else {
        console.log(data)
        setUserHistory(data);
      }
    };
    fetchHistory();
  }, []);
  // const history: Product[] = [
  //   {
  //     name: 'Banana',
  //     brand: 'Chiquita',
  //     timestamp: '2024-03-18T08:30:00',
  //   },
  //   {
  //     name: 'Oatmeal',
  //     brand: 'Quaker',
  //     timestamp: '2024-03-18T12:15:00',
  //   },
  //   {
  //     name: 'Greek Yogurt',
  //     brand: 'Fage',
  //     timestamp: '2024-03-18T14:45:00',
  //   },
  //   {
  //     name: 'Chicken Breast',
  //     brand: 'Perdue',
  //     timestamp: '2024-03-18T19:00:00',
  //   },
  //   {
  //     name: 'Spinach',
  //     brand: 'Dole',
  //     timestamp: '2024-03-19T07:45:00',
  //   },
  //   {
  //     name: 'Salmon',
  //     brand: 'Wild Planet',
  //     timestamp: '2024-03-19T12:30:00',
  //   },
  //   {
  //     name: 'Almonds',
  //     brand: 'Blue Diamond',
  //     timestamp: '2024-03-19T15:20:00',
  //   },
  //   {
  //     name: 'Avocado',
  //     brand: 'Hass',
  //     timestamp: '2024-03-19T18:00:00',
  //   },
  //   {
  //     name: 'Whole Wheat Bread',
  //     brand: "Dave's Killer Bread",
  //     timestamp: '2024-03-19T20:10:00',
  //   },
  //   {
  //     name: 'Cottage Cheese',
  //     brand: "Breakstone's",
  //     timestamp: '2024-03-19T21:45:00',
  //   },
  // ];

  if (!userHistory) {
    return (
      <View className="flex-1 items-center justify-center p-8">
        <ActivityIndicator size={'large'} />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View className="flex flex-col bg-white border-b border-b-gray-300 mb-4 pt-20 pb-4 px-4">
        <Text className="text-2xl font-[montserrat-bold]">History</Text>
      </View>
      <View className="divide-y">
        {userHistory!.map((item) => (
          <Pressable // TODO add click method
          onPress={() => navigateToResults(item.upc)}
            key={item.created_at}
            className="mx-4"
          >
            <HistoryItem item={item} />
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default HistoryScreen;
