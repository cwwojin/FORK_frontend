import React, { useCallback, useState }  from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import {LinearGradient}  from 'expo-linear-gradient';
import { Border, Color, GlobalStyles } from "../GlobalStyles.js"; 
import { useNavigation } from '@react-navigation/native';

const AdjustFilter = ({navigation}) => {

  const onConfirm = useCallback(() => {
    navigation.navigate("SuccessfulRegistration");
  }, [navigation]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.mainArea}>
          <Text style={GlobalStyles.title}>Adjust filters</Text>
          <Text style={styles.text}>Do you want your food preferences to be always applied by default? You will still be able to remove these filters manually anytime.</Text>
        </View>
        <View style={styles.subArea}>
            <TouchableOpacity style={GlobalStyles.confirmButton} onPress={onConfirm}>
            <Text style={GlobalStyles.confirmButtonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={GlobalStyles.confirmButton1} onPress={onConfirm}>
            <Text style={GlobalStyles.confirmButtonText1}>No</Text>
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
    width: 300,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.white,
    marginTop: 250,
    flexDirection: 'column',
    gap: 30,
  },
  subArea: {
    flex: 1,
    width: 150,
    justifyContent: 'center',
    backgroundColor: Color.white,
    marginBottom: 185,
    flexDirection: 'row',
    gap: 30,
  },
  text: {
    color: 'grey',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 50, 
  },
});

export default AdjustFilter;
