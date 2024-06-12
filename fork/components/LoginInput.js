import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { Border, Color, GlobalStyles } from '../GlobalStyles.js';
import { useNavigation } from '@react-navigation/native';
import { handleLogin } from '../screens/api.js';
import { getAllTranslations, getLanguageToken } from '../LanguageUtils';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const LoginInput = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const onResetPassword = useCallback(() => {
    navigation.navigate('ResetPassword');
  }, [navigation]);

  const [translations, setTranslations] = useState({});

  useEffect(() => {
    const fetchTranslations = async () => {
      const fetchedTranslations = await getAllTranslations();
      setTranslations(fetchedTranslations);
    };
    fetchTranslations();
  }, []);

  const onLoginPress = async () => {
    const loginSuccessful = await handleLogin(username, password);
    if (loginSuccessful) {
      navigation.goBack();
      navigation.replace('Home');
    } else {
      Alert.alert(translations.logInFailed);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainArea}>
        <View style={GlobalStyles.inputWrapper}>
          <TextInput
            style={GlobalStyles.registrationInput}
            onChangeText={setUsername}
            value={username}
            placeholder={translations.username}
            autoCapitalize="none"
          />
          <Image
            source={require('../assets/icons/username.png')}
            style={GlobalStyles.inputIcon}
          />
        </View>
        <View style={GlobalStyles.inputWrapper}>
          <TextInput
            style={GlobalStyles.registrationInput}
            onChangeText={setPassword}
            value={password}
            placeholder={translations.password}
            autoCapitalize="none"
          />
          <Image
            source={require('../assets/icons/password.png')}
            style={GlobalStyles.passwordIcon}
          />
          <Image
            source={require('../assets/icons/eyeoff.png')}
            style={GlobalStyles.eyeIcon}
          />
        </View>
        <TouchableOpacity onPress={onResetPassword}>
          <Text style={styles.resetPassword}>
            {translations.forgotPassword}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={GlobalStyles.confirmButton}
        onPress={onLoginPress}
      >
        <Text style={GlobalStyles.confirmButtonText}>{translations.logIn}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  mainArea: {
    height: screenHeight * 0.2,
    width: screenWidth * 0.8,
    //height: 150,
    //width: 320,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',
    marginBottom: 30,
    backgroundColor: 'white',
  },
  resetPassword: {
    color: Color.orange_700,
    padding: Border.br_3xs,
    marginBottom: 50,
    marginLeft: 162,
  },
});

export default LoginInput;
