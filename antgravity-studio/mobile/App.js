import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { store } from './store';
import { colors } from './styles/colors';

import HomeScreen from './screens/HomeScreen';
import ProjectsScreen from './screens/ProjectsScreen';
import CreateVideoScreen from './screens/CreateVideoScreen';
import VideoDetailScreen from './screens/VideoDetailScreen';
import SettingsScreen from './screens/SettingsScreen';
import AntgravityScreen from './screens/AntgravityScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: colors.cardBg },
            headerTintColor: colors.textPrimary,
            headerTitleStyle: { fontWeight: 'bold' },
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Projects" component={ProjectsScreen} options={{ title: 'Meus Projetos' }} />
          <Stack.Screen name="CreateVideo" component={CreateVideoScreen} options={{ title: 'Novo Vídeo' }} />
          <Stack.Screen name="VideoDetail" component={VideoDetailScreen} options={{ title: 'Detalhes do Vídeo' }} />
          <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Configurações' }} />
          <Stack.Screen name="Antgravity" component={AntgravityScreen} options={{ title: 'Antgravity Engine' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
