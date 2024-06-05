import React, { useCallback, useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Image, TextInput, Button } from 'react-native';
import { Border, Color, GlobalStyles } from "../GlobalStyles.js"; 
import placeholderImage from '../assets/placeholders/long_image.png';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import * as ImageManipulator from 'expo-image-manipulator';
import { registerFacility } from './api';
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
import { getAllTranslations, getLanguageToken } from '../LanguageUtils';

const dayToNumber = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 7
};

const cuisines = [
  { id: 1, name: 'Korean', icon: require('../assets/icons/attributes/korean.png') },
  { id: 2, name: 'Japanese', icon: require('../assets/icons/attributes/japanese.png') },
  { id: 3, name: 'Chinese', icon: require('../assets/icons/attributes/chinese.png') },
  { id: 4, name: 'Asian', icon: require('../assets/icons/attributes/asian.png') },
  { id: 5, name: 'Western', icon: require('../assets/icons/attributes/western.png') },
  { id: 6, name: 'Pizza', icon: require('../assets/icons/attributes/pizza.png') },
  { id: 7, name: 'Burger', icon: require('../assets/icons/attributes/burger.png') },
  { id: 8, name: 'Chicken', icon: require('../assets/icons/attributes/chicken.png') },
  { id: 9, name: 'Salad', icon: require('../assets/icons/attributes/salad.png') },
  { id: 10, name: 'Cafe', icon: require('../assets/icons/attributes/coffee.png') },
  { id: 11, name: 'Bar', icon: require('../assets/icons/attributes/bar.png') },
];


const dietaryOptions = [
  { id: 12, name: 'Vegetarian', icon: require('../assets/icons/attributes/vegetarian.png') },
  { id: 13, name: 'Vegan', icon: require('../assets/icons/attributes/salad.png') },
  { id: 14, name: 'Pescatarian', icon: require('../assets/icons/attributes/pescatarian.png') },
  { id: 15, name: 'Halal', icon: require('../assets/icons/attributes/halal.png') },
  { id: 16, name: 'LactoseFree', icon: require('../assets/icons/attributes/lactosefree.png') },
  { id: 17, name: 'GlutenFree', icon: require('../assets/icons/attributes/glutenfree.png') },
];

const DayHoursInput = ({ day, hours, setHours }) => {
  
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    const fetchTranslations = async () => {
      const fetchedTranslations = await getAllTranslations();
      setTranslations(fetchedTranslations);
    };
    fetchTranslations();
  }, []);

  const handleOpenTimeChange = (time) => {
    const newHours = { ...hours, open: time };
    setHours(day, newHours);
  };

  const handleCloseTimeChange = (time) => {
    const newHours = { ...hours, close: time };
    setHours(day, newHours);
  };

  return (
    <View style={styles.dayHoursContainer}>
      <Text style={styles.dayText}>{day}</Text>
      <View style={GlobalStyles.inputWrapper1}>
        <TextInput
          style={GlobalStyles.registrationInput1}
          onChangeText={handleOpenTimeChange}
          value={hours.open}
          placeholder={translations.openTimePlaceholder}
        />
        <Image source={require("../assets/icons/hour.png")} style={GlobalStyles.inputIcon} />
      </View>
      <View style={GlobalStyles.inputWrapper1}>
        <TextInput
          style={GlobalStyles.registrationInput1}
          onChangeText={handleCloseTimeChange}
          value={hours.close}
          placeholder={translations.closeTimePlaceholder}
        />
        <Image source={require("../assets/icons/hour.png")} style={GlobalStyles.inputIcon} />
      </View>
    </View>
  );
};

const API_KEY = '609b3e6da632a6e07f4cc1bd8a5fa05c';

