import React, { useCallback, useState }  from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import {LinearGradient}  from 'expo-linear-gradient';
import { Border, Color, GlobalStyles } from "../GlobalStyles.js"; 
import { useNavigation } from '@react-navigation/native';

const VerifyEmail = ({navigation}) => {
  const onResend = useCallback(() => {
    navigation.navigate("VerifyEmail"); 
  }, [navigation]);

  const onConfirm = useCallback(() => {
    navigation.navigate("Survey");
  }, [navigation]);

  const [verificationCode, setVerificationCode] = useState('');

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
          <TouchableOpacity onPress={onResend}>
            <Text style={styles.resendText}>Resend code in 00:30 seconds</Text>
          </TouchableOpacity>
          <TouchableOpacity style={GlobalStyles.confirmButton} onPress={onConfirm}>
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
