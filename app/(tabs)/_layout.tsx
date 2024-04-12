import { Tabs } from 'expo-router';
import { Image } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Convert',
          tabBarIcon: () => (
            <Image
              source={{
                uri: 'https://www.iconpacks.net/icons/2/free-convert-icon-3209-thumb.png',
              }}
              width={27}
              height={27}
            />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="player"
        options={{
          title: 'Player',
          tabBarIcon: () => (
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/128/3024/3024584.png',
              }}
              width={27}
              height={27}
            />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
