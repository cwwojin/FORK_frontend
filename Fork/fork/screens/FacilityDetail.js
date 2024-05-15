import { useState } from 'react';
import {
  Text,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ToggleSwitch from 'toggle-switch-react-native';


import { GlobalStyles, Color, FontFamily, FontSize } from '../GlobalStyles';
import SquareFacility from '../components/SqureFacility';
import Hashtag from '../components/Hashtag';
import Menu from '../components/Menu';
import Review from '../components/Review';
import Notice from '../components/Notice';


import userImage from '../assets/placeholders/User.png';

//To be deleted
import longImagePlaceholder from '../assets/placeholders/long_image.png';

const FacilityDetail = (
  { facility_name, }
) => {
  //Get Informations of facilities
  //facility information [name, ], 5 facilities in order of number of stamps [img_url, name], 5 most recent reviews [img_url, name, score, comment], user [img_url, nickname, email]

  const navigation = useNavigation();

  reviewHashtags = ['🍣 Japanese Food', '🥬 Vegetarian']

  const [isTimeVisible, setTimeVisible] = useState(false);
  const [tabState, setTabState] = useState("Menu");
  const [reviewFilter, setReviewFilter] = useState(false);

  const toggleTimeVisibility = () => {
    setTimeVisible(!isTimeVisible);
  };

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

  const getCurrentDayTimeData = () => {
    const currentDay = new Date().toLocaleDateString('en-KR', { weekday: 'long' });
    return timeData.filter(item => item.day === currentDay);
  };

  const timeData = [
    { day: 'Monday', openTime: '11:00', closeTime: '21:00' },
    { day: 'Tuesday', openTime: '11:00', closeTime: '21:00' },
    { day: 'Wednesday', openTime: '11:00', closeTime: '21:00' },
    { day: 'Thursday', openTime: '11:00', closeTime: '21:00' },
    { day: 'Friday' },
    { day: 'Saturday', openTime: '11:00', closeTime: '21:00' },
    { day: 'Sunday', openTime: '11:00', closeTime: '21:00' },
  ];

  const menu = [
    { name: 'rice with chicken', description: 'Rice with soy-sauced chicken', price: 10000, image: require('../assets/placeholders/long_image.png') },
    { name: 'rice with chicken', description: 'Rice with soy-sauced chicken', price: 10000, image: require('../assets/placeholders/long_image.png') },
    { name: 'rice with chicken', description: 'Rice with soy-sauced chicken', price: 10000, image: require('../assets/placeholders/long_image.png') },
  ];

  const summaryReview = "Clean, kind and tasty";
  const topHashtags = [
    "🕯️ Good mood", "🍴 Tasty", "😊 Kind", "🍴 Tasty", "😊 Kind"
  ];
  const review = [
    { userImage: userImage, userName: 'foodie', reviewDate: '2024.05.06', reviewScore: 5, reviewImage: longImagePlaceholder, reviewContent: 'Loved it', reviewHashtags: ['🥰Lovely', '😋Tasty'], edit: false },
    { userImage: userImage, userName: 'foodie', reviewDate: '2024.05.06', reviewScore: 5, reviewImage: longImagePlaceholder, reviewContent: 'Loved it', reviewHashtags: ['🥰Lovely', '😋Tasty'], edit: false },
    { userImage: userImage, userName: 'foodie', reviewDate: '2024.05.06', reviewScore: 5, reviewImage: longImagePlaceholder, reviewContent: 'Loved it', reviewHashtags: ['🥰Lovely', '😋Tasty'], edit: false },
    { userImage: userImage, userName: 'foodie', reviewDate: '2024.05.06', reviewScore: 5, reviewContent: 'Loved it', reviewHashtags: ['🥰Lovely', '😋Tasty'], edit: false },
    { userImage: userImage, userName: 'foodie', reviewDate: '2024.05.06', reviewScore: 5, reviewContent: 'Loved it', reviewHashtags: ['🥰Lovely', '😋Tasty'], edit: false },
    { userImage: userImage, userName: 'foodie', reviewDate: '2024.05.06', reviewScore: 5, reviewContent: 'Loved it', reviewHashtags: ['🥰Lovely', '😋Tasty'], edit: false },
  ];

  const notice = [
    { image: userImage, name: 'Yosida', date: '2024.05.06', noticeImage: longImagePlaceholder, content: 'We are not opening today >< Have a nice holiday!' },
    { image: userImage, name: 'Yosida', date: '2024.05.06', noticeImage: longImagePlaceholder, content: 'We are not opening today >< Have a nice holiday!' },
    { image: userImage, name: 'Yosida', date: '2024.05.06', noticeImage: longImagePlaceholder, content: 'We are not opening today >< Have a nice holiday!' },
    { image: userImage, name: 'Yosida', date: '2024.05.06', noticeImage: longImagePlaceholder, content: 'We are not opening today >< Have a nice holiday!' },
    { image: userImage, name: 'Yosida', date: '2024.05.06', noticeImage: longImagePlaceholder, content: 'We are not opening today >< Have a nice holiday!' },
    { image: userImage, name: 'Yosida', date: '2024.05.06', content: 'We are not opening today >< Have a nice holiday!' },
  ];

  const renderHashtags = () => {
    const hashtags = [];

    if (Array.isArray(reviewHashtags)) {
      for (let i = 0; i < reviewHashtags.length; i++) {
        hashtags.push(<Hashtag tag={reviewHashtags[i]} />);
      }
    } else {
      console.error('reviewHashtags is not an array.');
    }

    return hashtags;
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
            <Text style={GlobalStyles.h1}>{facility_name} yosida</Text>
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
              <Text style={GlobalStyles.body2}>facilityAddress</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Image
                style={styles.icon}
                source={require('../assets/icons/phone.png')}
              />
              <Text style={GlobalStyles.body2}>facility phone number</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Image
                style={{ ...GlobalStyles.icon, marginRight: 5 }}
                source={require('../assets/icons/star.png')}
              />
              <Text style={GlobalStyles.body2}>4.7</Text>
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
              {renderHashtags()}
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
            {(tabState == "Menu") && menu.map(item => (
              <Menu
                menuName={item.name}
                menuDescription={item.description}
                menuPrice={item.price}
                menuImage={item.image}
              />
            ))}
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

                {review
                  .filter(item => !reviewFilter || (reviewFilter && item.reviewImage)) // Apply filter conditionally based on reviewFilter state
                  .map(item => (
                    <Review
                      key={item.reviewId} // Make sure to provide a unique key prop
                      userImage={item.userImage}
                      userName={item.userName}
                      reviewDate={item.reviewDate}
                      reviewScore={item.reviewScore}
                      reviewImage={item.reviewImage}
                      reviewContent={item.reviewContent}
                      reviewHashtags={item.reviewHashtags}
                      edit={item.edit}
                    />
                  ))
                }
              </>
            )}
            {(tabState == "Notice") && notice.map(item => (
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
});

export default FacilityDetail;
