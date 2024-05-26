import { useState, useEffect } from 'react';
import {
  Text,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import ToggleSwitch from 'toggle-switch-react-native';
import { launchImageLibrary } from 'react-native-image-picker';


import { GlobalStyles, Color, FontFamily, FontSize, Border } from '../GlobalStyles';
import SquareFacility from '../components/SqureFacility';
import Hashtag from '../components/Hashtag';
import Menu from '../components/Menu';
import Review from '../components/Review';
import Notice from '../components/Notice';
import Stamp from '../components/Stamp';


import userImage from '../assets/placeholders/User.png';
import stampImage from '../assets/icons/stamp.png';

//To be deleted
import longImagePlaceholder from '../assets/placeholders/long_image.png';
import { fetchImage, getFacilityByID, getFacilityMenu, getFacilityOpeningHour, getFacilityPreferences, getFacilityStamp, getFacilityStampRuleByID, getReviewByQuery, getUserByID, isFacilityBookmarked, USERID } from './api';

const FacilityDetail = () => {

  const route = useRoute();

  const { facilityID } = route.params;

  const [facilityInfo, setFacilityInfo] = useState({});
  const [reviewList, setReviewList] = useState('');
  const [reviewUserInfo, setReviewUserInfo] = useState({});
  const [stampRule, setStampRule] = useState([]);
  const [stampLogo, setStampLogo] = useState(stampImage);
  const [myStamp, setMyStamp] = useState(0);
  const [preferences, setPreferences] = useState('');
  const [bookmarked, setBookmarked] = useState(false);
  const [menuImages, setMenuImages] = useState([]);
  const [timeData, setTimeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFacility = async (facilityID) => {
      try {
        const data = await getFacilityByID(facilityID);
        console.log(data);
        setFacilityInfo(data);

        const newtimeData = [
          { index: 1, day: 'Monday', openTime: '', closeTime: '' },
          { index: 2, day: 'Tuesday', openTime: '', closeTime: '' },
          { index: 3, day: 'Wednesday', openTime: '', closeTime: '' },
          { index: 4, day: 'Thursday', openTime: '', closeTime: '' },
          { index: 5, day: 'Friday', openTime: '', closeTime: '' },
          { index: 6, day: 'Saturday', openTime: '', closeTime: '' },
          { index: 0, day: 'Sunday', openTime: '', closeTime: '' },

        ];
        data.opening_hours.forEach(({ day, open_time, close_time }) => {
          const item = newtimeData.find(entry => entry.index === day);
          if (item) {
            item.openTime = open_time.slice(0, 5);  // Remove seconds
            item.closeTime = close_time.slice(0, 5); // Remove seconds
          }
        });
        console.log("timeData", newtimeData)
        setTimeData(newtimeData)

        const newMenuImageList = {};
        for (const item of data.menus) {
          if (item.img_uri) {
            const imageUrl = await fetchImage(item.img_uri);
            newMenuImageList[item.id] = imageUrl;
            console.log(newMenuImageList);
          } else {
            newMenuImageList[item.id] = longImagePlaceholder;
          }
        }
        setMenuImages(newMenuImageList);
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchReviews = async (facilityID) => {
      try {
        const data = await getReviewByQuery('', facilityID, '', '');
        setReviewList(data);
        const newImageList = {};
        const newReviewUserList = {};
        for (const item of data) {
          const userInfo = await getUserByID(item.author_id);
          if (item.img_uri) {
            const imageUrl = await fetchImage(item.img_uri);
            newImageList[item.id] = imageUrl;
          }
          if (userInfo.profile_img_uri) {

            const profileUrl = await fetchImage(userInfo.profile_img_uri);
            newReviewUserList[item.id] = { userName: userInfo.account_id, userImage: profileUrl }
          } else {
            newReviewUserList[item.id] = { userName: userInfo.account_id, userImage: userImage }
          }
        }
        setReviewImageList(newImageList);
        setReviewUserInfo(newReviewUserList);
        console.log(newImageList);
        setIsLoading(false);
        console.log(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchStamp = async (facilityID) => {
      try {
        const stamps = await getFacilityStampRuleByID(facilityID);
        if (stamps.logo_img_uri) {
          const stampImage = await fetchImage(stamps.logo_img_uri);
          setStampLogo(stampImage);
        }
        if (stamps.rewards) {
          const maxCnt = Math.max(...stamps.rewards.map(reward => reward.cnt));
          const newStampRule = Array(maxCnt).fill('');
          stamps.rewards.forEach(reward => {
            newStampRule[reward.cnt - 1] = reward?.name;
          });
          setStampRule(newStampRule);
        }
        const newMyStamp = await getFacilityStamp(facilityID);
        if (newMyStamp) {
          setMyStamp(newMyStamp.cnt);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchPreferences = async (facilityID) => {
      try {
        const preference = await getFacilityPreferences(facilityID);
        setPreferences(preference);
      } catch (error) {
        console.log(error.message);
      }
    };
    const isBookmarked = async (facilityID) => {
      try {
        const bookmark = await isFacilityBookmarked(facilityID);
        setBookmarked(bookmark);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchFacility(facilityID);
    fetchReviews(facilityID);
    fetchStamp(facilityID);
    fetchPreferences(facilityID);
    isBookmarked(facilityID);
  }, []);

  const navigation = useNavigation();

  reviewHashtags = ['🍣 Japanese Food', '🥬 Vegetarian']

  const [reviewImageList, setReviewImageList] = useState([]);
  const [isTimeVisible, setTimeVisible] = useState(false);
  const [stamp, setStamp] = useState(false);
  const [tabState, setTabState] = useState("Menu");
  const [reviewFilter, setReviewFilter] = useState(false);
  const [writeReview, setWriteReview] = useState(false);

  const [reviewScore, setReviewScore] = useState(0);
  const [reviewImage, setReviewImage] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [hashtag, setHashtag] = useState('');
  const [inputHashtag, setInputHashtag] = useState([]);

  const toggleTimeVisibility = () => {
    setTimeVisible(!isTimeVisible);
  };

  const toggleBookmarked = () => {
    setBookmarked(!bookmarked);
  };

  const toggleStamp = () => {
    setStamp(!stamp);
  }

  const switchTabMenu = () => {
    setTabState("Menu");
  };
  const switchTabReview = () => {
    setTabState("Review");
  };
  const switchTabNotice = () => {
    setTabState("Notice");
  };

  const toggleReviewFilter = () => {
    setReviewFilter(!reviewFilter);
  }

  const toggleWriteReview = () => {
    setWriteReview(!writeReview);
  }

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setReviewScore(i + 1)}>
          <Image
            style={styles.star}
            tintColor={i >= (reviewScore) && Color.orange_100}
            source={require('../assets/icons/star.png')}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  const saveReviewImage = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: true,
      includeExtra: true,
      saveToPhotos: true,
    };
    launchImageLibrary(options, (response) => {
      if (!response.didCancel) {
        // Handle the response, for example, set the review image state
        setReviewImage(response.assets[0].uri);
      }
    });
  }

  const getCurrentDayTimeData = () => {
    const currentDay = new Date().toLocaleDateString('en-KR', { weekday: 'long' });
    return timeData.filter(item => item.day === currentDay);
  };

  const pushHashtag = () => {
    setInputHashtag([...inputHashtag, hashtag]);
    setHashtag('');
    console.log(inputHashtag);
  }

  const summaryReview = "Clean, kind and tasty";
  const topHashtags = [
    "🕯️ Good mood", "🍴 Tasty", "😊 Kind", "🍴 Tasty", "😊 Kind"
  ];

  const notice = [
    { image: userImage, name: 'Yosida', date: '2024.05.06', noticeImage: longImagePlaceholder, content: 'We are not opening today >< Have a nice holiday!' },
    { image: userImage, name: 'Yosida', date: '2024.05.06', noticeImage: longImagePlaceholder, content: 'We are not opening today >< Have a nice holiday!' },
    { image: userImage, name: 'Yosida', date: '2024.05.06', noticeImage: longImagePlaceholder, content: 'We are not opening today >< Have a nice holiday!' },
    { image: userImage, name: 'Yosida', date: '2024.05.06', noticeImage: longImagePlaceholder, content: 'We are not opening today >< Have a nice holiday!' },
    { image: userImage, name: 'Yosida', date: '2024.05.06', noticeImage: longImagePlaceholder, content: 'We are not opening today >< Have a nice holiday!' },
    { image: userImage, name: 'Yosida', date: '2024.05.06', content: 'We are not opening today >< Have a nice holiday!' },
  ];

  return (
    <SafeAreaView style={GlobalStyles.background}>
      <View style={GlobalStyles.contentNoNav}>

        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row' }}>
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
                width: '70%'
              }}>
              <Text style={GlobalStyles.h1} numberOfLines={1}>{facilityInfo?.name}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={toggleStamp}>
              <Image
                style={{ width: 30, height: 30, marginRight: 10 }}
                source={require('../assets/icons/stampCard.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleBookmarked}>
              <Image
                style={{ width: 30, height: 30 }}
                source={bookmarked ? require('../assets/icons/bookmark_on.png') : require('../assets/icons/bookmark_off2.png')}
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView vertical style={{ width: '100%' }} showsVerticalScrollIndicator={false}>

          <View style={{ width: '100%', alignSelf: 'center' }}>
            <Image
              style={{ ...GlobalStyles.longImage, alignSelf: 'center' }}
              source={require('../assets/placeholders/long_image.png')}
            />
            <View style={{ flexDirection: 'row' }}>
              <Image
                style={{ ...GlobalStyles.icon, marginRight: 5 }}
                source={require('../assets/icons/location.png')}
              />
              <Text style={GlobalStyles.body2}>{facilityInfo.english_address}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Image
                style={styles.icon}
                source={require('../assets/icons/phone.png')}
              />
              <Text style={GlobalStyles.body2}>{facilityInfo.phone}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Image
                style={{ ...GlobalStyles.icon, marginRight: 5 }}
                source={require('../assets/icons/star.png')}
              />
              <Text style={GlobalStyles.body2}>{facilityInfo.avg_score}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flexWrap: 'wrap',
                width: '100%',
                paddingTop: 10,
                paddingBottom: 15,
              }}>
              {preferences && preferences.map(item => (
                <Hashtag tag={item} />
              ))}
            </View>
          </View>

          <View
            style={{
              borderBottomColor: Color.lightGrey,
              borderBottomWidth: 1,
              marginBottom: 15,
            }}
          />

          <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row' }}>
              <Image
                style={styles.icon}
                source={require('../assets/icons/hour.png')}
              />
              <View>
                {!isTimeVisible && getCurrentDayTimeData().map(item => (
                  <Text key={item.day} style={{ ...GlobalStyles.body2, color: Color.black, paddingVertical: 2 }}>{item.day.substring(0, 3)} : {item.openTime} - {item.closeTime}</Text>))}
                {isTimeVisible && timeData.map(item => (
                  <Text key={item.day} style={{ ...GlobalStyles.body2, color: new Date().toLocaleDateString('en-KR', { weekday: 'long' }) === item.day ? Color.black : Color.darkgray, paddingVertical: 2 }}>{item.day.substring(0, 3)} : {item.openTime} - {item.closeTime}</Text>))}
              </View>
            </View>
            {!isTimeVisible && (
              <TouchableOpacity onPress={toggleTimeVisibility}>
                <Image
                  style={styles.navigator}
                  source={require('../assets/icons/navigate_down.png')}
                />
              </TouchableOpacity>
            )}
            {isTimeVisible && (
              <TouchableOpacity onPress={toggleTimeVisibility}>
                <Image
                  style={styles.navigator}
                  source={require('../assets/icons/navigate_up.png')}
                />
              </TouchableOpacity>
            )}
          </View>

          <View
            style={{
              borderBottomColor: Color.lightGrey,
              borderBottomWidth: 1,
              marginTop: 15,
            }}
          />

          <View style={{ flexDirection: 'row', paddingVertical: 15, paddingHorizontal: 3 }}>
            <TouchableOpacity style={{ marginRight: 20 }} onPress={switchTabMenu}>
              <Text style={{ ...styles.tab, color: tabState === "Menu" ? Color.orange_700 : Color.orange_100 }}>Menu</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginRight: 20 }} onPress={switchTabReview}>
              <Text style={{ ...styles.tab, color: tabState === "Review" ? Color.orange_700 : Color.orange_100 }}>Review</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginRight: 20 }} onPress={switchTabNotice}>
              <Text style={{ ...styles.tab, color: tabState === "Notice" ? Color.orange_700 : Color.orange_100 }}>Notice</Text>
            </TouchableOpacity>
          </View>
          <View>
            {(tabState == "Menu") && facilityInfo.menus?.filter(item => item !== null).map(item => (
              <Menu
                key={item.id}
                menuName={item.name}
                menuDescription={item.description}
                menuPrice={item.price}
                menuImage={menuImages[item.id]}
              />
            ))}
            {(tabState == "Review" && isLoading) && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading reviews...</Text>
              </View>
            )}
            {(tabState == "Review") && (
              <>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                  <Image
                    style={{ ...GlobalStyles.icon, marginRight: 5 }}
                    source={require('../assets/icons/camera.png')}
                  />
                  <ToggleSwitch
                    isOn={reviewFilter}
                    onColor={Color.orange_700}
                    offColor={Color.lightGrey}
                    size="small"
                    onToggle={toggleReviewFilter}
                  />
                </View>
                <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                  <Text style={GlobalStyles.body}>{summaryReview}</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      width: '100%',
                      paddingTop: 20,
                    }}>
                    {topHashtags
                      .map(item => (
                        <Hashtag tag={item} />
                      ))
                    }
                  </View>
                </View>

                <View
                  style={{
                    borderBottomColor: Color.lightGrey,
                    borderBottomWidth: 1,
                    marginBottom: 15,
                  }}
                />

                {reviewList
                  .filter(item => !reviewFilter || (reviewFilter && item.img_uri)) // Apply filter conditionally based on reviewFilter state
                  .map(item => (
                    <Review
                      key={item.id} // Make sure to provide a unique key prop
                      userImage={reviewUserInfo[item.id]?.userImage}
                      userName={reviewUserInfo[item.id]?.userName}
                      edit={USERID == item.author_id}
                      reviewDate={item.post_date}
                      reviewScore={item.score}
                      reviewImage={item.img_uri ? reviewImageList[item.id] : item.img_uri}
                      reviewContent={item.content}
                      reviewHashtags={item.hashtags}
                      admin={false}
                    />
                  ))
                }
              </>
            )}
            {(tabState == "Notice") && notice?.map(item => (
              <Notice
                facilityImage={item.image}
                facilityName={item.name}
                noticeDate={item.date}
                noticeImage={item.noticeImage}
                noticeContent={item.content}
              />
            ))}
          </View>
        </ScrollView>
      </View >
      {(tabState == 'Review') && (
        <TouchableOpacity onPress={toggleWriteReview}>
          <Image
            source={require('../assets/icons/write_review.png')}
            style={{ width: 150, height: 150, position: 'absolute', bottom: 0, right: 10 }}
          />
        </TouchableOpacity>
      )}
      {writeReview && (
        <View style={styles.overlay}>
          <View style={styles.background}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={GlobalStyles.h2}>Write Reviews</Text>
              <TouchableOpacity style={{ ...GlobalStyles.topIcon, marginRight: 0 }} onPress={toggleWriteReview}>
                <Image
                  source={require('../assets/icons/navigate_close.png')}
                />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false}>
              <View style={{ width: '100%', alignItems: 'center', paddingVertical: 10 }}>
                <TouchableOpacity onPress={saveReviewImage}>
                  {reviewImage ? (
                    <Image source={reviewImage} style={GlobalStyles.squareImage2} />
                  ) : (
                    <Image source={require('../assets/placeholders/long_image.png')} style={GlobalStyles.squareImage2} />
                  )}
                </TouchableOpacity>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    padding: 10,
                  }}>
                  {renderStars()}
                </View>
                <View style={styles.inputSection}>
                  <Text style={GlobalStyles.h3}>Review</Text>
                  <View style={GlobalStyles.inputWrapper3}>
                    <TextInput
                      style={GlobalStyles.registrationInput2}
                      onChangeText={setReviewContent}
                      value={reviewContent}
                      placeholder="Review Content"
                      multiline={true}
                      numberOfLines={5}
                    />
                  </View>
                </View>
                <View style={styles.inputSection}>
                  <Text style={GlobalStyles.h3}>Hashtags</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      width: '100%',
                    }}>
                    {inputHashtag && inputHashtag.map(item => (
                      <Hashtag tag={item} />
                    ))}
                  </View>
                  <View style={styles.hashtagHolder}>
                    <TextInput
                      style={GlobalStyles.hashtag}
                      onChangeText={setHashtag}
                      value={hashtag}
                      placeholder="+ Hashtag"
                    />
                  </View>
                  {hashtag && (
                    <TouchableOpacity onPress={pushHashtag}>
                      <View style={styles.hashtagHolder}>
                        <Text style={{ ...GlobalStyles.hashtag, color: Color.lightGrey }}>Add Hashtag</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
                <View style={{ width: '100%', justifyContent: 'flex-end', flexDirection: 'row', paddingTop: 20 }}>
                  <TouchableOpacity>
                    <Text style={GlobalStyles.h4}>Send</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>

        </View>
      )}
      {stamp && (
        <View style={styles.overlay}>
          <View style={{ ...styles.background, justifyContent: 'center', height: '50%' }}>
            <View style={{ width: '100%' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <TouchableOpacity style={{ marginRight: -10 }} onPress={toggleStamp}>
                  <Image
                    source={require('../assets/icons/navigate_close.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ width: '100%', alignItems: 'center', paddingVertical: 10 }}>
              {!(stampRule == []) &&
                <>
                  <Stamp
                    number={myStamp}
                    stamp={stampRule}
                    stampImage={stampLogo}
                  />
                  <Text style={GlobalStyles.body}>Buyer ID: {USERID}</Text>
                </>
              }
              {(stampRule == []) && <Text style={GlobalStyles.body}>Stamps not created</Text>}
            </View>
          </View>

        </View>
      )}
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 15,
    height: 15,
    marginTop: 2,
    marginLeft: 2,
    marginRight: 7
  },
  star: {
    width: 25,
    height: 25,
  },
  navigator: {
    width: 22,
    height: 22
  },
  tab: {
    fontFamily: FontFamily.robotoBold,
    fontWeight: '700',
    textTransform: 'capitalize',
    letterSpacing: 0,
    fontSize: FontSize.size_lgi,
    color: Color.orange_700,
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
    height: '85%',
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
  hashtagHolder: {
    backgroundColor: Color.yellow_100,
    padding: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginHorizontal: 5,
    marginTop: 9,
    justifyContent: 'center',
    borderRadius: Border.br_lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FacilityDetail;
