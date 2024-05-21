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
import Stamp from '../components/Stamp';

import userImage from '../assets/placeholders/User.png';

//To be deleted
import longImagePlaceholder from '../assets/placeholders/long_image.png';

const MyStamps = () => {
  //Get Informations of facilities
  //all the facilities information with stamps [img_url, name, number_of_stamps, stamp_information(array: ['', '', '', 'free drink', '', '', 'free meal']) ], recent notices of each restaurants [img_url, name, notice_img_url, notice_contents]

  const navigation = useNavigation();

  const myStamps = [
    {
      facilityName: 'yosida',
      facilityprofile: require('../assets/placeholders/User.png'),
      number: 4,
      stamp: ['', '', 'free drink', '', '', '', 'free meal'],
      stampImage: require('../assets/icons/stamp.png')
    },
    {
      facilityName: 'Malgm',
      facilityprofile: require('../assets/placeholders/User.png'),
      number: 3,
      stamp: ['', '', 'free drink', '', '', '', 'free meal'],
      stampImage: require('../assets/icons/stamp.png')
    },
    {
      facilityName: 'Eoeun Sushi',
      facilityprofile: require('../assets/placeholders/User.png'),
      number: 6,
      stamp: ['', '', 'free drink', '', '', '', 'free meal'],
      stampImage: require('../assets/icons/stamp.png')
    }
  ]

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
          {
            myStamps.map(item => (
              <>
                <Stamp
                  facilityName={item.facilityName}
                  facilityprofile={item.facilityprofile}
                  number={item.number}
                  stamp={item.stamp}
                  stampImage={item.stampImage}
                />
                <View
                  style={{
                    borderBottomColor: Color.lightGrey,
                    borderBottomWidth: 1,
                    alignSelf: 'stretch',
                    marginBottom: 15,
                  }}
                />
              </>
            ))
          }
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default MyStamps;
