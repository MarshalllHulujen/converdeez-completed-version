import { Link, useNavigation } from 'expo-router';
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
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Logo } from '@/app/Logo';
import { useState } from 'react';
import { useGlobalState } from '@/context/GlobalStateProvider';

const LOGIN_USER = gql`
  query GetUser($input: GetUserInput!) {
    getUser(input: $input) {
      id
      email
      password
      name
    }
  }
`;

export default function LoginPage() {
  const [getUser, { data: createdData, loading: createLoading, error: createError }] = useLazyQuery(
    LOGIN_USER,
    { onError: (error) => console.error(error) },
  );
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigation = useNavigation();
  const { setUserInStorage } = useGlobalState();

  const LoginFunction = () => {
    try {
      if (email) {
        if (password) {
          getUser({
            variables: {
              input: {
                email,
                password,
              },
            },
          }).then(async (el: any) => {
            if (el.data.getUser === null) {
              setError(true);
            } else {
              setUserInStorage(el.data.getUser.id);
              navigation.navigate('index');
            }
          });
        } else {
          setError(true);
        }
      } else {
        setError(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <Logo />
      <Text style={styles.title}>Welcome back!</Text>
      <View style={{ gap: 20, alignSelf: 'center' }}>
        <TextInput placeholder="Email" style={styles.input} onChangeText={setEmail} />
        <TextInput
          placeholder="Password"
          autoCorrect={false}
          secureTextEntry={true}
          textContentType="password"
          style={styles.input}
          onChangeText={setPassword}
        />
      </View>
      <View style={styles.button}>
        <Button title="Login" color="red" onPress={LoginFunction} />
      </View>
      <View style={styles.text}>
        <Text>Don't have an account?</Text>
        <Link href="/Register" style={{ color: '#7400FF' }}>
          register here
        </Link>
      </View>
      {error ? (
        <View style={styles.text}>
          <Text style={{ color: 'red' }}>Email or password is incorrect please try again</Text>
        </View>
      ) : (
        <View></View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 50,
    gap: 25,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  input: {
    width: 400,
    height: 45,
    borderWidth: 1.5,
    padding: 10,
    borderRadius: 5,
  },
  button: {
    borderRadius: 5,
    width: 400,
    paddingLeft: 10,
  },
  text: {
    flexDirection: 'row',
    gap: 5,
    paddingLeft: 10,
  },
});
