import * as React from 'react';
import {
  Text,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { GlobalStyles } from '../GlobalStyles';
import SquareFacility from '../components/SqureFacility';
import UserList from '../components/UserList';
import Hashtag from '../components/Hashtag';

import userImage from '../assets/placeholders/User.png';

//To be deleted
import longImagePlaceholder from '../assets/placeholders/long_image.png';

const MyPage = () => {
  //Get Informations of facilities
  //5 most recent bookmarked facilities [img_url, name, score, address], 5 facilities in order of number of stamps [img_url, name], 5 most recent reviews [img_url, name, score, comment], user [img_url, nickname, email]

  const navigation = useNavigation();

  return (
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
            <Image
              style={GlobalStyles.topIcon}
              source={require('../assets/icons/setting.png')}
            />
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
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ ...GlobalStyles.body, marginRight: 15 }}>
                  Foodie
                </Text>
                <Text style={GlobalStyles.body2}>Edit</Text>
              </View>
              <Text style={{ ...GlobalStyles.body2, textTransform: 'none' }}>
                foodie@kaist.ac.kr
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
            <Hashtag tag={'🍚 rice lover'} />
            <Hashtag tag={'🥬 vegetarian'} />
            <Hashtag tag={'🍚 rice lover'} />
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
                console.log('Navigate to Favorites screen');
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
              <SquareFacility
                facilityImage={longImagePlaceholder}
                facilityName={'yosida'}
                facilityAddress={'21-12 Eoeun-ro 42 and on and on'}
                facilityScore={4.7}
              />
              <SquareFacility
                facilityImage={longImagePlaceholder}
                facilityName={'Motiff'}
                facilityAddress={'21-12 Eoeun-ro 42 and on and on'}
                facilityScore={4.7}
              />
              <SquareFacility
                facilityImage={longImagePlaceholder}
                facilityName={'Malgm'}
                facilityAddress={'21-12 Eoeun-ro 42 and on and on'}
                facilityScore={4.7}
              />
              <SquareFacility
                facilityImage={longImagePlaceholder}
                facilityName={'yosida'}
                facilityAddress={'21-12 Eoeun-ro 42 and on and on'}
                facilityScore={4.7}
              />
              <SquareFacility
                facilityImage={longImagePlaceholder}
                facilityName={'yosida'}
                facilityAddress={'21-12 Eoeun-ro 42 and on and on'}
                facilityScore={4.7}
              />
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
                console.log('Navigate to Favorites screen');
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
            <UserList UserImage={userImage} UserName={'yosida'} />
            <UserList UserImage={userImage} UserName={'Motiff'} />
            <UserList UserImage={userImage} UserName={'malgm'} />
            <UserList UserImage={userImage} UserName={'yosida'} />
            <UserList UserImage={userImage} UserName={'yosida'} />
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
                console.log('Navigate to Favorites screen');
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
              <SquareFacility
                facilityImage={longImagePlaceholder}
                facilityName={'yosida'}
                facilityAddress={'Very nice'}
                facilityScore={4.7}
              />
              <SquareFacility
                facilityImage={longImagePlaceholder}
                facilityName={'Motiff'}
                facilityAddress={'want moooore'}
                facilityScore={4.7}
              />
              <SquareFacility
                facilityImage={longImagePlaceholder}
                facilityName={'Malgm'}
                facilityAddress={'21-12 Eoeun-ro 42 and on and on'}
                facilityScore={4.7}
              />
              <SquareFacility
                facilityImage={longImagePlaceholder}
                facilityName={'yosida'}
                facilityAddress={'21-12 Eoeun-ro 42 and on and on'}
                facilityScore={4.7}
              />
              <SquareFacility
                facilityImage={longImagePlaceholder}
                facilityName={'yosida'}
                facilityAddress={'21-12 Eoeun-ro 42 and on and on'}
                facilityScore={4.7}
              />
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyPage;
