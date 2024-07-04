import { Link } from 'expo-router';
import { Text, View, StyleSheet, Button, RefreshControl, ScrollView } from 'react-native';
import { Logo } from '@/app/Logo';
import React, { useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { useGlobalState } from '@/context/GlobalStateProvider';
import { Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const GET_USER = gql`
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      email
      id
      image
      name
    }
  }
`;

const GET_HISTORY = gql`
  query GetHistory($userId: String!) {
    getHistory(userId: $userId) {
    id
    title
    userId
  }
  }
`;

export default function ProfilePage() {
  const { deleteUserFromStorage } = useGlobalState();
  const [id, setId] = useState('');
  const [isUser, setIsUser] = useState(false);
  const [user, setUser] = useState([]);
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState('');
  const { userId }: any = useGlobalState();
  const [ link, setLink ] = useState('');
  const [histories, setHistories] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    if (userId) {
      setIsUser(true);
    } else {
      setIsUser(false);
    }
  }, []);

  const [getUser, { loading, error, data }]: any = useLazyQuery(GET_USER, {
    onError: (error) => console.error(error),
  });

  const [getHistory]: any = useLazyQuery(GET_HISTORY, {
    onError: (error) => console.error(error)
  });

  useEffect(() => {
    if (userId) {
      getUser({
        variables: { id: userId },
      }).then(async (el: any) => {
        setName(el.data.getUserById.name);
        setEmail(el.data.getUserById.email);
        setImage(el.data.getUserById.image);
      });
      getHistory({
        variables: { userId: userId },
      }).then(async (el : any) => {
        setHistories(el.data.getHistory)
        // setHistories(result.map((el : any) => {
        //   console.log(el.title)
        // }))
      })
    }
  }, []);

  const LogOut = async () => {
    deleteUserFromStorage();
    navigation.navigate('index');
  };

  return (
    <View style={styles.container}>
      {isUser ? (
        <View>
          <ScrollView  style={{ height: 500 }}refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <View style={{ paddingTop: 50 }}>
            <Logo />
            <View style={{ padding: 10, flexDirection: 'column', justifyContent: 'flex-end' }}>
              <View style={{ flexDirection: 'row', gap: 25 }}>
                <FontAwesome name="user-circle-o" size={150} color="black" />
                <View style={{ flexDirection: 'column' }}>
                  <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{name}</Text>
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#7F7F7F' }}>
                    {email}
                  </Text>
                  <View style={{ width: 100, paddingTop: 25 }}>
                    <Button title="log out" onPress={LogOut} color={'red'} />
                  </View>
                </View>
              </View>
            </View>
            <View style={{ padding: 15 }}>
              <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Recently converted:</Text>
              <View style={{ paddingLeft: 25, gap: 25, padding: 15, flexDirection: "column" }}>
                {/* <Text style={{ fontSize: 17 }}>QWERTY [Official Visualizer] - Linkin Park</Text>
                <Text style={{ fontSize: 17 }}>Dimrain47 - The Disturbance</Text>
                <Text style={{ fontSize: 17 }}>Dimrain47 - At the Speed of Light</Text>
                <Text style={{ fontSize: 17 }}>Big Arm</Text>
                <Text style={{ fontSize: 17 }}>
                  In The End [Official HD Music Video] - Linkin Park
                </Text> */}
                <Text style={{ fontSize: 17, gap: 20, flexDirection: "column", width: 2 }}>
                  {histories.map((el:any) => {
                    return <View style={{flexDirection: "column" }} >
                    <Text style={{ padding: 10, fontSize: 15,}} > {el.title} </Text> 
                  </View>
                  })} 
                </Text>
              </View>
            </View>
          </View>
          </ScrollView>
        </View>
      ) : (
        <View style={styles.container}>
          <View style={{ paddingTop: 50 }}>
            <Logo />
          </View>
          <View style={styles.container1}>
            <Text style={styles.text1}>You haven't logged or registered on converdeez</Text>
            <View style={styles.text}>
              <Link href="/Login">
                <Text style={{ fontSize: 15, color: '#1700FF' }}>Login</Text>
              </Link>
              <Text style={{ fontSize: 15 }}>or</Text>
              <Link href="/Register">
                <Text style={{ fontSize: 15, color: '#1700FF' }}>Register</Text>
              </Link>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  container1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text1: {
    fontSize: 20,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flexDirection: 'row',
    gap: 4,
  },
});
