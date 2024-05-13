import React, { useState, useCallback} from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { Border, Color, GlobalStyles } from "../GlobalStyles.js";
import { useNavigation } from '@react-navigation/native';

const LoginInput = () => {
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
      navigation.navigate("Home");       
    };

    const onResetPassword = useCallback(() => {
    navigation.navigate("ResetPassword"); 
    }, [navigation]);

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
                  onChangeText={setPassword}
                  value={password}
                  placeholder="Password"
                  autoCapitalize="none"  
                />
                <Image source={require("../assets/icons/password.png")} style={GlobalStyles.passwordIcon} />
                <Image source={require("../assets/icons/eyeoff.png")} style={GlobalStyles.eyeIcon} />
            </View>
            <TouchableOpacity onPress={onResetPassword}>
            <Text style={styles.resetPassword}>Forgot password?</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={GlobalStyles.confirmButton} onPress={handleLogin}>
          <Text style={GlobalStyles.confirmButtonText}>Log In</Text>
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
      height: 150,
      width: 320,
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
