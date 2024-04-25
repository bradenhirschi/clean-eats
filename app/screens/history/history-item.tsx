import { Pressable, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface Item {
  // TODO maybe change this to product to be a global type
  product_name: string;
  brand_name: string;
  created_at: string;
  upc: string;
}

const HistoryItem = ({ item }: { item: Item }) => {
  const timeSince = (date: string | Date) => {
    if (typeof date !== 'object') {
      date = new Date(date);
    }

    // @ts-ignore next-line
    var seconds = Math.floor((new Date() - date) / 1000);
    var intervalType;

    var interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
      intervalType = 'year';
    } else {
      interval = Math.floor(seconds / 2592000);
      if (interval >= 1) {
        intervalType = 'month';
      } else {
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) {
          intervalType = 'day';
        } else {
          interval = Math.floor(seconds / 3600);
          if (interval >= 1) {
            intervalType = 'hour';
          } else {
            interval = Math.floor(seconds / 60);
            if (interval >= 1) {
              intervalType = 'minute';
            } else {
              interval = seconds;
              intervalType = 'second';
            }
          }
        }
      }
    }

    if (interval > 1 || interval === 0) {
      intervalType += 's';
    }

    return interval + ' ' + intervalType;
  };

  //JSON.stringify({data: upc})

  return (
    <View className="py-2">
      <Pressable className="flex flex-row items-center">
        <Text className="text-lg">{item.product_name}&nbsp;</Text>
        <Text className="text-xs text-neutral-500">- {item.brand_name}</Text>
      </Pressable>
      <View className="flex flex-row items-center">
        <Ionicons name="time-outline" />
        <Text className="flex flex-row items-center text-xs text-neutral-500">
          &nbsp;{timeSince(item.created_at)} ago
        </Text>
      </View>
    </View>
  );
};

export default HistoryItem;
