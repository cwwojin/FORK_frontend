import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { Border, Color, GlobalStyles } from "../GlobalStyles.js";
import { useNavigation } from '@react-navigation/native';
import { handleLogin, registerUser } from '../screens/api';

import { getAllTranslations, getLanguageToken } from '../LanguageUtils';

const SignUpInputFacility = () => {
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [translations, setTranslations] = useState({});

    useEffect(() => {
      const fetchTranslations = async () => {
        const fetchedTranslations = await getAllTranslations();
        setTranslations(fetchedTranslations);
      };
      fetchTranslations();
    }, []);


    const handleRegister = async () => {
      if (password !== confirmPassword) {
        Alert.alert(translations.error, translations.passwordsDoNotMatch);
        return;
      }
      try {
          const data = await registerUser(username, password, 2, email);
          console.log("Facility user registration data:", data);
          if (handleLogin(username, password)) {
            navigation.navigate("FacilityInformation", { authorId: data.data.id, email: data.data.email }); 
          } else {
            console.error("login failed");
          }
      } catch (error) {
        console.error('Error in handleRegister for Facility user : ', error);
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
                <Image source={require("../assets/icons/username.png")} style={GlobalStyles.inputIcon} />
            </View>
            <View style={GlobalStyles.inputWrapper}>
                <TextInput
                  style={GlobalStyles.registrationInput}
                  onChangeText={setEmail}
                  value={email}
                  placeholder={translations.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <Image source={require("../assets/icons/email.png")} style={GlobalStyles.inputIcon} />
            </View>
            <View style={GlobalStyles.inputWrapper}>
                <TextInput
                  style={GlobalStyles.registrationInput}
                  onChangeText={setPassword}
                  value={password}
                  placeholder={translations.password}
                  autoCapitalize="none"  
                />
                <Image source={require("../assets/icons/password.png")} style={GlobalStyles.passwordIcon} />
                <Image source={require("../assets/icons/eyeoff.png")} style={GlobalStyles.eyeIcon} />
            </View>
            <View style={GlobalStyles.inputWrapper}>
                <TextInput
                  style={GlobalStyles.registrationInput}
                  onChangeText={setConfirmPassword}
                  value={confirmPassword}
                  placeholder={translations.confirmPassword}
                  autoCapitalize="none"  
                />
                <Image source={require("../assets/icons/password.png")} style={GlobalStyles.passwordIcon} />
                <Image source={require("../assets/icons/eyeoff.png")} style={GlobalStyles.eyeIcon} />
            </View>
          </View>
          <TouchableOpacity style={GlobalStyles.confirmButton} onPress={handleRegister}>
          <Text style={GlobalStyles.confirmButtonText}>{translations.signUp}</Text>
        </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: 'white', 
    },
    mainArea: {
      height: 320,
      width: 320,
      justifyContent: 'center',
      alignItems: 'center',
      resizeMode: 'cover',  
      marginBottom: 30, 
      backgroundColor: 'white', 
    },
});

export default SignUpInputFacility;
