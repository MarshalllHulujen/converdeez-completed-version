import { Link } from 'expo-router';
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
import { useNavigation } from 'expo-router';
import { User } from '@/graphql/generated';
import { Logo } from '@/app/Logo';
import { useMutation, gql } from '@apollo/client';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalState } from '@/context/GlobalStateProvider';

const CREATE_USER = gql`
  mutation Mutation($input: UserRegisterInput!) {
    registerUser(input: $input) {
      id
      name
      email
      password
      image
    }
  }
`;

export default function RegisterPage() {
  const [registerUser, { data: createdData, loading: createLoading, error: createError }] =
    useMutation(CREATE_USER);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [repassword, setRepassword] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState(false);
  const navigation = useNavigation();
  const { setUserInStorage } = useGlobalState();

  const handleUser = async () => {
    if (name) {
      if (email) {
        if (password) {
          if (password === repassword) {
            registerUser({
              variables: {
                input: {
                  email,
                  name,
                  password,
                  image,
                },
              },
            }).then(async (el: any) => {
              setUserInStorage(el.data.registerUser.id);
            });
            setError(false);
            navigation.navigate('index');
          }
        }
      }
    } else {
      setError(true);
    }
  };
  return (
    <View style={styles.container}>
      <Logo />
      <Text style={styles.title}>Welcome!</Text>
      <View style={{ gap: 20, alignSelf: 'center' }}>
        <TextInput
          placeholder="Username"
          style={styles.input}
          onChangeText={setName}
          value={name}
        />
        <TextInput placeholder="Email" style={styles.input} onChangeText={setEmail} value={email} />
        <TextInput
          placeholder="Password"
          style={styles.input}
          onChangeText={setPassword}
          value={password}
        />
        <TextInput
          placeholder="Confirm Password"
          style={styles.input}
          onChangeText={setRepassword}
          value={repassword}
        />
      </View>
      <View style={styles.button}>
        <Button title="Sign Up" onPress={handleUser} />
      </View>
      <View style={styles.text}>
        <Text>Already have an account?</Text>
        <Link href="/Login" style={{ color: '#7400FF' }}>
          login here
        </Link>
      </View>
      {error ? (
        <View style={{ padding: 15 }}>
          <Text style={{ color: 'red' }}>
            Sorry password and confirm password aren't matched or email is incorrect please try
            again
          </Text>
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
