import React, { useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Border, Color, GlobalStyles } from '../GlobalStyles.js';
import { getAllTranslations, getLanguageToken } from '../LanguageUtils';
import { USERTOKEN, LOGIN, changeLoginState } from './api.js';

const SignUpLogIn = ({ navigation }) => {
  const [translations, setTranslations] = useState({
    signUp: '',
    logIn: '',
    startWithoutAccount: '',
  });

  useEffect(() => {
    console.log(USERTOKEN);
    console.log(LOGIN);
    if (USERTOKEN != 'guest') {
      navigation.replace('Home');
    }
    const fetchTranslations = async () => {
      const fetchedTranslations = await getAllTranslations();
      setTranslations(fetchedTranslations);
    };
    fetchTranslations();
  }, []);

  const onSignUp = useCallback(() => {
    navigation.navigate('UserType');
  }, [navigation]);

  const onLogIn = useCallback(() => {
    navigation.navigate('Login');
  }, [navigation]);

  const onStartWithoutAccount = useCallback(() => {
    changeLoginState();
    navigation.replace('Home');
  }, [navigation]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={[Color.orange_700, Color.yellow_100]}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.container}>
          <View style={styles.mainArea}>
            <Image
              style={GlobalStyles.asset}
              source={require('../assets/logos/fullLogo.png')}
            />
          </View>
          <View style={GlobalStyles.authOptions}>
            <TouchableOpacity
              style={GlobalStyles.startButton}
              onPress={onSignUp}
            >
              <Text style={GlobalStyles.startButtonText}>
                {translations.signUp}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={GlobalStyles.startButton}
              onPress={onLogIn}
            >
              <Text style={GlobalStyles.startButtonText}>
                {translations.logIn}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onStartWithoutAccount}>
              <Text style={GlobalStyles.startText}>
                {translations.startWithoutAccount}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainArea: {
    height: 320,
    width: 210,
    resizeMode: 'cover',
    marginBottom: 40,
  },
});

export default SignUpLogIn;
