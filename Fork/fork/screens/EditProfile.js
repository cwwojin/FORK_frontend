import * as React from 'react';
import {
  Text,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  TextInput
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState, useRef } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

import { GlobalStyles, Color, FontSize } from '../GlobalStyles';
import Review from '../components/Review';
import { fetchImage, USERPREFERENCE, addUserPreference2, deleteUserPreference, updateUserProfile, uploadUserProfileImage } from './api';
import { getAllTranslations, getLanguageToken } from '../LanguageUtils';


const EditProfiles = () => {
  //Get Informations of facilities
  //All the reviews [facility_img, facility_name, score(int), date(string), review_img, review_content, hashtags(Array)]

  const navigation = useNavigation();
  const route = useRoute();

  const { userInfo } = route.params;

  const [userProfile, setUserProfile] = useState(require('../assets/placeholders/User.png'));
  const [userProfileEdit, setUserProfileEdit] = useState(false);
  const [email, setEmail] = useState(userInfo.email)
  const [password, setPassword] = useState();
  const userType = userInfo.user_type;
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    const fetchTranslations = async () => {
      const fetchedTranslations = await getAllTranslations();
      setTranslations(fetchedTranslations);
    };
    fetchTranslations();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (userInfo.profile_img_uri) {
          const profileImage = await fetchImage(data.profile_img_uri);
          setUserProfile(profileImage);
        };
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchUser();
  }, []);

  const requestMediaLibraryPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return false;
    }
    return true;
  };

  const saveProfileImage = async () => {
    try {
      const hasPermission = await requestMediaLibraryPermissions();
      if (!hasPermission) return;
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      console.log("Result object:", result);
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const source = { uri: result.assets[0].uri };
        console.log("source uri : " + source.uri);

        const uncompressedImage = await ImageManipulator.manipulateAsync(
          source.uri,
          [],
          { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
        );

        setUserProfile(uncompressedImage.uri);
        setUserProfileEdit(true);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  };

  // Split initial preferences
  const initialCuisines = Array.isArray(USERPREFERENCE) ? USERPREFERENCE.filter(pref => pref.type === 0).map(pref => pref.id) : [];
  const initialDietaryPreferences = Array.isArray(USERPREFERENCE) ? USERPREFERENCE.filter(pref => pref.type === 1).map(pref => pref.id) : [];

  console.log(initialCuisines, initialDietaryPreferences);


  const [selectedCuisines, setSelectedCuisines] = useState(initialCuisines);
  const [selectedDietaryPreferences, setSelectedDietaryPreferences] = useState(initialDietaryPreferences);

  const cuisines = [
    { id: 1, type: 0, name: 'Korean', icon: require('../assets/icons/attributes/korean.png') },
    { id: 2, type: 0, name: 'Japanese', icon: require('../assets/icons/attributes/japanese.png') },
    { id: 3, type: 0, name: 'Chinese', icon: require('../assets/icons/attributes/chinese.png') },
    { id: 4, type: 0, name: 'Asian', icon: require('../assets/icons/attributes/asian.png') },
    { id: 5, type: 0, name: 'Western', icon: require('../assets/icons/attributes/western.png') },
    { id: 6, type: 0, name: 'Pizza', icon: require('../assets/icons/attributes/pizza.png') },
    { id: 7, type: 0, name: 'Burger', icon: require('../assets/icons/attributes/burger.png') },
    { id: 8, type: 0, name: 'Chicken', icon: require('../assets/icons/attributes/chicken.png') },
    { id: 9, type: 0, name: 'Salad', icon: require('../assets/icons/attributes/salad.png') },
    { id: 10, type: 0, name: 'Cafe', icon: require('../assets/icons/attributes/coffee.png') },
    { id: 11, type: 0, name: 'Bar', icon: require('../assets/icons/attributes/bar.png') },
  ];

  const dietaryPreferences = [
    { id: 12, type: 1, name: 'Vegetarian', icon: require('../assets/icons/attributes/vegetarian.png') },
    { id: 13, type: 1, name: 'Vegan', icon: require('../assets/icons/attributes/salad.png') },
    { id: 14, type: 1, name: 'Pescatarian', icon: require('../assets/icons/attributes/pescatarian.png') },
    { id: 15, type: 1, name: 'Halal', icon: require('../assets/icons/attributes/halal.png') },
    { id: 16, type: 1, name: 'Lactose-Free', icon: require('../assets/icons/attributes/lactosefree.png') },
    { id: 17, type: 1, name: 'Gluten-Free', icon: require('../assets/icons/attributes/glutenfree.png') },
  ];

  const handleSelectCuisine = (cuisine) => {
    setSelectedCuisines(prev => {
      if (prev.includes(cuisine)) return prev.filter(item => item !== cuisine);
      else return [...prev, cuisine];
    });
  };

  const handleSelectDietaryPreference = (preference) => {
    setSelectedDietaryPreferences(prev => {
      if (prev.includes(preference)) return prev.filter(item => item !== preference);
      else return [...prev, preference];
    });
  };

  const handleSubmit = async () => {
    if (!password) {
      Alert.alert('Error', 'Either new or current password is required');
    } else {

      if (userProfileEdit) {
        try {
          await uploadUserProfileImage(userProfile);
        } catch (error) {
          console.error('Error updating preferences:', error);
          Alert.alert('Error', 'An error occurred while uploading profile image');
        }
      }

      if (userType == 1) {
        // Find cuisines and dietary preferences to add
        const cuisinesToAdd = selectedCuisines.filter(cuisine => !initialCuisines.includes(cuisine));
        const cuisinesToRemove = initialCuisines.filter(cuisine => !selectedCuisines.includes(cuisine));
        const dietaryPreferencesToAdd = selectedDietaryPreferences.filter(preference => !initialDietaryPreferences.includes(preference));
        const dietaryPreferencesToRemove = initialDietaryPreferences.filter(preference => !selectedDietaryPreferences.includes(preference));

        try {
          await updateUserProfile({ email: email, password: password });

          // Send requests to add preferences
          for (const cuisine of cuisinesToAdd) {
            await addUserPreference2(cuisine);
          }
          for (const preference of dietaryPreferencesToAdd) {
            await addUserPreference2(preference);
          }

          // Send requests to remove preferences
          for (const cuisine of cuisinesToRemove) {
            await deleteUserPreference(cuisine);
          }
          for (const preference of dietaryPreferencesToRemove) {
            await deleteUserPreference(preference);
          }

          Alert.alert('Success', 'Profile updated successfully');
          navigation.goBack();
          navigation.replace("MyPage");
        } catch (error) {
          console.error('Error updating preferences:', error);
          Alert.alert('Error', 'An error occurred while updating preferences');
        }
      } else {
        try {
          await updateUserProfile({ email: email, password: password });
          Alert.alert('Success', 'Profile updated successfully');
          navigation.goBack();
          navigation.replace("MyPage");
        } catch (error) {
          console.error('Error updating preferences:', error);
          Alert.alert('Error', 'An error occurred while updating preferences');
        }
      }


    }
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
            <Text style={GlobalStyles.h1}>{translations.editProfil}</Text>
          </View>
        </View>
        <ScrollView
          style={{
            ...GlobalStyles.scroll,
            overflow: 'hidden',
            marginBottom: -27,
          }}
          showsVerticalScrollIndicator={false}>
          <View style={{ alignItems: 'center', width: '100%', paddingTop: 30 }}>
            <TouchableOpacity onPress={saveProfileImage}>
              {userProfile ? (
                <Image source={Number.isInteger(userProfile) ? userProfile : { uri: userProfile }}
                  style={{ ...GlobalStyles.profileImage, marginTop: 10, marginBottom: 10 }}
                  contentFit="cover" />
              ) : (
                <Image source={require('../assets/placeholders/long_image.png')}
                  style={{ ...GlobalStyles.profileImage, marginTop: 10, marginBottom: 10 }}
                  contentFit="cover" />
              )}
            </TouchableOpacity>

            <Text style={GlobalStyles.body}>{userInfo.account_id}</Text>

            <View style={{ paddingHorizontal: 40 }}>
              <View style={styles.container}>
                <Image
                  source={require('../assets/icons/email.png')}
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  onChangeText={setEmail}
                  value={email}
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  numberOfLines={1}
                />
              </View>
              <View style={styles.container}>
                <Image
                  source={require('../assets/icons/password.png')}
                  style={GlobalStyles.icon}
                />
                <TextInput
                  style={styles.input}
                  onChangeText={setPassword}
                  value={password}
                  placeholder="Password"
                  autoCapitalize="none"
                  numberOfLines={1}
                  secureTextEntry={true}
                />
              </View>
            </View>

            {(userType == 1) && (
              <>
                <Text style={{ ...GlobalStyles.h2, textAlign: 'center' }}>{translations.foodPreferences}</Text>

                <Text style={{ ...GlobalStyles.h4, textAlign: 'center' }}>{translations.cuisineTypes}</Text>
                <View style={styles.grid}>
                  {cuisines.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.option, selectedCuisines.includes(item.id) && styles.selected]}
                      onPress={() => handleSelectCuisine(item.id)}
                    >
                      <Image source={item.icon} style={styles.icon} />
                      <Text style={{ textAlign: 'center' }}>{translations.pref[item.name]}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={{ ...GlobalStyles.h4, textAlign: 'center' }}>{translations.dietaryPreferences}</Text>
                <View style={styles.grid}>
                  {dietaryPreferences.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.option, selectedDietaryPreferences.includes(item.id) && styles.selected]}
                      onPress={() => handleSelectDietaryPreference(item.id)}
                    >
                      <Image
                        source={item.icon}
                        style={[
                          styles.icon,
                          (item.id === 16 || item.id === 17) && styles.doubleIcon
                        ]}
                      />
                      <Text style={{ textAlign: 'center' }}>{translations.pref[item.name]}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            <View style={{ marginTop: 30, width: '100%' }}>
              <TouchableOpacity onPress={handleSubmit}>
                <Text style={{ ...GlobalStyles.h4, marginLeft: 0, fontSize: FontSize.size_xl, textAlign: 'center' }}>{translations.save}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: '100%',
    backgroundColor: Color.white,
    flexDirection: 'row',
    alignContent: 'center',
  },
  icon: {
    height: 30,
    width: 30,
  },
  input: {
    width: '100%',
    padding: 20,
    fontSize: FontSize.size_mid,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingBottom: 50,
    paddingTop: 20,
    paddingHorizontal: '10%'
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
  icon: {
    width: 30,
    height: 30,
    marginBottom: 15,
    marginTop: 5
  },
  doubleIcon: {
    width: 40,
    height: 20,
    marginTop: 15,
    marginBottom: 15,
  }
});

export default EditProfiles;
