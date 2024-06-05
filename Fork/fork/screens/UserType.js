import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import {LinearGradient}  from 'expo-linear-gradient';
import { Border, Color, GlobalStyles } from "../GlobalStyles.js";
import { getAllTranslations, getLanguageToken } from '../LanguageUtils';

const UserType = ({ navigation }) => {
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    const fetchTranslations = async () => {
      const fetchedTranslations = await getAllTranslations();
      setTranslations(fetchedTranslations);
    };
    fetchTranslations();
  }, []);
  const onFacilityOwner = useCallback(() => {
    navigation.navigate("SignUpFacility"); 
  }, [navigation]);

  const onKaistMember = useCallback(() => {
    navigation.navigate("SignUpKaist");
  }, [navigation]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.mainArea}>
          <Text style={GlobalStyles.title}>{translations.whichUserAreYou}</Text>
        </View>
        <View style={GlobalStyles.authOptions}>
          <TouchableOpacity style={GlobalStyles.registerButton} onPress={onFacilityOwner}>
            <Text style={GlobalStyles.registerButtonText}>{translations.facilityOwner}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={GlobalStyles.registerButton} onPress={onKaistMember}>
            <Text style={GlobalStyles.registerButtonText}>{translations.kaistMember}</Text>
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
    height: 80,
    width: 300,
    alignItems: 'center', 
    justifyContent: 'center',
    resizeMode: 'cover',
    marginBottom: 100, 
    marginTop: 30,
  }
});

export default UserType;