const FacilityInformation = ({navigation}) => {
  const route = useRoute();
  //const authorId = route.params.authorId;
  //const email = route.params.email;
  const authorId = 10;
  const email = "ayahamane13@gmail.com";

  const [facilityInfo, setFacilityInfo] = useState({
    menuItems: [],
    stampProgram: {
      imageUri: '',
      rewards: [{ name: '', cnt: '' }]
    } 
  });

  const [translations, setTranslations] = useState({});

  useEffect(() => {
    const fetchTranslations = async () => {
      const fetchedTranslations = await getAllTranslations();
      setTranslations(fetchedTranslations);
    };
    fetchTranslations();
  }, []);

  const [facilityImageUri, setFacilityImageUri] = useState('');
  const [name, setName] = useState('');
  const [englishName, setEnglishName] = useState('');
  const [location, setLocation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [businessRegNo, setBusinessRegNo] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [cuisineType, setCuisineType] = useState([]);
  const [dietaryPreferences, setDietaryPreferences] = useState([]);
  const [openingHours, setOpeningHours] = useState({
    Monday: { open: '', close: '' },
    Tuesday: { open: '', close: '' },
    Wednesday: { open: '', close: '' },
    Thursday: { open: '', close: '' },
    Friday: { open: '', close: '' },
    Saturday: { open: '', close: '' },
    Sunday: { open: '', close: '' },
  });

  const [websiteURL, setWebsiteURL] = useState('');
  const [postNumber, setPostNumber] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [roadAddress, setRoadAddress] = useState('');
  const [englishAddress, setEnglishAddress] = useState('');
  const [lat, setLat] = useState(1.0);
  const [lng, setLng] = useState(1.0);

  const handleSelectCuisine = (cuisine) => {
    setCuisineType(prev => {
      if (prev.includes(cuisine)) return prev.filter(item => item !== cuisine);
      else return [...prev, cuisine];
    });
  };

  const handleSelectDietaryPreference = (preference) => {
    setDietaryPreferences(prev => {
      if (prev.includes(preference)) return prev.filter(item => item !== preference);
      else return [...prev, preference];
    });
  };
  
  const getCoordinates = async (address) => {
    console.log("address: " + address);
    try {
        const response = await axios.get('https://dapi.kakao.com/v2/local/search/address.json', {
            headers: {
                Authorization: `KakaoAK ${API_KEY}`
            },
            params: {
                query: address
            }
        });

        const { documents } = response.data;
        if (documents.length > 0) {
            const { x, y } = documents[0].address || documents[0].road_address;
            return { latitude: parseFloat(y), longitude: parseFloat(x) };
        } else {
            console.error('No address found');
            return { latitude: 0, longitude: 0 };
        }
    } catch (error) {
        console.error('Error fetching coordinates: ', error);
        return { latitude: 0, longitude: 0 };
    }
  };

  const handleRegisterationRequest = async () => {
    console.log("In handle registration request");
    const { latitude, longitude } = await getCoordinates(roadAddress);
    //await getCoordinates("대전 유성구 대학로 291 카이스트 학술문화관 2층");
    console.log("latitude : " + latitude + ", longitude : " + longitude);
    const rewards = facilityInfo.stampProgram.rewards.map(reward => ({
      name: reward.name,
      cnt: parseInt(reward.cnt, 10) || 0
    }));
  
    const totalCnt = rewards.reduce((acc, reward) => acc + reward.cnt, 0);
  
    const facilityData = {
      authorId,
      title: name,
      content: {
        name,
        englishName,
        type: "",
        businessId: businessRegNo,
        phone: phoneNumber,
        email,
        url: websiteURL,
        description: serviceDescription,
        profileImgFile: facilityImageUri ? facilityImageUri.split('/').pop() : '',
        address: {
          postNumber,
          country,
          city,
          roadAddress,
          englishAddress,
          lat: latitude,
          lng: longitude
        },
        openingHours: Object.keys(openingHours).map(day => {
          const hours = openingHours[day];
          if (hours.open !== 'Closed' && hours.close !== 'Closed' && hours.open !== '' && hours.close !== '' ) {
            return {
              day: dayToNumber[day],
              openTime: hours.open,
              closeTime: hours.close
            };
          } 
          return null;
        }).filter(Boolean),
        menu: facilityInfo.menuItems.map(item => ({
          name: item.name,
          description: item.serviceDescription,
          price: item.price,
          quantity: item.quantity,
          imgFile: item.imageUri ? item.imageUri.split('/').pop() : ''
        })),
        preferences: [...cuisineType, ...dietaryPreferences], 
        stampRuleset: {
          totalCnt: totalCnt,
          logoImgFile: facilityInfo.stampProgram.imageUri ? facilityInfo.stampProgram.imageUri.split('/').pop() : '',
          rewards: rewards
        }
      }
    };
  
    const images = [];
    if (facilityImageUri) images.push({ uri: facilityImageUri });
    facilityInfo.menuItems.forEach(item => {
      if (item.imageUri) images.push({ uri: item.imageUri });
    });
    if (facilityInfo.stampProgram.imageUri) images.push({ uri: facilityInfo.stampProgram.imageUri });
  
    try {
      //console.log('starting');
      //console.log("images : "+JSON.stringify(images, null, 2));
      const response = await registerFacility(facilityData, images);
      console.log('Facility registration request sent successfully:', JSON.stringify(response.data, null, 2));
      navigation.navigate("PushNotification");  
    } catch (error) {
      Alert.alert('Error', 'Failed to send facility registration request. Please try again.');
      console.error('Error sending facility registration request:', error);
    }
  };
  

  const addMenuItem = () => {
    setFacilityInfo(prevState => ({
      ...prevState,
      menuItems: [...prevState.menuItems, { name: '', serviceDescription: '', price: '', quantity: '' }]
    }));
  };

  const updateStampProgram = (field, value) => {
    setFacilityInfo(prevState => ({
      ...prevState,
      stampProgram: {
        ...prevState.stampProgram,
        [field]: value
      }
    }));
  };

  const handleRewardChange = (rewardIndex, field, value) => {
    const newRewards = [...facilityInfo.stampProgram.rewards];
    if (field === 'cnt') {
      newRewards[rewardIndex][field] = isNaN(parseInt(value, 10)) ? '' : parseInt(value, 10);
    } else {
      newRewards[rewardIndex][field] = value;
    }
    updateStampProgram('rewards', newRewards);
  };

  const addReward = () => {
    const newRewards = [...facilityInfo.stampProgram.rewards, { name: '', cnt: '' }];
    updateStampProgram('rewards', newRewards);
  };

  const requestMediaLibraryPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return false;
    }
    return true;
  };

  const selectImage = async (index, type) => {
    try {
      const hasPermission = await requestMediaLibraryPermissions();
      if (!hasPermission) return;
  
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      console.log("Result object:", result);
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const source = { uri: result.assets[0].uri };
  
        const compressedImage = await ImageManipulator.manipulateAsync(
          source.uri,
          [],
          { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
        );
  
        console.log("Compressed image uri:", compressedImage.uri);
  
        if (type === 'facility') {
          setFacilityImageUri(compressedImage.uri);
        } else if (type === 'menu') {
          const newMenuItems = [...facilityInfo.menuItems];
          newMenuItems[index].imageUri = compressedImage.uri;
          setFacilityInfo({ ...facilityInfo, menuItems: newMenuItems });
        } else if (type === 'stamp') {
          const updatedStampProgram = { ...facilityInfo.stampProgram, imageUri: compressedImage.uri };
          setFacilityInfo({ ...facilityInfo, stampProgram: updatedStampProgram });
        }
      } else {
        console.log("Image selection was canceled");
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  };
  
  const updateMenuItem = (index, field, value) => {
    const newMenuItems = [...facilityInfo.menuItems];
    if (field === 'price') {
      newMenuItems[index][field] = isNaN(parseInt(value, 10)) ? '' : parseInt(value, 10); 
    } else {
      newMenuItems[index][field] = value;
    }
    setFacilityInfo({ ...facilityInfo, menuItems: newMenuItems });
  };

  const setDayHours = (day, hours) => {
    setOpeningHours(prevHours => ({
      ...prevHours,
      [day]: hours
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={GlobalStyles.h2}>{translations.myFacility}</Text>

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
            placeholder={translations.name}
          />
          <Image source={require("../assets/icons/facility.png")} style={GlobalStyles.inputIcon} />
        </View>
        <View style={GlobalStyles.inputWrapper1}>
          <TextInput
            style={GlobalStyles.registrationInput1}
            onChangeText={setEnglishName}
            value={englishName}
            placeholder={translations.englishName}
          />
          <Image source={require("../assets/icons/facility.png")} style={GlobalStyles.inputIcon} />
        </View>
        <View style={GlobalStyles.inputWrapper1}>
          <TextInput
            style={GlobalStyles.registrationInput1}
            onChangeText={setServiceDescription}
            value={serviceDescription}
            placeholder={translations.serviceDescription}
          />
          <Image source={require("../assets/icons/service.png")} style={GlobalStyles.inputIcon1} />
        </View>
        <View style={GlobalStyles.inputWrapper1}>
          <TextInput
            style={GlobalStyles.registrationInput1}
            onChangeText={setWebsiteURL}
            value={websiteURL}
            placeholder={translations.websiteURL}
          />
          <Image source={require("../assets/icons/url.png")} style={GlobalStyles.inputIcon} />
        </View>
        <View style={GlobalStyles.inputWrapper1}>
          <TextInput
            style={GlobalStyles.registrationInput1}
            onChangeText={setPhoneNumber}
            value={phoneNumber}
            placeholder={translations.phoneNumber}
          />
          <Image source={require("../assets/icons/phone.png")} style={GlobalStyles.inputIcon} />
        </View>
        <View style={GlobalStyles.inputWrapper1}>
          <TextInput
            style={GlobalStyles.registrationInput1}
            onChangeText={setBusinessRegNo}
            value={businessRegNo}
            placeholder={translations.businessRegistrationNumber}
          />
          <Image source={require("../assets/icons/business.png")} style={GlobalStyles.inputIcon3} />
        </View>
        <View style={GlobalStyles.inputWrapper1}>
          <TextInput
            style={GlobalStyles.registrationInput1}
            onChangeText={setRoadAddress}
            value={roadAddress}
            placeholder={translations.roadAddress}
          />
          <Image source={require("../assets/icons/location.png")} style={GlobalStyles.inputIcon4} />
        </View>
        <View style={GlobalStyles.inputWrapper1}>
          <TextInput
            style={GlobalStyles.registrationInput1}
            onChangeText={setEnglishAddress}
            value={englishAddress}
            placeholder={translations.englishAddress}
          />
          <Image source={require("../assets/icons/location.png")} style={GlobalStyles.inputIcon4} />
        </View>
        <View style={GlobalStyles.inputWrapper1}>
          <TextInput
            style={GlobalStyles.registrationInput1}
            onChangeText={setPostNumber}
            value={postNumber}
            placeholder={translations.postNumber}
          />
          <Image source={require("../assets/icons/location.png")} style={GlobalStyles.inputIcon4} />
        </View>
        <View style={GlobalStyles.inputWrapper1}>
          <TextInput
            style={GlobalStyles.registrationInput1}
            onChangeText={setCity}
            value={city}
            placeholder={translations.city}
          />
          <Image source={require("../assets/icons/location.png")} style={GlobalStyles.inputIcon4} />
        </View>
        <View style={GlobalStyles.inputWrapper1}>
          <TextInput
            style={GlobalStyles.registrationInput1}
            onChangeText={setCountry}
            value={country}
            placeholder={translations.country}
          />
          <Image source={require("../assets/icons/location.png")} style={GlobalStyles.inputIcon4} />
        </View>
      </View>
      <View style={styles.line}></View>
      <Text style={styles.subHeader}>{translations.cuisineTypes}</Text>
      <View style={styles.grid}>
        {cuisines.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.option, cuisineType.includes(item.id) && styles.selected]}
            onPress={() => handleSelectCuisine(item.id)}
          >
            <Image source={item.icon} style={styles.icon1} />
            <Text>{item.name}</Text>
            {/* <Text>{translations.pref[item.name]}</Text> */}
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.line}></View>
      <Text style={styles.subHeader}>{translations.dietaryPreferences}</Text>
      <View style={styles.grid}>
        {dietaryOptions.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.option, dietaryPreferences.includes(item.id) && styles.selected]}
            onPress={() => handleSelectDietaryPreference(item.id)}
          >
            <Image source={item.icon} style={styles.icon1} />
            <Text>{item.name}</Text>
            {/* <Text>{translations.pref[item.name]}</Text> */}
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.line}></View>
      <Text style={styles.subHeader1}>{translations.openingHours}</Text>
      {daysOfWeek.map(day => (
        <DayHoursInput
          key={day}
          day={day}
          hours={openingHours[day]}
          setHours={setDayHours}
        />
      ))}
      <View style={styles.line}></View>
      <Text style={styles.subHeader}>{translations.menu}</Text>
      {facilityInfo.menuItems.map((item, index) => (
        <View key={index} style={styles.menuItem}>
          <TouchableOpacity onPress={() => selectImage(index, 'menu')}>
            <Image 
              source={item.imageUri ? { uri: item.imageUri } : placeholderImage} 
              style={styles.image} 
            />
          </TouchableOpacity>
          <View style={GlobalStyles.inputWrapper2}>
            <TextInput
              style={GlobalStyles.registrationInput1}
              onChangeText={(text) => updateMenuItem(index, 'name', text)}
              value={item.name}
              placeholder={translations.menuItemName}
            />
            <Image source={require("../assets/icons/service.png")} style={GlobalStyles.inputIcon} />
          </View>
          <View style={GlobalStyles.inputWrapper2}>
            <TextInput
              style={GlobalStyles.registrationInput1}
              onChangeText={(text) => updateMenuItem(index, 'serviceDescription', text)}
              value={item.serviceDescription}
              placeholder={translations.serviceDescription}
            />
            <Image source={require("../assets/icons/menuDescription.png")} style={GlobalStyles.inputIcon} />
          </View>
          <View style={GlobalStyles.inputWrapper2}>
            <TextInput
              style={GlobalStyles.registrationInput1}
              onChangeText={(text) => updateMenuItem(index, 'price', text)}
              keyboardType="numeric"
              value={item.price}
              placeholder={translations.price}
            />
            <Image source={require("../assets/icons/price.png")} style={GlobalStyles.inputIcon} />
          </View>
          <View style={GlobalStyles.inputWrapper2}>
            <TextInput
              style={GlobalStyles.registrationInput1}
              onChangeText={(text) => updateMenuItem(index, 'quantity', text)}
              value={item.quantity.toString()}
              placeholder={translations.quantity}
            />
            <Image source={require("../assets/icons/number.png")} style={GlobalStyles.inputIcon1} />
          </View>
        </View>
      ))}

      <Button title={translations.menuItem || 'Add Menu Item'} onPress={addMenuItem} color={Color.orange_700} marginBottom={15}/>
      <View style={styles.line}></View>
      <Text style={styles.subHeader1}>{translations.stamps}</Text>
      <View style={styles.menuItem}>
        <TouchableOpacity onPress={() => selectImage(null, 'stamp')}>
          <Image 
            source={facilityInfo.stampProgram.imageUri ? { uri: facilityInfo.stampProgram.imageUri } : placeholderImage} 
            style={styles.image} 
          />
        </TouchableOpacity>
        <View style={GlobalStyles.inputWrapper2}>
          <Text style={styles.totalStampsText}>Total Number of Stamps: {facilityInfo.stampProgram.rewards.reduce((acc, reward) => acc + (parseInt(reward.cnt, 10) || 0), 0)}</Text>
        </View>
        {facilityInfo.stampProgram.rewards.map((reward, rewardIndex) => (
          <View key={rewardIndex}>
            <View style={GlobalStyles.inputWrapper2}>
              <TextInput
                style={GlobalStyles.registrationInput1}
                onChangeText={text => handleRewardChange(rewardIndex, 'name', text)}
                value={reward.name}
                placeholder={translations.rewardName}
              />
              <Image source={require("../assets/icons/stamp.png")} style={GlobalStyles.inputIcon5} />
            </View>
            <View style={GlobalStyles.inputWrapper2}>
              <TextInput
                style={GlobalStyles.registrationInput1}
                onChangeText={text => handleRewardChange(rewardIndex, 'cnt', text)}
                value={reward.cnt.toString()}
                keyboardType="numeric"
                placeholder={translations.numberOfStampsRequired}
              />
              <Image source={require("../assets/icons/number.png")} style={GlobalStyles.inputIcon1} />
            </View>
          </View>
        ))}
        <Button title={translations.reward || 'Add Reward'} onPress={addReward} color={Color.orange_700} />
      </View>
      <View style={styles.mainArea}>
        <TouchableOpacity style={GlobalStyles.confirmButton} onPress={handleRegisterationRequest}>
          <Text style={GlobalStyles.confirmButtonText}>{translations.confirm}</Text>
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
    width: 335,
    height: 130,
    borderRadius: Border.br_2xs,
    marginBottom: 17,
  },
  icon: {
    width: 50,
    height: 50,
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
  subHeader1: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 15,
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
  totalStampsText: {
    color: Color.orange_700, 
    marginBottom: 10, 
  },
  dayText: {
    color: Color.orange_700, 
    marginBottom: 5,
    marginLeft: 5,
    fontSize: 16,

  },
  dayHoursContainer: {
    flexDirection: 'column',
    alignItems: 'left',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginLeft: 10,
    width: 372,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 40,
  },
  option: {
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    width: '30%',
    borderRadius: 10,
  },
  selected: {
    borderColor: 'orange',
  },
  icon1: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  doubleIcon: {
    width: 50,
    height: 30,
    marginBottom: 5,
  }
});

export default FacilityInformation;