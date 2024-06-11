import React, { useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Border, Color, GlobalStyles } from '../GlobalStyles.js';
import { useNavigation } from '@react-navigation/native';
import { getAllTranslations, getLanguageToken } from '../LanguageUtils';
import { LANGUAGE_CODES } from 'react-native-translator';

const PushNotification = ({ navigation }) => {
  const onConfirm = useCallback(() => {
    navigation.navigate('WaitingApproval');
  }, [navigation]);

  const [translations, setTranslations] = useState({});

  useEffect(() => {
    const fetchTranslations = async () => {
      const fetchedTranslations = await getAllTranslations();
      setTranslations(fetchedTranslations);
    };
    fetchTranslations();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.mainArea}>
          <Text style={GlobalStyles.title}>{translations.allowNotif}</Text>
          <Text style={styles.text}>{translations.permissionNotif}</Text>
        </View>
        <View style={styles.subArea}>
          <TouchableOpacity
            style={GlobalStyles.confirmButton}
            onPress={onConfirm}
          >
            <Text style={GlobalStyles.confirmButtonText}>
              {translations.yes}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={GlobalStyles.confirmButton1}
            onPress={onConfirm}
          >
            <Text style={GlobalStyles.confirmButtonText1}>
              {translations.no}
            </Text>
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
    width: 340,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.white,
    marginTop: 250,
    flexDirection: 'column',
    gap: 40,
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

export default PushNotification;
