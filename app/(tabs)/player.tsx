import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import React, { useState, useEffect, useRef } from 'react';
import * as FileSystem from 'expo-file-system';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Button,
  Platform,
  ViewBase,
  ScrollView,
  RefreshControl
} from 'react-native';
import * as Permissions from 'expo-permissions';
import { Logo } from '@/app/Logo';
import {
  PauseButtonImage,
  PlayButtonImage,
  Thumb1Image,
  Track1Image,
  ForwardButtonImage,
  BackButtonImage,
} from '../../assets/icons/ImageIcons';
import { DownloadItem, getDownloads } from '@/utils/downloads';

const SanitizeName = (filename: string) => {
  if (filename.endsWith('.mp3')) {
    return filename.slice(0, -4);
  } else {
    return filename;
  }
};

const getFormattedDuration = (duration: number) => {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  return `${minutes}:${seconds}`;
};

export default function MusicPlayerPage() {
  const shouldPlay = false;
  const isLoading = false;
  const [index, setIndex] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | undefined>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [song, setSong] = useState('');
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [name, setName] = useState('');
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState('');
  const [shuffleMode, setShuffleMode] = useState(false);
  const [value, setValue] = useState();
  const isSeeking = useRef(false);
  const shouldPlayAtEndOfSeek = useRef(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);


  useEffect(() => {
    (async () => {
      const downloads = await getDownloads();
      setDownloads(downloads);
      setSong(downloads[index].uri);
      setName(SanitizeName(downloads[index].title));
      setImage(downloads[index].image);
      if (image) {
        setIsImage(true);
      }
      const { sound: playingSound, status }: any = await Audio.Sound.createAsync(
        { uri: downloads[index].uri },
        { shouldPlay: true, isLooping: false },
        onPlaybackStatusUpdate,
      );
      setSound(playingSound);
      setIsPlaying(true);
      setDuration(status.durationMillis);
    })();
  }, [index]);

  const currentSeconds = position > 0 ? Math.floor(position / 1000) : 0;
  const totalSeconds = duration > 0 ? Math.floor(duration / 1000) : 0;

  const deleteAsyncStorage = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys(); // Get all keys stored in AsyncStorage
      await AsyncStorage.multiRemove(keys); // Remove all items associated with the keys
      console.log('All items deleted successfully');
    } catch (error) {
      console.error('Error deleting items:', error);
    }
  };

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      interruptionModeIOS: InterruptionModeIOS.DuckOthers,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
      playThroughEarpieceAndroid: false,
    });

    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const nextSound = async () => {
    try {
      const isAtEnd = index === downloads.length - 1;
      if (!isAtEnd) {
        setIndex(index + 1);
      } else {
        setIndex(0);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const previousSound = async () => {
    try {
      const isAtStart = index === 0;
      if (!isAtStart) {
        setIndex(index - 1);
      } else {
        setIndex(downloads.length - 1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const playSound = async () => {
    if (!sound) {
      const { sound: playingSound, status }: any = await Audio.Sound.createAsync(
        { uri: downloads[index].uri },
        { shouldPlay: true, isLooping: false },
        onPlaybackStatusUpdate,
      );
      setSound(playingSound);
      setIsPlaying(true);
      setDuration(status.durationMillis);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const pauseSound = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis);
    }
    if (status.didJustFinish && !status.isLooping) {
      nextSound();
    }
  };

  const getSeekSliderPosition = () => {
    if (sound != null && position != null && duration != null) {
      return position / duration;
    }
    return 0;
  };

  const onValueChange = (value: any) => {
    if (sound != null && !isSeeking.current) {
      isSeeking.current = true;
      shouldPlayAtEndOfSeek.current = shouldPlay;
    }
    if (value >= 0.99) {
      setIndex(index + 1);
    }
  };

  const onSlidingComplete = async (value: any) => {
    if (sound != null) {
      isSeeking.current = false;
      const seekPosition = value * duration;
      if (shouldPlayAtEndOfSeek) {
        sound.playFromPositionAsync(seekPosition);
      } else {
        sound.setPositionAsync(seekPosition);
      }
    }
  };

  const PlayListSound = async (input: string) => {
    const { sound: playingSound, status }: any = await Audio.Sound.createAsync(
      { uri: input },
      { shouldPlay: true, isLooping: false },
      onPlaybackStatusUpdate,
    );
    setSound(playingSound);
    setIsPlaying(true);
    setDuration(status.durationMillis);
  };

  return (
    <View style={styles.container}>
      <View>
        <Logo />
        <ScrollView style={{ height: 500 }}refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}  >
          {downloads.map((el) => {
            return (
              <TouchableOpacity
                style={{ padding: 25, flexDirection: 'row' }}
                key={el.uri}
                onPress={() => {
                  PlayListSound(el.uri);
                  setName(SanitizeName(el.title));
                }}>
                <Text style={{ fontSize: 18 }}>{SanitizeName(el.title)}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      <View style={{ flex: 1, padding: 20, justifyContent: 'flex-end', alignItems: 'center' }}>
        <View style={styles.title}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{name}</Text>
        </View>
        <View style={styles.player}>
          <View style={{ width: 400 }}>
            <Slider
              style={styles.playbackSlider}
              trackImage={Track1Image.module}
              thumbImage={Thumb1Image.module}
              value={getSeekSliderPosition()}
              onValueChange={onValueChange}
              onSlidingComplete={onSlidingComplete}
              disabled={isLoading}
            />
          </View>
          <View style={{ flexDirection: 'row', padding: 15, justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 20 }}>{getFormattedDuration(currentSeconds)}</Text>
            <Text style={{ fontSize: 20 }}>{getFormattedDuration(totalSeconds)}</Text>
          </View>
          <View style={styles.player1}>
            <TouchableOpacity onPress={previousSound}>
              <Image
                source={BackButtonImage.module}
                width={BackButtonImage.width}
                height={BackButtonImage.height}
              />
            </TouchableOpacity>
            {!isPlaying ? (
              <TouchableOpacity onPress={() => playSound()}>
                <Image
                  source={PlayButtonImage.module}
                  width={PlayButtonImage.width}
                  height={PlayButtonImage.height}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={pauseSound}>
                <Image
                  source={PauseButtonImage.module}
                  width={PauseButtonImage.width}
                  height={PauseButtonImage.height}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={nextSound}>
              <Image
                source={ForwardButtonImage.module}
                width={ForwardButtonImage.width}
                height={ForwardButtonImage.height}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* <Button title="delete" onPress={deleteAsyncStorage} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: 'white',
  },
  slider: {
    width: 200,
    marginTop: 20,
  },
  playbackSlider: {
    alignSelf: 'stretch',
  },
  title: {
    fontSize: 50,
    alignItems: 'center',
  },
  player: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  player1: {
    flexDirection: 'row',
    gap: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    fontSize: 15,
  },
});
