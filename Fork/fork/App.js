import React from 'react';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TranslatorProvider } from 'react-native-translator';
import { useFonts } from 'expo-font';
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
import testing from './screens/testing.js';
{/*import Maps from './screens/Maps';*/ }



const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <TranslatorProvider>
        <NavigationContainer>
          <View style={styles.container}>
            <StatusBar style="auto" />
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
              }} initialRouteName="Home">
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
              {/* <Stack.Screen name="MyReviews" component={MyReviews} />
              {/* <Stack.Screen name="Maps" component={Maps} /> */}
              <Stack.Screen name="MyReviews" component={MyReviews} />
              <Stack.Screen name="FacilityDetail" component={FacilityDetail} />
              <Stack.Screen name="MyStamps" component={MyStamps} />
              <Stack.Screen name="Settings" component={Settings} />
              <Stack.Screen name='testing' component={testing} />
              {/* Register the FavoritesScreen */}
            </Stack.Navigator>
          </View>
        </NavigationContainer>
        {/*<NavigationContainer>
          <NavigationBar />
        </NavigationContainer>*/}
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
