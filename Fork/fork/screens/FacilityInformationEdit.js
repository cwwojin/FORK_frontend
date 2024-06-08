import React, { useCallback, useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Image, TextInput, Button, SafeAreaView, Alert } from 'react-native';
import { Border, Color, FontSize, GlobalStyles } from "../GlobalStyles.js";
import placeholderImage from '../assets/placeholders/long_image.png';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import * as ImageManipulator from 'expo-image-manipulator';
import { editFacility, USERID, getFacilityStampRuleByID, fetchImage, uploadMenuImage, deleteFacilityMenu, deleteFacility, getFacilityMenu, uploadStampLogo, uploadFacilityProfile, LOGIN } from './api';
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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
  { id: 16, name: 'Lactose-Free', icon: require('../assets/icons/attributes/lactosefree.png') },
  { id: 17, name: 'Gluten-Free', icon: require('../assets/icons/attributes/glutenfree.png') },
];

const DayHoursInput = ({ day, hours, setHours }) => {
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
          placeholder="Open Time (e.g., 09:00, Closed)"
        />
        <Image source={require("../assets/icons/hour.png")} style={GlobalStyles.inputIcon} />
      </View>
      <View style={GlobalStyles.inputWrapper1}>
        <TextInput
          style={GlobalStyles.registrationInput1}
          onChangeText={handleCloseTimeChange}
          value={hours.close}
          placeholder="Close Time (e.g., 17:00, Closed)"
        />
        <Image source={require("../assets/icons/hour.png")} style={GlobalStyles.inputIcon} />
      </View>
    </View>
  );
};

const API_KEY = '609b3e6da632a6e07f4cc1bd8a5fa05c';

