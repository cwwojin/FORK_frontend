import { useState, useEffect } from 'react';
import {
  Text,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';




import { GlobalStyles, Color, Border, FontFamily, FontSize } from '../GlobalStyles';
import SquareFacility from '../components/SqureFacility';
import UserList from '../components/UserList';
import Hashtag from '../components/Hashtag';
import Review from '../components/Review';
import Report from '../components/Report';
import Request from '../components/Request';
import Menu from '../components/Menu';
import Stamp from '../components/Stamp';
import NavigationBar from '../components/NavigationBar';

import userImage from '../assets/placeholders/User.png';

//To be deleted
import longImagePlaceholder from '../assets/placeholders/long_image.png';
import {
  USERID, USERPREFERENCE, fetchImage, getFacilityByID, getFacilityRegistrations, getMyFacilities, getMyFacilityRegistrations, getReports, getReviewByQuery,
  getStampBook, getUserByID, getUserFavorites, getFacilityStampRuleByID,
  createFacilityPost
} from './api';

const MyPage = () => {
  //Get Informations of facilities

  const [userType, setUserType] = useState('');
  const [userInfo, setUserInfo] = useState('');
  const [userProfile, setUserProfile] = useState(userImage);
  const [userFavorite, setUserFavorite] = useState([]);
  const [userStamp, setUserStamp] = useState([]);
  const [userStampFacility, setUserStampFacility] = useState([]);
  const [userReview, setUserReview] = useState([]);
  const [userReviewFacility, setUserReviewFacility] = useState([]);

  const [facilityRegistrations, setFacilityRegistrations] = useState([]);
  const [reviewReports, setReviewReports] = useState([]);
  const [bugReports, setBugReports] = useState([]);
  const [reviewReportsProfiles, setReviewReportsProfiles] = useState([]);

  const [myFacilityRegistrations, setMyFacilityRegistrations] = useState([]);
  const [myFacilities, setMyFacilities] = useState([]);
  const [facilityInfo, setFacilityInfo] = useState();
  const [facilityInfoSub, setFacilityInfoSub] = useState();

  const fetchFacilityInfoSub = async (data) => {
    try {
      const newtimeData = [
        { index: 1, day: 'Monday', openTime: '', closeTime: '' },
        { index: 2, day: 'Tuesday', openTime: '', closeTime: '' },
        { index: 3, day: 'Wednesday', openTime: '', closeTime: '' },
        { index: 4, day: 'Thursday', openTime: '', closeTime: '' },
        { index: 5, day: 'Friday', openTime: '', closeTime: '' },
        { index: 6, day: 'Saturday', openTime: '', closeTime: '' },
        { index: 0, day: 'Sunday', openTime: '', closeTime: '' },

      ];
      console.log("data opening", data.opening_hours)
      if (!(data.opening_hours.length === 1 && data.opening_hours[0] === null)) {

        data.opening_hours?.forEach(({ day, open_time, close_time }) => {
          const item = newtimeData.find(entry => entry.index === day);
          if (item) {
            item.openTime = open_time.slice(0, 5);  // Remove seconds
            item.closeTime = close_time.slice(0, 5); // Remove seconds
          }
        });
      }


      const stamps = await fetchFacilityInfoSubStamp(data.id);
      console.log("stamps: ", stamps);

      const imageUrl = data.profile_img_uri ? await fetchImage(data.profile_img_uri) : longImagePlaceholder;


      if (data.profile_img_uri) {
        const imageUrl = await fetchImage(data.profile_img_uri);
        setFacilityInfoSub({ timeData: newtimeData, stamp: stamps.stamp, stampImage: stamps.stampImage, profileImage: (imageUrl != undefined) ? { uri: imageUrl } : longImagePlaceholder });
      } else {
        setFacilityInfoSub({ timeData: newtimeData, stamp: stamps.stamp, stampImage: stamps.stampImage, profileImage: longImagePlaceholder });
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const fetchFacilityInfoSubStamp = async (id) => {
    try {
      const stamps = await getFacilityStampRuleByID(id);
      console.log("real stamps: ", stamps);
      let stampImage = "";
      let stampRule = [];
      if (stamps.logo_img_uri) {
        const stampImages = await fetchImage(stamps.logo_img_uri);
        if (stampImages != undefined) {
          stampImage = stampImages
          if (stamps.rewards) {
            const maxCnt = Math.max(...stamps.rewards.map(reward => reward.cnt));
            const newStampRule = Array(maxCnt).fill('');
            stamps.rewards.forEach(reward => {
              newStampRule[reward.cnt - 1] = reward?.name;
            });
            stampRule = newStampRule;
            console.log("StampRule: ", stampRule)
            return { stampImage: stampImage, stamp: stampRule };
          } else {
            return { stampImage: stampImage, stamp: stampRule };
          }
        } else {
          return { stampImage: stampImage, stamp: stampRule };
        };
      } else {

        if (stamps.rewards) {
          const maxCnt = Math.max(...stamps.rewards.map(reward => reward.cnt));
          const newStampRule = Array(maxCnt).fill('');
          stamps.rewards.forEach(reward => {
            console.log("reading rewards")
            newStampRule[reward.cnt - 1] = reward?.name;
          });
          stampRule = newStampRule;
          console.log("StampRule: ", newStampRule)

          return { stampImage: stampImage, stamp: stampRule };
        } else {
          return { stampImage: stampImage, stamp: stampRule };
        }

      }
    } catch (error) {
      console.log(error.message);
      return { stampImage: require('../assets/icons/stamp.png'), stamp: [] };
    }
  };


  useEffect(() => {
    // -------Admin User---------
    const fetchFacilityRegistration = async () => {
      try {
        const data = await getFacilityRegistrations();
        setFacilityRegistrations(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchReviewReports = async () => {
      try {
        const data = await getReports(1);
        setReviewReports(data);

        console.log("review reports: ", data);

        const newReviewReportsProfile = {};
        for (const item of data) {
          const userInfo = await getUserByID(item.author_id);
          newReviewReportsProfile[item.id] = userInfo;
        }
        setReviewReportsProfiles(newReviewReportsProfile);
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchBugReports = async () => {
      try {
        const data = await getReports(0);
        setBugReports(data);
        console.log("bug reports:", data);
      } catch (error) {
        console.log(error.message);
      }
    };
    // -------KAIST User---------
    const fetchFavorites = async () => {
      try {
        const data = await getUserFavorites();
        setUserFavorite(data);
        console.log("favorites: ", data);
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchMyStamps = async () => {
      try {
        const data = await getStampBook();
        const topStamps = data.slice(0, 7);

        setUserStamp(topStamps);

        const stampFacility = {};
        for (const item of topStamps) {
          const facilityInfo = await getFacilityByID(item.facility_id);
          if (facilityInfo.profile_img_uri) {
            const imageUrl = await fetchImage(facilityInfo.profile_img_uri);
            stampFacility[item.facility_id] = { name: facilityInfo.name, image: imageUrl };
          } else {
            stampFacility[item.facility_id] = { name: facilityInfo.name, image: userImage };
          }
        }
        setUserStampFacility(stampFacility);
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchMyReviews = async () => {
      try {
        const data = await getReviewByQuery(USERID);
        const topReviews = data.slice(0, 7);
        setUserReview(topReviews);

        const reviewfacilityName = {};
        for (const item of topReviews) {
          const facilityInfo = await getFacilityByID(item.facility_id);
          reviewfacilityName[item.id] = facilityInfo.name;
        }
        setUserReviewFacility(reviewfacilityName);
      } catch (error) {
        console.log(error.message);
      }
    };
    //------Facility User-------
    const fetchMyFacilityRegistrations = async () => {
      try {
        const data = await getMyFacilityRegistrations();
        setMyFacilityRegistrations(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchMyFacilities = async () => {
      try {
        const data = await getMyFacilities();
        setMyFacilities(data);
      } catch (error) {
        console.log(error.message);
      }
    }


    const fetchUser = async (userID) => {
      try {
        const data = await getUserByID(userID);
        setUserInfo(data);
        setUserType(data.user_type);
        if (data.profile_img_uri) {
          const profileImage = await fetchImage(data.profile_img_uri);
          setUserProfile(profileImage);
        };
        if (data.user_type == 0) { //Admin
          fetchFacilityRegistration();
          fetchReviewReports();
          fetchBugReports();
        }
        else if (data.user_type == 1) { //KAIST User
          fetchFavorites();
          fetchMyStamps();
          fetchMyReviews();
        }
        else if (data.user_type == 2) { //Facility User
          fetchMyFacilityRegistrations();
          fetchMyFacilities();
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (USERID) { fetchUser(USERID) };
  }, []);

  console.log(userInfo);

  const navigation = useNavigation();

  const [value, setValue] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const [upload, setUpload] = useState(false);
  const [moderate, setModerate] = useState(false);
  const [noticeImage, setNoticeImage] = useState('');
  const [noticeContent, setNoticeContent] = useState('');

  const toggleUpload = () => {
    setUpload(!upload);
  };

  const requestMediaLibraryPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return false;
    }
    return true;
  };

  const saveNoticeImage = async (index, type) => {
    try {
      const hasPermission = await requestMediaLibraryPermissions();
      if (!hasPermission) return;
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 3],
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

        setNoticeImage(uncompressedImage.uri);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  };

  const sendNotice = async () => {
    setModerate(true);
    try {
      if (noticeImage == '') {
        const response = await createFacilityPost({ facilityId: facilityInfo.id, content: noticeContent });
        console.log('Notice uploaded successfully:', response);
        Alert.alert("Notice upload successful!")
      }
      else {
        const response = await createFacilityPost({ facilityId: facilityInfo.id, content: noticeContent, imageUri: noticeImage });
        console.log('Notice uploaded successfully:', response);
        Alert.alert("Notice upload successful!")
      }
      toggleUpload();
      setModerate(false);
      navigation.replace("MyPage");
    } catch (error) {
      if (error && error === 499) {
        setModerate(false);
        Alert.alert("Error", "Review upload fail due to harmful content");
      } else {
        setModerate(false);
        console.log(error.message);
        Alert.alert("Notice upload failed. Please try again");
      }

    }
  }


  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: Color.orange_700 }]}>
          Dropdown label
        </Text>
      );
    }
    return null;
  };

  {/* -----------------GUEST User---------------------- */ }
  if (!userType) {
    return (
      <SafeAreaView style={GlobalStyles.background}>
        <View style={GlobalStyles.content}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: -27,
              paddingBottom: 10,
            }}>
            <Text style={GlobalStyles.h1}>My Page</Text>
            <TouchableOpacity onPress={() => {
              navigation.navigate("Settings", {
                userName: userInfo.account_id,
                userProfile: userProfile,
                userEmail: userInfo.email
              });
            }}>
              <Image
                style={GlobalStyles.topIcon}
                source={require('../assets/icons/setting.png')}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 10,
            }}>
            <Image source={require('../assets/logos/coloredLogo.png')} style={{ height: 80, width: 80 }} />
            <Text style={{ ...GlobalStyles.h4, textAlign: 'center', padding: 20 }}>Please Login for more</Text>
          </View>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <>

      {/* -----------------KAIST User---------------------- */}
      {(userType == 1) && (
        <SafeAreaView style={GlobalStyles.background}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={GlobalStyles.content}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: -27,
                  paddingBottom: 10,
                }}>
                <Text style={GlobalStyles.h1}>My Page</Text>
                <TouchableOpacity onPress={() => {
                  navigation.navigate("Settings", {
                    userName: userInfo.account_id,
                    userProfile: userProfile,
                    userEmail: userInfo.email
                  });
                }}>
                  <Image
                    style={GlobalStyles.topIcon}
                    source={require('../assets/icons/setting.png')}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'flex-start',
                  marginTop: 10,
                }}>
                <Image
                  style={{ ...GlobalStyles.profileImage, marginRight: 20 }}
                  source={Number.isInteger(userProfile) ? userProfile : { uri: userProfile }}
                />
                <View style={{ justifyContent: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ ...GlobalStyles.body, marginRight: 15 }}>
                      {userInfo.account_id}
                    </Text>
                    <TouchableOpacity onPress={() => (navigation.navigate("EditProfile", { userInfo }))}>
                      <Text style={GlobalStyles.body2}>Edit</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={{ ...GlobalStyles.body2, textTransform: 'none' }}>
                    {userInfo.email}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'flex-start',
                  flexWrap: 'wrap',
                  marginTop: 10,
                }}>
                {USERPREFERENCE && USERPREFERENCE.map(item => (
                  <Hashtag key={item.id} tag={item.name} />
                ))}
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-between',
                  marginTop: 10,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    ...GlobalStyles.h2,
                    width: 'flexwrap',
                    justifyContent: 'center',
                  }}>
                  Favorites
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Favorites');
                  }}>
                  <Image
                    style={GlobalStyles.icon}
                    source={require('../assets/icons/navigate_right.png')}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ ...GlobalStyles.scroll, height: 210 }}>
                <ScrollView
                  horizontal
                  style={GlobalStyles.scroll}
                  showsHorizontalScrollIndicator={false}>
                  {userFavorite?.map(item => (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => {
                        navigation.navigate("FacilityDetail", { facilityID: item.id });
                      }}
                    >
                      <SquareFacility
                        facilityImage={item.profile_img_uri}
                        facilityName={item.name}
                        facilityAddress={item.english_address}
                        facilityScore={item.avg_score}
                      />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-between',
                  marginTop: 10,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    ...GlobalStyles.h2,
                    width: 'flexwrap',
                    justifyContent: 'center',
                  }}>
                  My Stamps
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('MyStamps');
                  }}>
                  <Image
                    style={GlobalStyles.icon}
                    source={require('../assets/icons/navigate_right.png')}
                  />
                </TouchableOpacity>
              </View>
              <ScrollView
                horizontal
                style={GlobalStyles.scroll}
                showsHorizontalScrollIndicator={false}>
                {userStamp?.map(item => (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("FacilityDetail", { facilityID: item.facility_id });
                    }}
                  >
                    <UserList UserImage={userStampFacility[item.facility_id]?.image} UserName={userStampFacility[item.facility_id]?.name} />
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-between',
                  marginTop: 10,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    ...GlobalStyles.h2,
                    width: 'flexwrap',
                    justifyContent: 'center',
                  }}>
                  My Reviews
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('MyReviews');
                  }}>
                  <Image
                    style={GlobalStyles.icon}
                    source={require('../assets/icons/navigate_right.png')}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ ...GlobalStyles.scroll, height: 210 }}>
                <ScrollView
                  horizontal
                  style={GlobalStyles.scroll}
                  showsHorizontalScrollIndicator={false}>
                  {userReview?.map(item => (
                    <TouchableOpacity onPress={() => {
                      navigation.navigate("FacilityDetail", { facilityID: item.facility_id });
                    }}>
                      <SquareFacility
                        facilityImage={item.img_uri}
                        facilityAddress={item.content}
                        facilityScore={item.score}
                        facilityName={userReviewFacility[item.id]}
                      />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      )}

      {/* -----------------Facility User---------------------- */}
      {(userType == 2) && (
        <>
          <SafeAreaView style={GlobalStyles.background}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={GlobalStyles.content}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: -27,
                    paddingBottom: 10,
                  }}>
                  <Text style={GlobalStyles.h1}>My Page</Text>
                  <TouchableOpacity onPress={() => {
                    navigation.navigate("Settings", {
                      userName: userInfo.account_id,
                      userProfile: userProfile,
                      userEmail: userInfo.email
                    });
                  }}>
                    <Image
                      style={GlobalStyles.topIcon}
                      source={require('../assets/icons/setting.png')}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'flex-start',
                    marginTop: 10,
                  }}>
                  <Image
                    style={{ ...GlobalStyles.profileImage, marginRight: 20 }}
                    source={Number.isInteger(userProfile) ? userProfile : { uri: userProfile }}
                  />
                  <View style={{ justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={{ ...GlobalStyles.body, marginRight: 15 }}>
                        {userInfo.account_id}
                      </Text>
                      <TouchableOpacity onPress={() => (navigation.navigate("EditProfile", { userInfo }))}>
                        <Text style={GlobalStyles.body2}>Edit</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={{ ...GlobalStyles.body2, textTransform: 'none' }}>
                      {userInfo.email}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    width: '100%',
                  }}>
                  <Text
                    style={{
                      ...GlobalStyles.h2,
                    }}>
                    Registration Request
                  </Text>
                  {myFacilityRegistrations?.map(item => (
                    <Request
                      facilityName={item.content.name}
                      facilityImage={item.content.profileImgUri}
                      facilityAddress={item.content.address.englishAddress}
                      state={'Pending'}
                    />
                  ))}
                </View>

                <View style={{ width: '100%', justifyContent: 'flex-start' }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 20 }}>
                    <View style={styles.container}>
                      {renderLabel()}
                      <Dropdown
                        style={[styles.dropdown, isFocus && { borderColor: Color.orange_700 }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={myFacilities}
                        search
                        maxHeight={300}
                        labelField="name"
                        valueField="id"
                        placeholder={!isFocus ? 'Select facility' : '...'}
                        searchPlaceholder="Search..."
                        value={value}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={async (item) => {
                          try {
                            setValue(item.id);
                            setFacilityInfo(item);
                            setFacilityInfoSub();
                            await fetchFacilityInfoSub(item);
                            console.log("facilityinfosub is: ", facilityInfoSub);
                            setIsFocus(false);
                          } catch (error) {
                            console.error('Error fetching facility info:', error);
                          }
                        }}
                      />
                    </View>
                    <TouchableOpacity onPress={() => {
                      navigation.navigate("FacilityInformation", { authorId: USERID })
                    }}>
                      <Text style={{ ...GlobalStyles.body3, fontSize: FontSize.size_xl, width: 20 }}>+</Text>
                    </TouchableOpacity>
                  </View>
                  {facilityInfo && (
                    <>
                      <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingTop: 15 }}>
                        <TouchableOpacity style={styles.facilityButton} onPress={toggleUpload}>
                          <Image
                            source={require('../assets/icons/upload.png')}
                            style={styles.buttonIcon}
                          />
                          <Text style={styles.buttonText}>Notice</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.facilityButton} onPress={() => navigation.navigate('QRScanner', { facilityID: facilityInfo?.id })}>
                          <Image
                            source={require('../assets/icons/giveStamp.png')}
                            style={styles.buttonIcon}
                          />
                          <Text style={styles.buttonText}>Stamp</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.facilityButton}
                          onPress={() => {
                            navigation.navigate('FacilityDetail', { facilityID: facilityInfo?.id });
                          }}>
                          <Image
                            source={require('../assets/icons/toFacility.png')}
                            style={styles.buttonIcon}
                          />
                          <Text style={styles.buttonText}>Facility</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={{ width: '100%' }}>
                        <TouchableOpacity style={{ paddingTop: 15, alignSelf: 'flex-end' }} onPress={() => (navigation.navigate("FacilityInformationEdit", { facilityINFO: facilityInfo, userEmail: userInfo.email }))}>
                          <Text style={GlobalStyles.body3}>Edit</Text>
                        </TouchableOpacity>
                        <Image
                          source={facilityInfoSub?.profileImage ? facilityInfoSub?.profileImage : longImagePlaceholder}
                          style={{ ...GlobalStyles.longImage, margin: 0, marginTop: 15 }}
                        />
                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, paddingHorizontal: 5 }}>
                          <Text style={GlobalStyles.body}>{facilityInfo?.name}</Text>
                          <View style={{ flexDirection: 'row' }}>
                            <Image
                              source={require('../assets/icons/star.png')}
                              style={GlobalStyles.icon}
                            />
                            <Text style={GlobalStyles.body2}>{Math.round(facilityInfo?.avg_score * 10) / 10}</Text>
                          </View>
                        </View>
                        <View style={{ flexDirection: 'row', paddingVertical: 5 }}>
                          <Image
                            source={require('../assets/icons/location.png')}
                            style={GlobalStyles.icon}
                          />
                          <Text style={{ ...GlobalStyles.body2, paddingHorizontal: 5 }}>{facilityInfo?.english_address}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingVertical: 5 }}>
                          <Image
                            source={require('../assets/icons/phone.png')}
                            style={GlobalStyles.icon}
                          />
                          <Text style={{ ...GlobalStyles.body2, paddingHorizontal: 5 }}>{facilityInfo?.phone}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                          <Image
                            style={GlobalStyles.icon}
                            source={require('../assets/icons/url.png')}
                          />
                          <Text style={{ ...GlobalStyles.body2, textTransform: 'none', paddingHorizontal: 5 }}>{facilityInfo?.url}</Text>
                        </View>
                      </View>
                      <View style={{ flexDirection: 'row', paddingTop: 5, width: '100%', paddingBottom: 20 }}>
                        {facilityInfo?.preferences?.map(item => (
                          <Hashtag
                            key={item.id}
                            tag={item}
                          />
                        ))}
                      </View>

                      <View
                        style={{
                          borderBottomColor: Color.lightGrey,
                          borderBottomWidth: 1,
                          marginBottom: 10,
                        }}
                      />

                      <View style={{ flexDirection: 'row', width: '100%' }}>
                        <Image
                          style={styles.timeIcon}
                          source={require('../assets/icons/hour.png')}
                        />
                        <View>
                          {facilityInfoSub?.timeData?.map(item => (
                            <Text key={item.day} style={{ ...GlobalStyles.body2, color: Color.darkgray, paddingVertical: 2 }}>{item.day.substring(0, 3)} : {item.openTime} - {item.closeTime}</Text>
                          ))}
                        </View>
                      </View>

                      <View style={{ width: '100%' }}>
                        <Text style={GlobalStyles.h2}>Menu</Text>
                        {facilityInfo?.menus?.map(item => (
                          <>
                            {item && (
                              <Menu
                                menuName={item.name}
                                menuDescription={item.description}
                                menuPrice={item.price}
                                menuImage={item.img_uri}
                                menuQuantity={item.quantity}
                              />
                            )}
                          </>
                        ))}
                      </View>

                      <View style={{ width: '100%' }}>
                        <Text style={GlobalStyles.h2}>Stamps</Text>
                        {!facilityInfoSub?.stamp ? (
                          <Text style={{ textAlign: 'center' }}>Stamp not created</Text>
                        ) : (
                          <Stamp
                            stamp={facilityInfoSub?.stamp}
                            stampImage={facilityInfoSub?.stampImage ? { uri: facilityInfoSub?.stampImage } : ""}
                            number={facilityInfoSub?.stamp?.length}
                          />
                        )}

                      </View>
                    </>
                  )}
                </View>

              </View>
            </ScrollView>
          </SafeAreaView>
          {upload && (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.overlay}>
                <View style={styles.background}>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={GlobalStyles.h2}>Upload Notice</Text>
                    <TouchableOpacity style={{ ...GlobalStyles.topIcon, marginRight: 0 }} onPress={toggleUpload}>
                      <Image
                        source={require('../assets/icons/navigate_close.png')}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={{ width: '100%', alignItems: 'center', paddingVertical: 10 }}>
                    <Text style={GlobalStyles.h3}>Notice Image</Text>
                    <TouchableOpacity style={{ width: '100%', justifyContent: 'center' }} onPress={saveNoticeImage}>
                      {noticeImage ? (
                        <Image source={Number.isInteger(noticeImage) ? noticeImage : { uri: noticeImage }} style={{ width: '100%', height: 140, borderRadius: Border.br_sm }} />
                      ) : (
                        <Image source={require('../assets/placeholders/long_image.png')} style={{ width: '100%', height: 140, borderRadius: Border.br_sm }} />
                      )}
                    </TouchableOpacity>
                    <View style={styles.inputSection}>
                      <Text style={GlobalStyles.h3}>description</Text>
                      <View style={GlobalStyles.inputWrapper3}>
                        <TextInput
                          style={GlobalStyles.registrationInput2}
                          onChangeText={setNoticeContent}
                          value={noticeContent}
                          placeholder="Review Content"
                          multiline={true}
                          numberOfLines={5}
                        />
                      </View>
                    </View>
                    <View style={{ width: '100%', justifyContent: 'flex-end', flexDirection: 'row', paddingTop: 20 }}>
                      <TouchableOpacity onPress={sendNotice}>
                        <Text style={GlobalStyles.h4}>Send</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          )}
          {moderate && (
            <View style={styles.overlay}>
              <View style={styles.background}>
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={Color.orange_700} />
                  <Text>Moderating...</Text>
                </View>
              </View>
            </View>
          )}
        </>
      )
      }

      {/* -----------------Admin User---------------------- */}
      {
        (userType == 0) && (
          <SafeAreaView style={GlobalStyles.background}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={GlobalStyles.content}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: -27,
                    paddingBottom: 10,
                  }}>
                  <Text style={GlobalStyles.h1}>My Page</Text>
                  <TouchableOpacity onPress={() => {
                    navigation.navigate("Settings", {
                      userName: userInfo.account_id,
                      userProfile: userProfile,
                      userEmail: userInfo.email
                    });
                  }}>
                    <Image
                      style={GlobalStyles.topIcon}
                      source={require('../assets/icons/setting.png')}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'flex-start',
                    marginTop: 10,
                  }}>
                  <Image
                    style={{ ...GlobalStyles.profileImage, marginRight: 20 }}
                    source={Number.isInteger(userProfile) ? userProfile : { uri: userProfile }}
                  />
                  <View style={{ justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={{ ...GlobalStyles.body, marginRight: 15 }}>
                        {userInfo.account_id}
                      </Text>
                      <TouchableOpacity onPress={() => (navigation.navigate("EditProfile", { userInfo }))}>
                        <Text style={GlobalStyles.body2}>Edit</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={{ ...GlobalStyles.body2, textTransform: 'none' }}>
                      {userInfo.email}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    width: '100%',
                    paddingVertical: 5,
                  }}>
                  <Text
                    style={GlobalStyles.h2}>
                    Review Reports
                  </Text>
                  {reviewReports
                    .map(item => (
                      <Review
                        key={item.id} // Make sure to provide a unique key prop
                        reviewId={item.review_id}
                        userID={item.review.author_id}
                        reviewDate={item.created_at}
                        reviewScore={0}
                        reviewImage={item.review.img_uri}
                        reviewContent={item.content}
                        reviewHashtags={[]}
                        edit={false}
                        admin={true}
                        reviewreport={item.id}
                        navigation={navigation}
                      />
                    ))
                  }
                </View>

                <View
                  style={{
                    width: '100%',
                    paddingVertical: 10,
                  }}>
                  <Text
                    style={GlobalStyles.h2}>
                    Facility Registration
                  </Text>
                  <ScrollView
                    horizontal
                    style={{
                      ...GlobalStyles.scroll,
                      paddingBottom: 20,
                      paddingTop: 5,
                    }}
                    showsHorizontalScrollIndicator={false}>
                    {facilityRegistrations.map(item => (
                      <TouchableOpacity onPress={() => {
                        navigation.navigate("FacilityRegistrationRequest", { author_id: item.author_id, facilityInfo: item.content, requestID: item.id });
                      }}>
                        <UserList UserImage={userImage} UserName={item.content.name} />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <View
                  style={{
                    width: '100%',
                    paddingVertical: 5,
                  }}>
                  <Text
                    style={GlobalStyles.h2}>
                    Bug Reports
                  </Text>
                  {bugReports.map(item => (
                    <Report
                      userID={item.author_id}
                      reportDate={item.created_at}
                      reportContent={item.content}
                      reportID={item.id}
                      navigation={navigation}
                    />
                  ))}

                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        )
      }
      <NavigationBar
        homeb={false}
        mapb={false}
        favoritesb={false}
        myPageb={true}
        navigation={navigation}
      />
    </>
  )
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
    width: '50%',
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  facilityButton: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: Border.br_sm,
    backgroundColor: Color.yellow_100,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonIcon: {
    width: '30%',
    height: '30%',
  },
  buttonText: {
    fontFamily: FontFamily.robotoBold,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0,
    fontSize: 16,
    color: Color.colorBlack,
    marginTop: 5,
  },
  timeIcon: {
    width: 15,
    height: 15,
    marginTop: 2,
    marginLeft: 2,
    marginRight: 7
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    height: '70%',
    width: '90%',
    justifyContent: 'flex-start',
    backgroundColor: Color.white,
    borderRadius: Border.br_lg,
    padding: 30,
    paddingTop: 15,
    alignItems: 'center'
  },
  inputSection: {
    width: '100%',
    paddingVertical: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MyPage;
