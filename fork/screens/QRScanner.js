import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Border, Color, FontSize, GlobalStyles } from '../GlobalStyles';
import { LOGIN } from './api';

const QRScanner = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    if (!LOGIN) {
      navigation.replace('SignUpLogIn');
    }
  }, LOGIN);

  const route = useRoute();
  const { facilityID } = route.params;

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setScannedData(data); // Save scanned data
    // Navigate to the new screen with the scanned data as a parameter
    navigation.navigate('GiveStamp', { userID: data, facilityID: facilityID });
  };

  const renderCamera = () => {
    return (
      <View style={styles.cameraContainer}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={styles.camera}
        />
      </View>
    );
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Camera permission not granted</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <View
        style={{
          width: '100%',
          padding: 20,
          backgroundColor: Color.white,
          height: '100%',
        }}
      >
        <View style={{ width: '100%', flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Image
              style={GlobalStyles.icon}
              source={require('../assets/icons/navigate_left.png')}
            />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: -27,
              paddingBottom: 10,
            }}
          >
            <Text style={GlobalStyles.h1}>Give Stamps</Text>
          </View>
        </View>
        <View
          style={{ width: '100%', alignItems: 'center', paddingTop: '40%' }}
        >
          {renderCamera()}
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 40,
  },
  cameraContainer: {
    width: '80%',
    aspectRatio: 1,
    overflow: 'hidden',
    borderRadius: Border.br_sm,
    marginBottom: 40,
  },
  camera: {
    flex: 1,
  },
  button: {
    backgroundColor: Color.orange_700,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: Border.br_sm,
    width: '80%',
  },
  buttonText: {
    color: Color.white,
    fontSize: FontSize.size_xl,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default QRScanner;
