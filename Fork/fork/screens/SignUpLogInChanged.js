import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n'; // Import i18n
import { Border, Color, GlobalStyles } from "../GlobalStyles.js";

const SignUpLogIn = ({ navigation }) => {
  const [language, setLanguage] = useState(i18n.locale === 'ko');

  const onSignUp = useCallback(() => {
    navigation.navigate("UserType");
  }, [navigation]);

  const onLogIn = useCallback(() => {
    navigation.navigate("Login");
  }, [navigation]);

  const onStartWithoutAccount = useCallback(() => {
    navigation.navigate("Home");
  }, [navigation]);

  useEffect(() => {
    const loadLanguagePreference = async () => {
      const storedLanguage = await AsyncStorage.getItem('user-language');
      if (storedLanguage) {
        i18n.locale = storedLanguage;
        setLanguage(storedLanguage === 'ko');
      }
    };
    loadLanguagePreference();
  }, []);

  const toggleLanguage = async () => {
    const newLanguage = language ? 'en' : 'ko';
    i18n.locale = newLanguage;
    setLanguage(!language);
    await AsyncStorage.setItem('user-language', newLanguage);
  };

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
            <TouchableOpacity style={GlobalStyles.startButton} onPress={onSignUp}>
              <Text style={GlobalStyles.startButtonText}>{i18n.t('sign_up')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={GlobalStyles.startButton} onPress={onLogIn}>
              <Text style={GlobalStyles.startButtonText}>{i18n.t('log_in')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onStartWithoutAccount}>
              <Text style={GlobalStyles.startText}>{i18n.t('start_without_account')}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.languageToggle} onPress={toggleLanguage}>
            <Text style={GlobalStyles.startText}>{language ? 'Switch to English' : '한국어로 전환'}</Text>
          </TouchableOpacity>
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
  languageToggle: {
    marginTop: 20,
  }
});

export default SignUpLogIn;
