import { Stack } from 'expo-router';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { GlobalStateProvider } from '../context/GlobalStateProvider';

export default function RootLayoutNav() {
  const client = new ApolloClient({
    uri: 'https://backend-ochre-beta.vercel.app/api/graphql',
    cache: new InMemoryCache(),
  });
  return (
    <ApolloProvider client={client}>
      <GlobalStateProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="Settings" options={{ headerShown: false }} />
          <Stack.Screen name="Login" options={{ headerShown: false }} />
          <Stack.Screen name="Register" options={{ headerShown: false }} />
        </Stack>
      </GlobalStateProvider>
    </ApolloProvider>
  );
}
