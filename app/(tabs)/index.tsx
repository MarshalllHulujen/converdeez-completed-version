import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { Link, useNavigation } from 'expo-router';
import { shareAsync } from 'expo-sharing';
import { useEffect, useState } from 'react';
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
import { Logo } from '../Logo';
import { addDownload } from '@/utils/downloads';
import { useGlobalState } from '@/context/GlobalStateProvider';
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';

const CREATE_HISTORY = gql`
  mutation Mutation($title: String!, $link: String!, $userId: String!) {
    createHistory(title: $title, link: $link, userId: $userId) {
      id
      link
      title
      userId
    }
  }
`;

const getFormattedDuration = (duration: number) => {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  return `${minutes}:${seconds} seconds`;
};

export default function TabOneScreen() {
  const [value, setValue] = useState('');
  const [details, setDetails] = useState({});
  const [isDetails, setIsDetails] = useState(false);
  const [image, setImage] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescripion] = useState('');
  const [time, setTime] = useState(0);
  const navigation = useNavigation();
  const [createHistory, { data: createdData, loading: createLoading, error: createError }] =
    useMutation(CREATE_HISTORY);
  const { userId } = useGlobalState();

  useEffect(() => {
    const result = userId;
  });

  const Handler = async () => {
    try {
      const dataRetriever: any = await axios
        .post(`http://192.168.11.238:3000/api/getinfo`, {
          url: value,
        })
        .then((el: any) => {
          setImage(el.data.thumbnail);
          setTitle(el.data.title);
          setDescripion(el.data.description);
          setTime(el.data.time);
          setIsDetails(true);
          setDetails(el.data);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const MP3Handler = async () => {
    try {
      const dataRetriever: any = await axios.get(
        `http://192.168.11.238:3000/api/downloadmp3?url=${value}`,
        {
          responseType: 'arraybuffer',
        },
      );

      if (dataRetriever) {
        try {
          const image: string = `${details.thumbnail}`;
          const name: string = `${title}.mp3`;
          const downloadResumable = FileSystem.createDownloadResumable(
            `http://192.168.11.238:3000/api/downloadmp3?url=${value}`,
            FileSystem.documentDirectory + name,
            {
              headers: {
                MyHeader: 'MyValue',
              },
            },
          );
          const mimeType = 'example';
          const { uri }: any = await downloadResumable.downloadAsync();
          await addDownload({ title, uri, image });
          console.log('Succesfully download at:', uri);
          save(uri, name, mimeType);
          console.log('Success!!');
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const DownloadMP3 = async () => {
    try {
      const dataRetriever: any = await axios.get(
        `http://192.168.11.238:3000/api/downloadmp3?url=${value}`,
        {
          responseType: 'arraybuffer',
        },
      );

      if (dataRetriever) {
        try {
          const title: string = `${details.title}.mp3`;
          const name: string = `${title}.mp3`;
          const downloadResumable = FileSystem.createDownloadResumable(
            `http://192.168.11.238:3000/api/downloadmp3?url=${value}`,
            FileSystem.documentDirectory + name,
            {
              headers: {
                MyHeader: 'MyValue',
              },
            },
          );
          const mimeType = 'example';
          const { uri }: any = await downloadResumable.downloadAsync();
          console.log('Succesfully download at:', uri);
          save(uri, name, mimeType);
          console.log('Success!!');
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const MP4Handler = async () => {
    try {
      const dataRetriever: any = await axios.get(
        `http://192.168.11.238:3000/api/downloadmp4?url=${value}`,
        {
          responseType: 'arraybuffer',
        },
      );

      if (dataRetriever) {
        try {
          const title: string = `${details.title}.mp4`;
          const image: string = `${details.thumbnail}`;
          const name: string = `${title}.mp4`;
          const downloadResumable = FileSystem.createDownloadResumable(
            `http://192.168.11.238:3000/api/downloadmp4?url=${value}`,
            FileSystem.documentDirectory + name,
            {
              headers: {
                MyHeader: 'MyValue',
              },
            },
          );
          const mimeType = 'example';
          const { uri }: any = await downloadResumable.downloadAsync();
          console.log('Succesfully download at:', uri);
          save(uri, name, mimeType);
          createHistory({
            variables: {
              link: `http://192.168.11.238:3000/api/downloadmp4?url=${value}`,
              title: title,
              userId: userId,
            },
          });
          console.log('Success!!');
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const save = async (uri: any, fileName: any, mimeType: any) => {
    if (Platform.OS === 'android') {
      const permissions =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        await FileSystem.StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          fileName,
          mimeType,
        )
          .then(async (uri) => {
            await FileSystem.writeAsStringAsync(uri, base64, {
              encoding: FileSystem.EncodingType.Base64,
            });
          })
          .catch((e) => console.log(e));
      } else {
        shareAsync(uri);
      }
    } else {
      shareAsync(uri);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Logo />
        <View style={{ alignSelf: 'center', padding: 15, gap: 10 }}>
          <TextInput
            placeholder="Insert your url here"
            style={styles.input}
            onChangeText={setValue}
          />
          <View style={{ borderRadius: 5 }}>
            <Button title="Convert" color="#00B2FF" onPress={Handler} />
          </View>
          {isDetails ? (
            <View>
              <Text>{title}</Text>
              <Text style={{ padding: 20 }}>{description}</Text>
              <Text>Duration : {getFormattedDuration(time)}</Text>
              <View
                style={{
                  width: 140,
                  flexDirection: 'row',
                  gap: 10,
                  borderRadius: 10,
                }}>
                <Button onPress={MP3Handler} title="Download MP3" color="red" />
                <Button onPress={DownloadMP3} title="MP3 no playlist" />
                <Button onPress={MP4Handler} title="Download MP4" color="lime" />
              </View>
            </View>
          ) : (
            <View />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 50,
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
  input: {
    width: 350,
    height: 40,
    borderWidth: 1.5,
    padding: 10,
    borderRadius: 5,
  },
});
