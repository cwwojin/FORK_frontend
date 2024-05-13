import React, { useCallback, useState }  from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import {LinearGradient}  from 'expo-linear-gradient';
import { Border, Color, GlobalStyles } from "../GlobalStyles.js";
import { useNavigation } from '@react-navigation/native';

const ResetPassword = ({ navigation }) => {
  
  const onConfirm = useCallback(() => {
    navigation.navigate("Login");
  }, [navigation]);

  const [verificationCode, setVerificationCode] = useState('');

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.mainArea}>
          <Text style={GlobalStyles.title}>Reset your password</Text>
          <Image
            style={styles.image}
            source={require('../assets/icons/password.png')}
          />
          <Text style={styles.text}>Please enter your email below to reset your password.</Text>
          <View style={GlobalStyles.inputWrapper}>
            <TextInput
                style={GlobalStyles.registrationInput}
                onChangeText={setVerificationCode}
                value={verificationCode}
                placeholder="Email"
                autoCapitalize="none"
            />
            <Image source={require("../assets/icons/email.png")} style={GlobalStyles.passwordIcon} />
          </View>
        </View>
        <TouchableOpacity style={GlobalStyles.confirmButton} onPress={onConfirm}>
        <Text style={GlobalStyles.confirmButtonText}>Confirm</Text>
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