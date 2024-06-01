import React, { useCallback, useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Image, Button, SafeAreaView } from 'react-native';
import { Border, Color, GlobalStyles } from "../GlobalStyles.js";
import { useRoute, useNavigation } from '@react-navigation/native';
import { acceptFacilityRegistrations, getUserByID } from './api.js';

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
  const [stampRule, setStampRule] = useState([]);

  const stampLogo = require('../assets/icons/stamp.png');

  useEffect(() => {
    const fetchUser = async (userID) => {
      try {
        const data = await getUserByID(userID);
        setUserInfo(data);
      } catch (error) {
        console.log(error.message);
      }
    };
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
      const item = newtimeData.find(entry => entry.index === day);
      if (item) {
        item.openTime = open_time?.slice(0, 5);  // Remove seconds
        item.closeTime = close_time?.slice(0, 5); // Remove seconds
      }
    });
    setTimeData(newtimeData);
    const stamps = facilityInfo.stampRuleset;
    if (stamps.rewards) {
      const maxCnt = Math.max(...stamps.rewards.map(reward => reward.cnt));
      const newStampRule = Array(maxCnt).fill('');
      stamps.rewards.forEach(reward => {
        newStampRule[reward.cnt - 1] = reward?.name;
      });
      setStampRule(newStampRule);
    };
    fetchUser(author_id);
  }, []);

  const acceptRegistration = () => {
    console.log(requestID);
    acceptFacilityRegistrations(requestID);
  };
  const declineRegistration = () => {
    acceptFacilityRegistrations(requestID);
  };

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
              source={require('../assets/placeholders/User.png')}
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
            <TouchableOpacity style={{ paddingTop: 15, alignSelf: 'flex-end' }}>
            </TouchableOpacity>
            <Image
              source={longImagePlaceholder}
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
            {facilityInfo.preferences.map(item => (
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
              style={styles.icon}
              source={require('../assets/icons/hour.png')}
            />
            <View>
              {timeData.map(item => (
                <Text key={item.day} style={{ ...GlobalStyles.body2, color: new Date().toLocaleDateString('en-KR', { weekday: 'long' }) === item.day ? Color.black : Color.darkgray, paddingVertical: 2 }}>{item.day.substring(0, 3)} : {item.openTime} - {item.closeTime}</Text>
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
                menuImage={item.image ? item.image : longImagePlaceholder}
              />
            ))}
          </View>

          <View style={{ width: '100%' }}>
            <Text style={GlobalStyles.h2}>Stamps</Text>
            <Stamp
              stamp={stampRule}
              stampImage={stampLogo}
            />
          </View>
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