const FacilityInformationEdit = ({ navigation }) => {
  const route = useRoute();
  //const authorId = route.params.authorId;
  //const email = route.params.email;

  useEffect(() => {
    if (!LOGIN) {navigation.replace("SignUpLogIn")};
  }, LOGIN);

  const { facilityINFO, userEmail } = route.params;
  const authorId = USERID;
  const email = facilityINFO.email ? facilityINFO.email : userEmail;

  const [facilityInfo, setFacilityInfo] = useState({
    menuItems: [],
    stampProgram: {
      imageUri: '',
      rewards: [{ name: '', cnt: '' }]
    }
  });

  console.log(facilityINFO);
  const [facilityImageUri, setFacilityImageUri] = useState("");
  const [facilityImageUriEdit, setFacilityImageUriEdit] = useState(false);
  const [name, setName] = useState(facilityINFO.name);
  const [englishName, setEnglishName] = useState(facilityINFO.english_name)
  const [location, setLocation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(facilityINFO.phone);
  const [businessRegNo, setBusinessRegNo] = useState(facilityINFO.business_id);
  const [serviceDescription, setServiceDescription] = useState(facilityINFO.description);
  const [cuisineType, setCuisineType] = useState(Array.isArray(facilityINFO.preferences) ? facilityINFO.preferences.filter(pref => pref?.type === 0).map(pref => pref?.id) : []);
  const [dietaryPreferences, setDietaryPreferences] = useState(Array.isArray(facilityINFO.preferences) ? facilityINFO.preferences.filter(pref => pref?.type === 1).map(pref => pref?.id) : []);

  const convertOpeningHoursFormat = (openingHoursArray) => {
    const transformedOpeningHours = {
      Monday: { open: '', close: '' },
      Tuesday: { open: '', close: '' },
      Wednesday: { open: '', close: '' },
      Thursday: { open: '', close: '' },
      Friday: { open: '', close: '' },
      Saturday: { open: '', close: '' },
      Sunday: { open: '', close: '' },
    };

    openingHoursArray.forEach((openingHour) => {
      const dayOfWeek = Object.keys(dayToNumber).find(
        (key) => dayToNumber[key] === openingHour?.day
      );

      if (dayOfWeek) {
        transformedOpeningHours[dayOfWeek] = {
          open: openingHour?.open_time,
          close: openingHour?.close_time
        };
      }
    });

    return transformedOpeningHours;
  };

  const [openingHours, setOpeningHours] = useState(convertOpeningHoursFormat(facilityINFO.opening_hours));
  const [websiteURL, setWebsiteURL] = useState(facilityINFO.url);
  const [postNumber, setPostNumber] = useState(facilityINFO.post_number);
  const [country, setCountry] = useState(facilityINFO.country);
  const [city, setCity] = useState(facilityINFO.city);
  const [roadAddress, setRoadAddress] = useState(facilityINFO.road_address);
  const [englishAddress, setEnglishAddress] = useState(facilityINFO.english_address);
  const [stampLogo, setStampLogo] = useState();
  const [stampLogoEdit, setStampLogoEdit] = useState(false);
  const [lat, setLat] = useState(1.0);
  const [lng, setLng] = useState(1.0);

  useEffect(() => {
    const fetchFacilityImage = async () => {
      try {
        const imageUri = await fetchImage(facilityINFO.profile_img_uri);

        if (imageUri != undefined) {
          setFacilityImageUri(imageUri);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchFacilityInfoSubStamp = async (id) => {
      try {
        const stamps = await getFacilityStampRuleByID(id);

        console.log(stamps);

        if (stamps.logo_img_uri) {
          const stampImages = await fetchImage(stamps.logo_img_uri);
          if (stampImages != undefined) { setStampLogo(stampImages) };
        }
        console.log("stamp logo: ", stamps.logo_img_uri);

        setFacilityInfo((prevFacilityInfo) => ({
          ...prevFacilityInfo,
          stampProgram: {
            ...prevFacilityInfo.stampProgram,
            rewards: stamps.rewards.map(reward => ({
              name: reward.name,
              cnt: parseInt(reward.cnt, 10) || 0
            })),
            imageUri: stampLogo || prevFacilityInfo.stampProgram.imageUri
          }
        }));
        console.log(facilityInfo);
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchMenuImage = async () => {
      const menus = await getFacilityMenu(facilityINFO.id);
      const updatedMenus = [...menus];

      for (let i = 0; i < updatedMenus.length; i++) {
        const menu = updatedMenus[i];
        if (menu.img_uri) {
          const menuImage = await fetchImage(menu.img_uri);
          if (menuImage) {
            // Update menu item with new image URI
            updatedMenus[i] = { ...menu, img_uri: menuImage };
          }
        }
      }

      setFacilityInfo((prevFacilityInfo) => ({
        ...prevFacilityInfo,
        menuItems: updatedMenus
      }));

    };
    if (facilityINFO.profile_img_uri != "") { fetchFacilityImage() };
    fetchFacilityInfoSubStamp(facilityINFO.id);
    fetchMenuImage();
  }, []);

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


  const ensureValidURL = (url) => {
    const urlPattern = /^(http:\/\/|https:\/\/)/;
    if (!urlPattern.test(url)) {
      return `http://${url}`;
    }
    return url;
  };


  const handleFacilityInformationEdit = async () => {
    console.log("In handle registration request");
    const { latitude, longitude } = await getCoordinates(roadAddress);
    console.log("latitude : " + latitude + ", longitude : " + longitude);
    const rewards = facilityInfo.stampProgram.rewards.map(reward => ({
      name: reward.name,
      cnt: parseInt(reward.cnt, 10) || 0
    }));

    const totalCnt = rewards.reduce((acc, reward) => acc + reward.cnt, 0);

    const facilityData = {
      name: name,
      englishName: englishName,
      type: facilityINFO.type,
      businessId: businessRegNo,
      phone: phoneNumber,
      email: email,
      url: ensureValidURL(websiteURL),
      description: serviceDescription,
      profileImgFile: facilityImageUri ? facilityImageUri.split('/').pop() : '',
      address: {
        postNumber: postNumber,
        country: country,
        city: city,
        roadAddress: roadAddress,
        englishAddress: englishAddress,
        lat: latitude,
        lng: longitude
      },
      openingHours: Object.keys(openingHours).map(day => {
        const hours = openingHours[day];
        if (hours.open !== 'Closed' && hours.close !== 'Closed' && hours.open !== '' && hours.close !== '') {
          return {
            day: dayToNumber[day],
            openTime: hours.open,
            closeTime: hours.close
          };
        }
        return null;
      }).filter(Boolean),
      // menu: facilityInfo.menuItems.map(item => ({
      //   name: item.name,
      //   description: item.description,
      //   price: item.price,
      //   quantity: item.quantity,
      //   imgFile: item.img_uri ? item.img_uri.split('/').pop() : ''
      // })),
      preferences: [...cuisineType, ...dietaryPreferences],
      stampRuleset: {
        totalCnt: totalCnt,
        // logoImgFile: facilityInfo.stampProgram.imageUri ? facilityInfo.stampProgram.imageUri.split('/').pop() : '',
        rewards: rewards
      }
    };

    const images = [];
    if (facilityImageUri) images.push({ uri: facilityImageUri });
    facilityInfo.menuItems.forEach(item => {
      if (item.img_uri) images.push({ uri: item.img_uri, menuId: item.id });
    });
    if (facilityInfo.stampProgram.imageUri) images.push({ uri: facilityInfo.stampProgram.imageUri });

    try {

      const response = await editFacility({ facilityID: facilityINFO.id, facilityData: facilityData });
      if (stampLogoEdit) {
        await uploadStampLogo({ facilityID: facilityINFO.id, imageUri: stampLogo });
      };
      if (facilityImageUriEdit) {
        console.log("facility image edited");
        await uploadFacilityProfile({ facilityID: facilityINFO.id, imageUri: facilityImageUri });
      };
      Alert.alert('Success', 'Facility Information Successfully updated');
      navigation.goBack();
      navigation.replace("MyPage");
      console.log('Facility edit request sent successfully:', JSON.stringify(response.data, null, 2));

    } catch (error) {
      Alert.alert('Error', 'Failed to send facility edits request. Please try again.');
      console.error('Error sending facility edit request:', error);
    }
  };

  const handleFacilityDelete = async () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this facility?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              await deleteFacility(facilityINFO.id);
              Alert.alert("Facility Deleted Successfully");
              navigation.goBack();
              navigation.replace("MyPage");
            } catch (error) {
              Alert.alert("Deleting Facility request Failed. Please try again");
              console.log(error.message);
            }
          }
        }
      ]
    );
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

  const deleteMenu = async (menuId) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this menu?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              await deleteFacilityMenu({ facilityID: facilityINFO.id, menuID: menuId });
              Alert.alert("Menu Deleted Successfully");
              setFacilityInfo(prevState => ({
                ...prevState,
                menuItems: prevState.menuItems.filter(item => item.id !== menuId)
              }));
            } catch (error) {
              Alert.alert("Deleting Menu request Failed. Please try again");
              console.log(error.message);
            }
          }
        }
      ]
    );
  };


  const requestMediaLibraryPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return false;
    }
    return true;
  };

  const selectImage = async (type) => {
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

        // Compress the image
        const uncompressedImage = await ImageManipulator.manipulateAsync(
          source.uri,
          [],
          { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
        );

        console.log("Compressed image uri:", uncompressedImage.uri);

        if (type === 'facility') {
          setFacilityImageUri(uncompressedImage.uri);
          setFacilityImageUriEdit(true);
        } else if (type === 'stamp') {
          const updatedStampProgram = { ...facilityInfo.stampProgram, imageUri: uncompressedImage.uri };
          setFacilityInfo({ ...facilityInfo, stampProgram: updatedStampProgram });
          setStampLogo(uncompressedImage.uri);
          setStampLogoEdit(true);
        }
      } else {
        console.log("Image selection was canceled");
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  };

  const setDayHours = (day, hours) => {
    setOpeningHours(prevHours => ({
      ...prevHours,
      [day]: hours
    }));
  };

  return (
    <SafeAreaView style={GlobalStyles.background}>
      <View style={GlobalStyles.content}>
        <View style={{ width: '100%', flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
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
            }}>
            <Text style={{ ...GlobalStyles.h1, paddingRight: 60, fontSize: FontSize.size_lgi }}>Edit Facility:{"\n"}{facilityINFO.name}</Text>
          </View>
        </View>

        <ScrollView
          style={{
            ...GlobalStyles.scroll,
            overflow: 'hidden',
            marginBottom: -27,
          }}
          showsVerticalScrollIndicator={false}>

          <View style={styles.section}>
            <View style={GlobalStyles.inputWrapper1}>
              <TouchableOpacity onPress={() => selectImage('facility')}>
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
                onChangeText={setEnglishName}
                value={englishName}
                placeholder="English Name"
              />
              <Image source={require("../assets/icons/facility.png")} style={GlobalStyles.inputIcon} />
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
                onChangeText={setWebsiteURL}
                value={websiteURL}
                placeholder="Website URL"
              />
              <Image source={require("../assets/icons/url.png")} style={GlobalStyles.inputIcon} />
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
                onChangeText={setRoadAddress}
                value={roadAddress}
                placeholder="Road Address"
              />
              <Image source={require("../assets/icons/location.png")} style={GlobalStyles.inputIcon4} />
            </View>
            <View style={GlobalStyles.inputWrapper1}>
              <TextInput
                style={GlobalStyles.registrationInput1}
                onChangeText={setEnglishAddress}
                value={englishAddress}
                placeholder="English Address"
              />
              <Image source={require("../assets/icons/location.png")} style={GlobalStyles.inputIcon4} />
            </View>
            <View style={GlobalStyles.inputWrapper1}>
              <TextInput
                style={GlobalStyles.registrationInput1}
                onChangeText={setPostNumber}
                value={postNumber}
                placeholder="Post Number"
              />
              <Image source={require("../assets/icons/location.png")} style={GlobalStyles.inputIcon4} />
            </View>
            <View style={GlobalStyles.inputWrapper1}>
              <TextInput
                style={GlobalStyles.registrationInput1}
                onChangeText={setCity}
                value={city}
                placeholder="City"
              />
              <Image source={require("../assets/icons/location.png")} style={GlobalStyles.inputIcon4} />
            </View>
            <View style={GlobalStyles.inputWrapper1}>
              <TextInput
                style={GlobalStyles.registrationInput1}
                onChangeText={setCountry}
                value={country}
                placeholder="Country"
              />
              <Image source={require("../assets/icons/location.png")} style={GlobalStyles.inputIcon4} />
            </View>
          </View>
          <View style={styles.line}></View>
          <Text style={styles.subHeader}>CUISINE TYPES</Text>
          <View style={styles.grid}>
            {cuisines.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.option, cuisineType.includes(item.id) && styles.selected]}
                onPress={() => handleSelectCuisine(item.id)}
              >
                <Image source={item.icon} style={styles.icon1} />
                <Text>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.line}></View>
          <Text style={styles.subHeader}>DIETARY PREFERENCES</Text>
          <View style={styles.grid}>
            {dietaryOptions.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.option, dietaryPreferences.includes(item.id) && styles.selected]}
                onPress={() => handleSelectDietaryPreference(item.id)}
              >
                <Image source={item.icon} style={styles.icon1} />
                <Text>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.line}></View>
          <Text style={styles.subHeader1}>OPENING HOURS</Text>
          {daysOfWeek.map(day => (
            <DayHoursInput
              key={day}
              day={day}
              hours={openingHours[day]}
              setHours={setDayHours}
            />
          ))}
          <View style={styles.line}></View>
          <Text style={styles.subHeader}>MENU</Text>
          {facilityInfo.menuItems.map((item, index) => (
            <View key={index} style={styles.menuItem}>
              <Image
                source={item.img_uri ? { uri: item.img_uri } : placeholderImage}
                style={styles.image}
              />
              <View style={{ ...GlobalStyles.registrationInput1, width: '95%', alignItems: 'center' }}>
                <Text style={GlobalStyles.body4}>{item.name}</Text>
                <Image source={require("../assets/icons/service.png")} style={{ ...GlobalStyles.inputIcon, top: '50%' }} />
              </View>
              <View style={{ ...GlobalStyles.registrationInput1, width: '95%', alignContent: 'center' }}>
                <Text style={GlobalStyles.body4}>{item.description}</Text>
                <Image source={require("../assets/icons/menuDescription.png")} style={{ ...GlobalStyles.inputIcon, top: '50%' }} />
              </View>
              <View style={{ ...GlobalStyles.registrationInput1, width: '95%', alignContent: 'center' }}>
                <Text style={GlobalStyles.body4}>{item.price}</Text>
                <Image source={require("../assets/icons/price.png")} style={{ ...GlobalStyles.inputIcon, top: '50%' }} />
              </View>
              <View style={{ ...GlobalStyles.registrationInput1, width: '95%', alignContent: 'center' }}>
                <Text style={GlobalStyles.body4}>{item.quantity}</Text>
                <Image source={require("../assets/icons/number.png")} style={{ ...GlobalStyles.inputIcon, top: '50%' }} />
              </View>
              <View style={{ flexDirection: 'row', width: '95%', justifyContent: 'flex-end' }}>
                <TouchableOpacity style={{ paddingBottom: 15, paddingHorizontal: 5 }} onPress={() => { navigation.navigate("EditMenu", { facilityID: facilityINFO.id, menu: item, facilityInfo: facilityINFO }) }}>
                  <Text style={GlobalStyles.body3}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ paddingBottom: 15, paddingHorizontal: 5 }} onPress={(() => { console.log(item.id); deleteMenu(item.id) })}>
                  <Text style={GlobalStyles.body3}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <Button title="Add Menu Item" onPress={() => { navigation.navigate("EditMenu", { facilityID: facilityINFO.id, menu: "", facilityInfo: facilityINFO }) }} color={Color.orange_700} />
          <View style={styles.line}></View>
          <Text style={styles.subHeader1}>STAMPS</Text>
          <View style={styles.menuItem}>
            <TouchableOpacity onPress={() => selectImage('stamp')}>
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
                    placeholder="Reward Name"
                  />
                  <Image source={require("../assets/icons/stamp.png")} style={GlobalStyles.inputIcon5} />
                </View>
                <View style={GlobalStyles.inputWrapper2}>
                  <TextInput
                    style={GlobalStyles.registrationInput1}
                    onChangeText={text => handleRewardChange(rewardIndex, 'cnt', text)}
                    value={reward.cnt.toString()}
                    keyboardType="numeric"
                    placeholder="Number of Stamps Required"
                  />
                  <Image source={require("../assets/icons/number.png")} style={GlobalStyles.inputIcon1} />
                </View>
              </View>
            ))}
            <Button title="Add Reward" onPress={addReward} color={Color.orange_700} />
          </View>
          <View style={styles.mainArea}>
            <TouchableOpacity style={{ paddingLeft: 10 }} onPress={handleFacilityInformationEdit}>
              <Text style={{ ...GlobalStyles.h1, color: Color.orange_700 }}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ paddingLeft: 10 }} onPress={handleFacilityDelete}>
              <Text style={GlobalStyles.h1}>Delete</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.white,
    marginBottom: 70,
    marginTop: 40,
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
    marginBottom: 20,
    width: '100%',
    alignContent: 'center',
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
    paddingBottom: 50,
    paddingTop: 20,
    paddingHorizontal: '8%'
  },
  option: {
    padding: 10,
    margin: '1%',
    borderWidth: 1,
    borderColor: Color.lightGrey,
    alignItems: 'center',
    width: '30%',
    aspectRatio: 1,
    borderRadius: 10,
  },
  selected: {
    borderColor: Color.orange_700,
  },
  icon1: {
    width: 30,
    height: 30,
    marginBottom: 15,
    marginTop: 5
  }
});

export default FacilityInformationEdit;