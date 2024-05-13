import React, { useCallback, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Image, TextInput, Button } from 'react-native';
import { Border, Color, GlobalStyles } from "../GlobalStyles.js"; 
import { launchImageLibrary } from 'react-native-image-picker';
import placeholderImage from '../assets/placeholders/long_image.png';


const FacilityInformation = ({navigation}) => {

  const [facilityInfo, setFacilityInfo] = useState({
    menuItems: [],
    stampPrograms: [] 
  });

  const onRegister = useCallback(() => {
    navigation.navigate("PushNotification");
  }, [navigation]);

  const [facilityImageUri, setFacilityImageUri] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [businessRegNo, setBusinessRegNo] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [cuisineType, setCuisineType] = useState('');
  const [openingHours, setOpeningHours] = useState('');

  const addMenuItem = () => {
    setFacilityInfo(prevState => ({
      ...prevState,
      menuItems: [...prevState.menuItems, { name: '', serviceDescription: '', price: '' }]
    }));
  };
  
  const addStampProgram = () => {
  setFacilityInfo(prevState => ({
    ...prevState,
    stampPrograms: [...prevState.stampPrograms, { name: '', totalStamps: '', reward: '', imageUri: '' }]
  }));
  };

  const updateStampProgram = (index, field, value) => {
    const newStampPrograms = [...facilityInfo.stampPrograms];
    newStampPrograms[index][field] = value;
    setFacilityInfo({ ...facilityInfo, stampPrograms: newStampPrograms });
};

  const selectImage = (index, type) => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
        } else {
            const source = { uri: response.assets[0].uri };
            if (type === 'facility') {
              setFacilityImageUri(source.uri);
            } else if (type === 'stamp') {
              updateStampProgram(index, 'imageUri', source.uri);
            }
        }
    });
};


  const updateMenuItem = (index, field, value) => {
    const newMenuItems = [...facilityInfo.menuItems];
    newMenuItems[index][field] = value;
    setFacilityInfo({ ...facilityInfo, menuItems: newMenuItems});
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={GlobalStyles.h2}>MY FACILITY</Text>

      <View style={styles.section}>
        <View style={GlobalStyles.inputWrapper1}>
          <TouchableOpacity onPress={() => selectImage(null, 'facility')}>
            <Image
              style={styles.image}
              source={facilityImageUri ? { uri: facilityImageUri } : placeholderImage}
            />
          </TouchableOpacity>
        </View>
        <View style={GlobalStyles.inputWrapper1}>
          <TextInput
            style={GlobalStyles.registrationInput1}
            onChangeText={setName}
            value={name}
            placeholder="Name"
          />
          <Image source={require("../assets/icons/facility.png")} style={GlobalStyles.inputIcon} />
        </View>
        <View style={GlobalStyles.inputWrapper1}>
          <TextInput
            style={GlobalStyles.registrationInput1}
            onChangeText={setLocation}
            value={location}
            placeholder="Location"
          />
          <Image source={require("../assets/icons/location.png")} style={GlobalStyles.inputIcon4} />
        </View>
        <View style={GlobalStyles.inputWrapper1}>
          <TextInput
            style={GlobalStyles.registrationInput1}
            onChangeText={setPhoneNumber}
            value={phoneNumber}
            placeholder="Phone Number"
          />
          <Image source={require("../assets/icons/phone.png")} style={GlobalStyles.inputIcon} />
        </View>
        <View style={GlobalStyles.inputWrapper1}>
          <TextInput
            style={GlobalStyles.registrationInput1}
            onChangeText={setBusinessRegNo}
            value={businessRegNo}
            placeholder="Business Registration Number"
          />
          <Image source={require("../assets/icons/business.png")} style={GlobalStyles.inputIcon3} />
        </View>
        <View style={GlobalStyles.inputWrapper1}>
          <TextInput
            style={GlobalStyles.registrationInput1}
            onChangeText={setServiceDescription}
            value={serviceDescription}
            placeholder="Service Description"
          />
          <Image source={require("../assets/icons/service.png")} style={GlobalStyles.inputIcon1} />
        </View>
        <View style={GlobalStyles.inputWrapper1}>
          <TextInput
            style={GlobalStyles.registrationInput1}
            onChangeText={setCuisineType}
            value={cuisineType}
            placeholder="Cuisine & Diet Type"
          />
          <Image source={require("../assets/icons/types.png")} style={GlobalStyles.inputIcon2} />
        </View>
        <View style={GlobalStyles.inputWrapper1}>
          <TextInput
            style={GlobalStyles.registrationInput1}
            onChangeText={setOpeningHours}
            value={openingHours}
            placeholder="Opening Hours"
          />
          <Image source={require("../assets/icons/hour.png")} style={GlobalStyles.inputIcon} />
        </View>
      </View>
      <View style={styles.line}></View>
      <Text style={styles.subHeader}>MENU</Text>
      {facilityInfo.menuItems.map((item, index) => (  
        <View key={index} style={styles.menuItem}>
          <View style={GlobalStyles.inputWrapper2}>
            <TextInput
              style={GlobalStyles.registrationInput1}
              onChangeText={(text) => updateMenuItem(index, 'name', text)}
              value={item.name}
              placeholder="Menu Item Name"
            />
            <Image source={require("../assets/icons/service.png")} style={GlobalStyles.inputIcon} />
          </View>
          <View style={GlobalStyles.inputWrapper2}>
            <TextInput
              style={GlobalStyles.registrationInput1}
              onChangeText={(text) => updateMenuItem(index, 'serviceDescription', text)}
              value={item.serviceDescription}
              placeholder="Service Description"
            />
            <Image source={require("../assets/icons/menuDescription.png")} style={GlobalStyles.inputIcon} />
          </View>
          <View style={GlobalStyles.inputWrapper2}>
            <TextInput
              style={GlobalStyles.registrationInput1}
              onChangeText={(text) => updateMenuItem(index, 'price', text)}
              keyboardType="numeric"
              value={item.price}
              placeholder="Price"
            />
            <Image source={require("../assets/icons/price.png")} style={GlobalStyles.inputIcon} />
          </View>
        </View>
      ))}
      <Button title="Add Menu Item" onPress={addMenuItem} color={Color.orange_700} marginBottom={15}/>
      <View style={styles.line}></View>
      <Text style={styles.subHeader}>STAMPS</Text>
      {facilityInfo.stampPrograms.map((program, index) => (
        <View key={index} style={styles.menuItem}>
          <TouchableOpacity onPress={() => selectImage(index, 'stamp')}>
            <Image 
              source={program.imageUri ? { uri: program.imageUri } : placeholderImage} 
              style={styles.image} 
            />
          </TouchableOpacity>
          <View style={GlobalStyles.inputWrapper2}>
            <TextInput
            style={GlobalStyles.registrationInput1}
            onChangeText={text => updateStampProgram(index, 'name', text)}
            value={program.name}
            placeholder="Stamp Program Name"
          />
            <Image source={require("../assets/icons/stamp.png")} style={GlobalStyles.inputIcon} />
          </View>
          <View style={GlobalStyles.inputWrapper2}>
            <TextInput
            style={GlobalStyles.registrationInput1}
            onChangeText={text => updateStampProgram(index, 'totalStamps', text)}
            value={program.totalStamps}
            placeholder="Total Number of Stamps"
          />
            <Image source={require("../assets/icons/number.png")} style={GlobalStyles.inputIcon1} />
          </View>
          <View style={GlobalStyles.inputWrapper2}>
            <TextInput
            style={GlobalStyles.registrationInput1}
            onChangeText={text => updateStampProgram(index, 'reward', text)}
            value={program.reward}
            placeholder="Reward Description"
          />
            <Image source={require("../assets/icons/menuDescription.png")} style={GlobalStyles.inputIcon5} />
          </View>
        </View>
      ))}
      <Button title="Add Stamp Program" onPress={addStampProgram} color={Color.orange_700} />
      <View style={styles.mainArea}>
        <TouchableOpacity style={GlobalStyles.confirmButton} onPress={onRegister}>
          <Text style={GlobalStyles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white'
  },
  mainArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.white,
    marginBottom: 70,
    marginTop: 40,
    gap: 40, 
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  section: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  image: {
    width: 350,
    height: 130,
    alignSelf: 'center',
    borderRadius: Border.br_2xs,
    marginBottom: 17,
  },
  icon: {
    width: 50,
    height: 50,
    alignSelf: 'center',
    marginVertical: 20,
  },
  button: {
    padding: 15,
    backgroundColor: 'blue',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 20,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 15,
  },
  line: {
    height: 2, 
    backgroundColor: 'grey', 
    marginHorizontal: 3,
  },
  menuItem: {
    flexDirection: 'column',
    marginBottom: 20,
  },
});

export default FacilityInformation;