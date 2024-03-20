import { View, Text, Pressable } from 'react-native';
import { supabase } from '../../utils/supabase';
import HistoryItem from './history-item';

interface Props {
  navigation: {
    navigate: (route: string) => void;
  };
}

interface Product {
  // TODO maybe change this to product to be a global type
  name: string;
  brand: string;
  timestamp: string;
}

const HistoryScreen = ({ navigation }: Props) => {
  const history: Product[] = [
    {
      name: 'Banana',
      brand: 'Chiquita',
      timestamp: '2024-03-18T08:30:00',
    },
    {
      name: 'Oatmeal',
      brand: 'Quaker',
      timestamp: '2024-03-18T12:15:00',
    },
    {
      name: 'Greek Yogurt',
      brand: 'Fage',
      timestamp: '2024-03-18T14:45:00',
    },
    {
      name: 'Chicken Breast',
      brand: 'Perdue',
      timestamp: '2024-03-18T19:00:00',
    },
    {
      name: 'Spinach',
      brand: 'Dole',
      timestamp: '2024-03-19T07:45:00',
    },
    {
      name: 'Salmon',
      brand: 'Wild Planet',
      timestamp: '2024-03-19T12:30:00',
    },
    {
      name: 'Almonds',
      brand: 'Blue Diamond',
      timestamp: '2024-03-19T15:20:00',
    },
    {
      name: 'Avocado',
      brand: 'Hass',
      timestamp: '2024-03-19T18:00:00',
    },
    {
      name: 'Whole Wheat Bread',
      brand: "Dave's Killer Bread",
      timestamp: '2024-03-19T20:10:00',
    },
    {
      name: 'Cottage Cheese',
      brand: "Breakstone's",
      timestamp: '2024-03-19T21:45:00',
    },
  ];

  return (
    <View className="flex-1">
      <View className="flex flex-col bg-white border-b border-b-gray-300 mb-4 pt-20 pb-4 px-4">
        <Text className="text-2xl font-[montserrat-bold]">History</Text>
      </View>
      <View className="divide-y">
        {history.map((item) => (
          <Pressable // TODO add click method
            key={item.timestamp}
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
