import { useNavigation, Link } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  Pressable,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Logo = () => {
  const navigation = useNavigation();
  const [id, setId] = useState('');
  const [isUser, setIsUser] = useState(false);

  const handlePress = () => {
    navigation.navigate('index');
  };

  const handlePress2 = () => {
    navigation.navigate('Settings');
  };

  const idRetriever = async () => {
    const heheheha: any = await AsyncStorage.getItem('_id');
    setId(heheheha);
  };

  useEffect(() => {
    idRetriever();
    if (id) {
      setIsUser(true);
    } else {
      setIsUser(false);
    }
  });

  return (
    <View>
      {isUser ? (
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TouchableOpacity onPress={handlePress}>
            <Image
              source={{
                uri: 'https://res.cloudinary.com/dvxzqlgsv/image/upload/v1712855371/hjmrhvtgehhzdrntjuug.png',
              }}
              width={170}
              height={70}
            />
          </TouchableOpacity>
          <Link href="/(tabs)/two" style={{}}>
            <Pressable />
          </Link>
          <TouchableOpacity onPress={handlePress2}>
            <FontAwesome name="user-circle-o" size={30} color="black" />
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TouchableOpacity onPress={handlePress}>
            <Image
              source={{
                uri: 'https://res.cloudinary.com/dvxzqlgsv/image/upload/v1712855371/hjmrhvtgehhzdrntjuug.png',
              }}
              width={170}
              height={70}
            />
          </TouchableOpacity>
          <Link href="/(tabs)/two" style={{}}>
            <Pressable />
          </Link>
          <TouchableOpacity onPress={handlePress2}>
            <AntDesign name="login" size={30} color="black" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
