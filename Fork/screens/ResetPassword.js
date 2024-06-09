import { resetPassword } from './api.js';
import React, { useCallback, useState, useEffect}  from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import {LinearGradient}  from 'expo-linear-gradient';
import { Border, Color, GlobalStyles } from "../GlobalStyles.js";
import { useNavigation } from '@react-navigation/native';
import { getAllTranslations, getLanguageToken } from '../LanguageUtils';

const ResetPassword = ({ navigation }) => {
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    const fetchTranslations = async () => {
      const fetchedTranslations = await getAllTranslations();
      setTranslations(fetchedTranslations);
    };
    fetchTranslations();
  }, []);

  const [userId, setUserId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const onConfirm = useCallback(async () => {
      try {
          const response = await resetPassword(userId);
          if (response.status === 'success') {
              navigation.navigate("Login");
          } else {
              setErrorMessage(response.message || translations.resetPasswordFailed);
          }
      } catch (error) {
          setErrorMessage(translations.resetPasswordError);
      }
  }, [navigation, userId, translations]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.mainArea}>
          <Text style={GlobalStyles.title}>{translations.resetPassword}</Text>
          <Image
            style={styles.image}
            source={require('../assets/icons/password.png')}
          />
          <Text style={styles.text}>{translations.enterUsername}</Text>
          <View style={GlobalStyles.inputWrapper}>
            <TextInput
                style={GlobalStyles.registrationInput}
                onChangeText={setUserId}
                value={userId}
                placeholder={translations.username}
                autoCapitalize="none"
            />
            <Image source={require("../assets/icons/email.png")} style={GlobalStyles.passwordIcon} />
          </View>
        </View>
        <TouchableOpacity style={GlobalStyles.confirmButton} onPress={onConfirm}>
        <Text style={GlobalStyles.confirmButtonText}>{translations.confirm}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.white,
  },
  mainArea: {
    flex: 1,
    width: 300,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.white,
    marginTop: 70,
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 40,
    marginTop: 80,
  },
  text: {
    color: 'grey',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 50, 
  },
});

export default ResetPassword;