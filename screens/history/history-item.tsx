import { Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface Item {
  // TODO maybe change this to product to be a global type
  name: string;
  brand: string;
  timestamp: string;
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

  return (
    <View className="py-2">
      <View className="flex flex-row items-center">
        <Text className="text-lg">{item.name}&nbsp;</Text>
        <Text className="text-xs text-neutral-500">- {item.brand}</Text>
      </View>
      <View className="flex flex-row items-center">
        <Ionicons name="time-outline" />
        <Text className="flex flex-row items-center text-xs text-neutral-500">
          &nbsp;{timeSince(item.timestamp)} ago
        </Text>
      </View>
    </View>
  );
};

export default HistoryItem;
