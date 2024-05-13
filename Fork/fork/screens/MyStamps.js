import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { FontFamily, FontSize, Color, GlobalStyles } from '../GlobalStyles';
import SquareFacility from '../components/SqureFacility';
import UserList from '../components/UserList';
import Hashtag from '../components/Hashtag';
import Notice from '../components/Notice';
import Review from '../components/Review';

import userImage from '../assets/placeholders/User.png';

//To be deleted
import longImagePlaceholder from '../assets/placeholders/long_image.png';

const MyStamps = () => {
  //Get Informations of facilities
  //all the facilities information with stamps [img_url, name, number_of_stamps, stamp_information(array: ['', '', '', 'free drink', '', '', 'free meal']) ], recent notices of each restaurants [img_url, name, notice_img_url, notice_contents]
  
  const navigation = useNavigation();

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
            }}>
            <Text style={GlobalStyles.h1}>My Stamps</Text>
          </View>
        </View>

        <ScrollView
          style={{
            ...GlobalStyles.scroll,
            overflow: 'hidden',
            marginBottom: -27,
          }}
          showsVerticalScrollIndicator={false}>
          <Review
            userImage={userImage}
            userName={'Foodie'}
            reviewDate={'2024.05.06'}
            reviewImage={longImagePlaceholder}
            noticeContent={'We are not opening today >< Have a nice holiday!'}
          />
          <Notice
            facilityImage={userImage}
            facilityName={'yosida'}
            noticeDate={'2024.05.06'}
            noticeContent={'We are not opening today >< Have a nice holiday!'}
          />
          <Notice
            facilityImage={userImage}
            facilityName={'yosida'}
            noticeDate={'2024.05.06'}
            noticeImage={longImagePlaceholder}
            noticeContent={'We are not opening today >< Have a nice holiday!'}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default MyStamps;
