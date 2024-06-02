import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, View, Alert } from 'react-native';
import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TranslatorProvider } from 'react-native-translator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Border, Color } from './GlobalStyles.js';

import SignUpLogIn from './screens/SignUpLogIn.js';
import UserType from './screens/UserType';
import FacilityInformation from './screens/FacilityInformation';
import SignUpKaist from './screens/SignUpKaist';
import SignUpFacility from './screens/SignUpFacility';
import VerifyEmail from './screens/VerifyEmail';
import Survey from './screens/Survey';
import AdjustFilter from './screens/AdjustFilter';
import SuccessfulRegistration from './screens/SuccessfulRegistration';
import PushNotification from './screens/PushNotification';
import WaitingApproval from './screens/WaitingApproval';
import Login from './screens/Login';
import ResetPassword from './screens/ResetPassword';
import Home from './screens/Home.js';
import NavigationBar from './components/NavigationBar';
import MyPage from './screens/MyPage';
import Favorites from './screens/Favorites';
import MyStamps from './screens/MyStamps';
import MyReviews from './screens/MyReviews';
import MapView from './screens/MapView.js';
import FacilityDetail from './screens/FacilityDetail.js';
import Settings from './screens/Settings.js';
import FacilityRegistrationRequest from './screens/FacilityRegistrationRequest.js';
import QRScanner from './screens/QRScanner.js';
import GiveStamp from './screens/GiveStamp.js';
{/*import Maps from './screens/Maps';*/ }

const requestLocationPermission = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission denied', 'Location permission is required to use this feature.');
  } else {
    console.log('Location permission granted');
  }
};

const Stack = createStackNavigator();

const App = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadLanguagePreference = async () => {
      const storedLanguage = await AsyncStorage.getItem('user-language');
      if (storedLanguage) {
        setLanguage(storedLanguage);
      }
      setIsReady(true);
    };
    loadLanguagePreference();
  }, []);

  const setLanguage = async (lang) => {
    await AsyncStorage.setItem('user-language', lang);
  };

  if (!isReady) {
    return null; // Render a loading component or splash screen here if needed
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <TranslatorProvider translations={{
        en: require('./locales/en.json'),
        ko: require('./locales/ko.json')
      }}>
        <NavigationContainer>
          <View style={styles.container}>
            <StatusBar style="auto" />
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
              }}
              initialRouteName="FacilityInformation"
            >
              <Stack.Screen name="SignUpLogIn" component={SignUpLogIn} />
              <Stack.Screen name="UserType" component={UserType} />
              <Stack.Screen name="FacilityInformation" component={FacilityInformation} />
              <Stack.Screen name="SignUpKaist" component={SignUpKaist} />
              <Stack.Screen name="SignUpFacility" component={SignUpFacility} />
              <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
              <Stack.Screen name="Survey" component={Survey} />
              <Stack.Screen name="AdjustFilter" component={AdjustFilter} />
              <Stack.Screen name="SuccessfulRegistration" component={SuccessfulRegistration} />
              <Stack.Screen name="PushNotification" component={PushNotification} />
              <Stack.Screen name="WaitingApproval" component={WaitingApproval} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="ResetPassword" component={ResetPassword} />
              <Stack.Screen name="MyPage" component={MyPage} />
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="Favorites" component={Favorites} />
              <Stack.Screen name="MapView" component={MapView} />
              <Stack.Screen name="MyReviews" component={MyReviews} />
              <Stack.Screen name="FacilityDetail" component={FacilityDetail} />
              <Stack.Screen name="MyStamps" component={MyStamps} />
              <Stack.Screen name="Settings" component={Settings} />
              <Stack.Screen name="FacilityRegistrationRequest" component={FacilityRegistrationRequest} />
              <Stack.Screen name="QRScanner" component={QRScanner} />
              <Stack.Screen name="GiveStamp" component={GiveStamp} />
              {/* Register the FavoritesScreen */}
            </Stack.Navigator>
          </View>
        </NavigationContainer>
      </TranslatorProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Color.white,
  },
  container: {
    flex: 24,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
});

export default App;
