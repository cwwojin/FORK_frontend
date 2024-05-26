import React, { useCallback, useState }  from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import {LinearGradient}  from 'expo-linear-gradient';
import { Border, Color, GlobalStyles } from "../GlobalStyles.js"; 
import { useNavigation, useRoute } from '@react-navigation/native';
import { verifyEmail, resendVerifyEmail } from './api.js';

const VerifyEmail = ({navigation}) => {
  const route = useRoute();
  const username  = route.params.username;
  const [verificationCode, setVerificationCode] = useState('');

  const resendEmail = async () => {
    try {
      setVerificationCode('');
      const data = await resendVerifyEmail(username);
      console.log("Email resent data:", data);
    } catch (error) {
      navigation.navigate("VerifyEmail", { username: username });
      setVerificationCode('');
    }
  };

  
  const handleVerification = async () => {
    try {
        const data = await verifyEmail(username, verificationCode);
        if (data && data.status == "success") { 
          console.log("Email verification data:", data);
          navigation.navigate("Survey", { id: data.data.id });
        } else {
          throw new Error('Verification failed. Please check your code and try again.');
        }
    } catch (error) {
      Alert.alert('Wrong Verification Code', 'Try again with the correct verification code');
      navigation.navigate("VerifyEmail", { username: username })
      setVerificationCode('');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.mainArea}>
          <Text style={GlobalStyles.title}>Verify your KAIST email </Text>
          <Image
            style={styles.image}
            source={require('../assets/icons/openEmail.png')}
          />
          <Text style={styles.text}>We sent a verification code to you email adress. Please check your email inbox.</Text>
          <View style={GlobalStyles.inputWrapper}>
            <TextInput
                style={GlobalStyles.registrationInput}
                onChangeText={setVerificationCode}
                value={verificationCode}
                placeholder="Verification code"
                autoCapitalize="none"
            />
            <Image source={require("../assets/icons/password.png")} style={GlobalStyles.passwordIcon} />
          </View>
          <TouchableOpacity onPress={resendEmail}>
            <Text style={styles.resendText}>Resend code</Text>
          </TouchableOpacity>
          <TouchableOpacity style={GlobalStyles.confirmButton} onPress={handleVerification}>
          <Text style={GlobalStyles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.white,
    marginBottom: 60,
    marginTop: 70,
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 40,
    marginTop: 60,
  },
  text: {
    color: 'grey',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 50, 
  },
  resendText: {
    color: Color.orange_700,
    padding: Border.br_3xs,
    marginBottom: 70,
  },
});

export default VerifyEmail;
