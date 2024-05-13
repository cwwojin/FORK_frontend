import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { Border, Color, GlobalStyles } from "../GlobalStyles.js";
import { useNavigation } from '@react-navigation/native';

const SignUpInputKaist = () => {
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignUp = () => {
      navigation.navigate("VerifyEmail");       
    };

    return (
        <View style={styles.container}>
          <View style={styles.mainArea}>
            <View style={GlobalStyles.inputWrapper}>
                <TextInput
                    style={GlobalStyles.registrationInput}
                    onChangeText={setUsername}
                    value={username}
                    placeholder="Username"
                    autoCapitalize="none"
                />
                <Image source={require("../assets/icons/username.png")} style={GlobalStyles.inputIcon} />
            </View>
            <View style={GlobalStyles.inputWrapper}>
                <TextInput
                  style={GlobalStyles.registrationInput}
                  onChangeText={setEmail}
                  value={email}
                  placeholder="Email"
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
                  placeholder="Password"
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
                  placeholder="Confirm Password"
                  autoCapitalize="none"  
                />
                <Image source={require("../assets/icons/password.png")} style={GlobalStyles.passwordIcon} />
                <Image source={require("../assets/icons/eyeoff.png")} style={GlobalStyles.eyeIcon} />
            </View>
          </View>
          <TouchableOpacity style={GlobalStyles.confirmButton} onPress={handleSignUp}>
          <Text style={GlobalStyles.confirmButtonText}>Sign Up</Text>
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

export default SignUpInputKaist;
