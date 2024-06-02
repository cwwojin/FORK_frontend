import React, { useCallback, useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Image, Alert, SafeAreaView, ActivityIndicator } from 'react-native';
import { Border, Color, GlobalStyles } from "../GlobalStyles.js";
import { useRoute, useNavigation } from '@react-navigation/native';
import { acceptFacilityRegistrations, fetchImage, getUserByID, declineFacilityRegistrations } from './api.js';

import Menu from '../components/Menu.js';
import Stamp from '../components/Stamp.js';
import Hashtag from '../components/Hashtag.js';

import userImage from '../assets/placeholders/User.png';
import longImagePlaceholder from '../assets/placeholders/long_image.png';

const FacilityRegistrationRequest = () => {

  const route = useRoute();
  const navigation = useNavigation();

  const { author_id, facilityInfo, requestID } = route.params;

  const [userInfo, setUserInfo] = useState('');
  const [timeData, setTimeData] = useState([]);
  const [facilityImage, setFacilityImage] = useState(longImagePlaceholder);
  const [stampRule, setStampRule] = useState([]);
  const [stampLogo, setStampLogo] = useState(require('../assets/icons/stamp.png'));
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchUser = async (userID) => {
      try {
        const data = await getUserByID(userID);

        if (data.profile_img_uri && !Number.isNaN(data.profile_img_uri)) {
          const profileimage = await fetchImage(data.profile_img_uri);
          data.profile_img_uri = profileimage ? { uri: profileimage } : userImage;
        } else {
          data.profile_img_uri = userImage;
        }

        setUserInfo(data);
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchFacilityImage = async () => {
      try {
        const data = await fetchImage(facilityInfo.profileImgUri);
        if (data) {
          setFacilityImage({ uri: data });
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchStampImage = async (stamps) => {
      try {
        const data = await fetchImage(stamps.logoImgUri);
        if (data) {
          setStampLogo({ uri: data });
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const initializeData = async () => {
      const newtimeData = [
        { index: 1, day: 'Monday', openTime: '', closeTime: '' },
        { index: 2, day: 'Tuesday', openTime: '', closeTime: '' },
        { index: 3, day: 'Wednesday', openTime: '', closeTime: '' },
        { index: 4, day: 'Thursday', openTime: '', closeTime: '' },
        { index: 5, day: 'Friday', openTime: '', closeTime: '' },
        { index: 6, day: 'Saturday', openTime: '', closeTime: '' },
        { index: 0, day: 'Sunday', openTime: '', closeTime: '' },
      ];

      facilityInfo.openingHours.forEach(({ day, open_time, close_time }) => {
        const item = newtimeData.find((entry) => entry.index === day);
        if (item) {
          item.openTime = open_time?.slice(0, 5);
          item.closeTime = close_time?.slice(0, 5);
        }
      });

      setTimeData(newtimeData);

      const stamps = facilityInfo.stampRuleset;

      if (stamps.rewards) {
        const maxCnt = Math.max(...stamps.rewards.map((reward) => reward.cnt));
        const newStampRule = Array(maxCnt).fill('');
        stamps.rewards.forEach((reward) => {
          newStampRule[reward.cnt - 1] = reward?.name;
        });
        setStampRule(newStampRule);
      }

      if (stamps.logoImgUri) {
        await fetchStampImage(stamps);
      }

      await fetchUser(author_id);

      if (facilityInfo.profileImgUri) {
        await fetchFacilityImage();
      }

      setLoading(false);
    };

    initializeData();
  }, []);

  const acceptRegistration = () => {
    Alert.alert(
      "Accept Registration",
      "Do you really want to accept this registration?",
      [
        {
          text: "Yes",
          onPress: () => {
            acceptFacilityRegistrations(requestID);
            Alert.alert(
              "Registration accepted"
            );
            navigation.replace("MyPage");
          }
        },
        {
          text: "No",
          onPress: () => { },
          style: "cancel"
        },
      ],
      { cancelable: false }
    );
  };
  const declineRegistration = () => {
    Alert.alert(
      "Decline Registration",
      "Do you really want to decline this registration?",
      [
        {
          text: "Yes",
          onPress: () => {
            declineFacilityRegistrations(requestID);
            Alert.alert(
              "Registration declined"
            );
            navigation.replace("MyPage");
          }
        },
        {
          text: "No",
          onPress: () => { },
          style: "cancel"
        },
      ],
      { cancelable: false }
    );
  };

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <ActivityIndicator size="large" color={Color.orange_700} />
      </View>
    );
  }


  return (
    <SafeAreaView style={GlobalStyles.background}>
      <ScrollView showsVerticalScrollIndicator={false}>
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
                  width: '100%'
                }}>
                <Text style={GlobalStyles.h1}>Registration Request</Text>
              </View>
            </View>
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
              source={userInfo.profile_img_uri}
            />
            <View style={{ justifyContent: 'center' }}>
              <Text style={{ ...GlobalStyles.body, marginRight: 15 }}>
                {userInfo.account_id}
              </Text>
              <Text style={{ ...GlobalStyles.body2, textTransform: 'none' }}>
                {userInfo.email}
              </Text>
            </View>
          </View>
          <View style={{ width: '100%' }}>
            <TouchableOpacity style={{ paddingTop: 15 }}>
            </TouchableOpacity>
            <Image
              source={facilityImage}
              style={{ ...GlobalStyles.longImage, margin: 0, marginTop: 15 }}
            />
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, paddingHorizontal: 5 }}>
              <Text style={GlobalStyles.body}>{facilityInfo.name}</Text>
              <View style={{ flexDirection: 'row' }}>
                <Image
                  source={require('../assets/icons/star.png')}
                  style={GlobalStyles.icon}
                />
                <Text style={GlobalStyles.body2}>-</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', paddingVertical: 5 }}>
              <Image
                source={require('../assets/icons/location.png')}
                style={GlobalStyles.icon}
              />
              <Text style={{ ...GlobalStyles.body2, paddingHorizontal: 5 }}>{facilityInfo.address.englishAddress}</Text>
            </View>
            <View style={{ flexDirection: 'row', paddingVertical: 5 }}>
              <Image
                source={require('../assets/icons/phone.png')}
                style={GlobalStyles.icon}
              />
              <Text style={{ ...GlobalStyles.body2, paddingHorizontal: 5 }}>{facilityInfo.phone}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', paddingTop: 5, width: '100%', paddingBottom: 20 }}>
            {facilityInfo?.preferences?.map(item => (
              <Hashtag
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
              style={styles.icon}
              source={require('../assets/icons/hour.png')}
            />
            <View>
              {timeData?.map(item => (
                <Text key={item.day} style={{ ...GlobalStyles.body2, color: new Date().toLocaleDateString('en-KR', { weekday: 'long' }) === item.day ? Color.black : Color.darkgray, paddingVertical: 2 }}>{item.day.substring(0, 3)} : {item.openTime} - {item.closeTime}</Text>
              ))}
            </View>
          </View>

          <View style={{ width: '100%' }}>
            <Text style={GlobalStyles.h2}>Menu</Text>
            {facilityInfo?.menu?.map(item => (
              <Menu
                menuName={item.name}
                menuDescription={item.description}
                menuPrice={item.price}
                menuImage={item.image}
              />
            ))}
          </View>
          {stampRule && (
            <View style={{ width: '100%' }}>
              <Text style={GlobalStyles.h2}>Stamps</Text>
              <Stamp
                stamp={stampRule}
                stampImage={require('../assets/icons/stamp.png')}
              />
            </View>
          )}

          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: '100%', paddingBottom: 15 }}>
            <TouchableOpacity onPress={acceptRegistration}>
              <Text style={GlobalStyles.h4}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={declineRegistration}>
              <Text style={{ ...GlobalStyles.h4, color: Color.darkgray }}>Decline</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
});

export default FacilityRegistrationRequest;