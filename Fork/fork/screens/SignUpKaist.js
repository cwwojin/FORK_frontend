import React, { useCallback } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import {LinearGradient}  from 'expo-linear-gradient';
import { Border, Color, GlobalStyles } from "../GlobalStyles.js";
import SignUpInputKaist from '../components/SignUpInputKaist'; 

const SignUpKaist= ({ navigation }) => {

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.mainArea}>
          <Image
            style={styles.image}
            source={require('../assets/logos/coloredLogo.png')}
          />
          <Text style={GlobalStyles.title}>Sign Up</Text>
        </View>
        <View style={styles.userInputs}>
          <SignUpInputKaist /> 
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.white,
    marginBottom: 70,
    marginTop: 50
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
    marginTop: 75,
  }, 
  userInputs: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 40,
  },
});

export default SignUpKaist;
