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
  Touchable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';


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
import { USERID, USERPREFERENCE, fetchImage, getFacilityByID, getFacilityRegistrations, getReports, getReviewByQuery, getStampBook, getUserByID, getUserFavorites } from './api';

const MyPage = () => {
  //Get Informations of facilities
  const [userPreference, setUserPreference] = useState();


  const [userType, setUserType] = useState(0);
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

        const newReviewReportsProfile = {};
        for (const item of data) {
          const userInfo = await getUserByID(item.author_id);
          if (userInfo.profile_img_uri) {
            userInfo.profile_img_uri = await fetchImage(item.profile_img_uri);
          } else {
            userInfo.profile_img_uri = userImage;
          }
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
            stampFacility[item.facility_id] = {name: facilityInfo.name, image: imageUrl};
          } else {
            stampFacility[item.facility_id] = {name: facilityInfo.name, image: userImage};
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

        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchUser(USERID);
  }, []);

  console.log(userInfo);

  const navigation = useNavigation();

  const facilityRequest = [
    { facilityName: 'foodie', facilityImage: longImagePlaceholder, facilityAddress: 'daejeon daehackroe 291 kaist campus', state: 'pending' },
    { facilityName: 'Yosida', facilityImage: longImagePlaceholder, facilityAddress: 'daejeon daehackroe 291 kaist campus', state: 'pending' },
    { facilityName: 'Malgm', facilityImage: longImagePlaceholder, facilityAddress: 'daejeon daehackroe 291 kaist campus', state: 'rejected' },
  ];

  const myFacility = [
    { label: 'yosida', value: '1' },
    { label: 'malgm', value: '2' },
    { label: 'eoeun sushi', value: '3' },
  ];

  const facilityInfo = {
    facilityName: 'yosida',
    facilityImage: longImagePlaceholder,
    facilityAddress: '21-12 Eoeun-ro 42beon-gil, Yuseong-gu, Daejeon',
    facilityScore: 4.7,
    facilityContact: '02-0101-3434',
    hashtag: ['🍣 Japanese food', '🥬 Vegetarian'],
    time: [
      { day: 'Monday', openTime: '11:00', closeTime: '21:00' },
      { day: 'Tuesday', openTime: '11:00', closeTime: '21:00' },
      { day: 'Wednesday', openTime: '11:00', closeTime: '21:00' },
      { day: 'Thursday', openTime: '11:00', closeTime: '21:00' },
      { day: 'Friday' },
      { day: 'Saturday', openTime: '11:00', closeTime: '21:00' },
      { day: 'Sunday', openTime: '11:00', closeTime: '21:00' },
    ],
    menu: [
      { name: 'rice with chicken', description: 'Rice with soy-sauced chicken', price: 10000, image: require('../assets/placeholders/long_image.png') },
      { name: 'rice with chicken', description: 'Rice with soy-sauced chicken', price: 10000, image: require('../assets/placeholders/long_image.png') },
      { name: 'rice with chicken', description: 'Rice with soy-sauced chicken', price: 10000, image: require('../assets/placeholders/long_image.png') },
    ],
    stamp: ['', '', 'free drink', '', '', '', 'free meal'],
    stampImage: require('../assets/icons/stamp.png')
  }

  const [value, setValue] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const [upload, setUpload] = useState(false);
  const [noticeImage, setNoticeImage] = useState('');
  const [noticeContent, setNoticeContent] = useState('');

  const toggleUpload = () => {
    setUpload(!upload);
  };

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

  return (
    <>
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
                    <Text style={GlobalStyles.body2}>Edit</Text>
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
                  <Hashtag tag={item.name} />
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
                    <UserList UserImage={userStampFacility[item.facility_id]?.image} UserName={userStampFacility[item.facility_id]?.name}/>
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
                      <Text style={GlobalStyles.body2}>Edit</Text>
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
                  {facilityRequest.map(item => (
                    <Request
                      facilityName={item.facilityName}
                      facilityImage={item.facilityImage}
                      facilityAddress={item.facilityAddress}
                      state={item.state}
                    />
                  ))}
                </View>

                <View style={{ width: '100%', justifyContent: 'flex-start' }}>
                  <View style={styles.container}>
                    {renderLabel()}
                    <Dropdown
                      style={[styles.dropdown, isFocus && { borderColor: Color.orange_700 }]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      iconStyle={styles.iconStyle}
                      data={myFacility}
                      search
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={!isFocus ? 'Select facility' : '...'}
                      searchPlaceholder="Search..."
                      value={value}
                      onFocus={() => setIsFocus(true)}
                      onBlur={() => setIsFocus(false)}
                      onChange={item => {
                        setValue(item.value);
                        setIsFocus(false);
                      }}
                    />
                  </View>
                  <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingTop: 15 }}>
                    <TouchableOpacity style={styles.facilityButton} onPress={toggleUpload}>
                      <Image
                        source={require('../assets/icons/upload.png')}
                        style={styles.buttonIcon}
                      />
                      <Text style={styles.buttonText}>Notice</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.facilityButton}>
                      <Image
                        source={require('../assets/icons/giveStamp.png')}
                        style={styles.buttonIcon}
                      />
                      <Text style={styles.buttonText}>Stamp</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.facilityButton}
                      onPress={() => {
                        navigation.navigate('FacilityDetail');
                      }}>
                      <Image
                        source={require('../assets/icons/toFacility.png')}
                        style={styles.buttonIcon}
                      />
                      <Text style={styles.buttonText}>Facility</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ width: '100%' }}>
                  <TouchableOpacity style={{ paddingTop: 15 }}>
                    <Text style={GlobalStyles.body3}>Edit</Text>
                  </TouchableOpacity>
                  <Image
                    source={facilityInfo.facilityImage}
                    style={{ ...GlobalStyles.longImage, margin: 0, marginTop: 15 }}
                  />
                  <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, paddingHorizontal: 5 }}>
                    <Text style={GlobalStyles.body}>{facilityInfo.facilityName}</Text>
                    <View style={{ flexDirection: 'row' }}>
                      <Image
                        source={require('../assets/icons/star.png')}
                        style={GlobalStyles.icon}
                      />
                      <Text style={GlobalStyles.body2}>{facilityInfo.facilityScore}</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', paddingVertical: 5 }}>
                    <Image
                      source={require('../assets/icons/location.png')}
                      style={GlobalStyles.icon}
                    />
                    <Text style={{ ...GlobalStyles.body2, paddingHorizontal: 5 }}>{facilityInfo.facilityAddress}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', paddingVertical: 5 }}>
                    <Image
                      source={require('../assets/icons/phone.png')}
                      style={GlobalStyles.icon}
                    />
                    <Text style={{ ...GlobalStyles.body2, paddingHorizontal: 5 }}>{facilityInfo.facilityContact}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', paddingTop: 5, width: '100%', paddingBottom: 20 }}>
                  {facilityInfo.hashtag.map(item => (
                    <Hashtag
                      tag={item}
                    />
                  ))}
                </View>

                <View
                  style={{
                    borderBottomColor: Color.lightGrey,
                    borderBottomWidth: 1,
                    alignSelf: 'stretch',
                    marginBottom: 10,
                  }}
                />

                <View style={{ flexDirection: 'row', width: '100%' }}>
                  <Image
                    style={styles.timeIcon}
                    source={require('../assets/icons/hour.png')}
                  />
                  <View>
                    {facilityInfo.time.map(item => (
                      <Text key={item.day} style={{ ...GlobalStyles.body2, color: Color.darkgray, paddingVertical: 2 }}>{item.day.substring(0, 3)} : {item.openTime} - {item.closeTime}</Text>
                    ))}
                  </View>
                </View>

                <View style={{ width: '100%' }}>
                  <Text style={GlobalStyles.h2}>Menu</Text>
                  {facilityInfo.menu.map(item => (
                    <Menu
                      menuName={item.name}
                      menuDescription={item.description}
                      menuPrice={item.price}
                      menuImage={item.image}
                    />
                  ))}
                </View>

                <View style={{ width: '100%' }}>
                  <Text style={GlobalStyles.h2}>Stamps</Text>
                  <Stamp
                    stamp={facilityInfo.stamp}
                    stampImage={facilityInfo.stampImage}
                    number={facilityInfo.stamp.length}
                  />
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
          {upload && (
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
                  <Text style={GlobalStyles.h3}>review</Text>
                  <TouchableOpacity style={{ width: '100%', justifyContent: 'center' }} onPress={() => { }}>
                    {noticeImage ? (
                      <Image source={noticeImage} style={{ width: '100%' }} />
                    ) : (
                      <Image source={require('../assets/placeholders/long_image.png')} style={{ width: '100%', height: 144, borderRadius: Border.br_sm }} />
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
                    <TouchableOpacity>
                      <Text style={GlobalStyles.h4}>Send</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

            </View>
          )}
        </>
      )}

      {(userType == 0) && (
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
                    <Text style={GlobalStyles.body2}>Edit</Text>
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
                      userImage={reviewReportsProfiles[item.id]?.profile_img_uri}
                      userName={reviewReportsProfiles[item.id]?.account_id}
                      reviewDate={item.created_at}
                      reviewScore={0}
                      reviewImage={''}
                      reviewContent={item.content}
                      reviewHashtags={[]}
                      edit={false}
                      admin={true}
                      reviewreport={item.id}
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
                    userImage={item.userImage}
                    userName={item.userName}
                    reportDate={item.reportDate}
                    reportContent={item.content}
                  />
                ))}

              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      )}
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
  overlayTouchable: {
    width: '80%',
    height: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
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
});

export default MyPage;
