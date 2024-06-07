import React, { useCallback, useState, useEffect }  from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import {LinearGradient}  from 'expo-linear-gradient';
import { Border, Color, GlobalStyles } from "../GlobalStyles.js"; 
import { useNavigation } from '@react-navigation/native';
import { getAllTranslations, getLanguageToken } from '../LanguageUtils';

const SuccessfulRegistration = ({navigation}) => {
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    const fetchTranslations = async () => {
      const fetchedTranslations = await getAllTranslations();
      setTranslations(fetchedTranslations);
    };
    fetchTranslations();
  }, []);

  const onStart = useCallback(() => {
    navigation.navigate("Home");
  }, [navigation]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.mainArea}>
          <Image
            style={styles.image}
            source={require('../assets/logos/coloredLogo.png')}
          />
          <Text style={styles.title}>{translations.successfulRegistrationTitle}</Text>
          <TouchableOpacity style={GlobalStyles.confirmButton} onPress={onStart}>
          <Text style={GlobalStyles.confirmButtonText}>{translations.start}</Text>
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
    marginBottom: 70,
    marginTop: 40,
    gap: 60, 
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
    marginTop: 30,
  },
  title: {
    color: Color.black,
    textAlign: 'center',
    fontSize: 35,
    fontWeight: 'bold', 
  },
});

export default SuccessfulRegistration;
