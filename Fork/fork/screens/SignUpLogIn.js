import React, { useCallback } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import {LinearGradient}  from 'expo-linear-gradient';
import { Border, Color, GlobalStyles } from "../GlobalStyles.js";

const SignUpLogIn = ({ navigation }) => {
  const onSignUp = useCallback(() => {
    navigation.navigate("UserType"); 
  }, [navigation]);

  const onLogIn= useCallback(() => {
    navigation.navigate("Login");
  }, [navigation]);

  const onStartWithoutAccount = useCallback(() => {
    navigation.navigate("Home"); 
  }, [navigation]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
          colors={[Color.orange_700, Color.yellow_100]} 
          style={styles.container}
          start={{ x: 0, y: 0}}
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
              <Text style={GlobalStyles.startButtonText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={GlobalStyles.startButton} onPress={onLogIn}>
              <Text style={GlobalStyles.startButtonText}>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onStartWithoutAccount}>
              <Text style={GlobalStyles.startText}>Start without an account</Text>
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