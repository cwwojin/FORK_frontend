import * as React from 'react';
import { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { GlobalStyles } from '../GlobalStyles';
import { USERID, getUserFavorites } from './api';

import UserList from '../components/UserList';
import Notice from '../components/Notice';
import NavigationBar from '../components/NavigationBar';

import userImage from '../assets/placeholders/User.png';

//To be deleted
import longImagePlaceholder from '../assets/placeholders/long_image.png';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Favorites = () => {
  //Get Informations of facilities
  //all the bookmarked facilities information [img_url, name], recent notices of each restaurants [img_url, name, notice_img_url, notice_contents]

  const [myFavorites, setMyFavorites] = useState('');

  useEffect(() => {
    const fetchFavorites = async (userID) => {
      try {
        const data = await getUserFavorites(userID);
        setMyFavorites(data.data);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchFavorites(USERID);
  }, []);

  const navigation = useNavigation();

  return (
    <SafeAreaView style={GlobalStyles.background}>
      <View style={GlobalStyles.content}>
        <View style={{ width: '100%' }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: -27,
              paddingBottom: 10,
            }}>
            <Text style={GlobalStyles.h1}>Favorites</Text>
          </View>
          <ScrollView
            horizontal
            style={{
              ...GlobalStyles.scroll,
              paddingBottom: 20,
              paddingTop: 10,
            }}
            showsHorizontalScrollIndicator={false}>
            {myFavorites && myFavorites.map(item => (
              <TouchableOpacity onPress={() => {
                navigation.navigate("FacilityDetail", {facilityID: item.id});
              }}>
                <UserList UserImage={item.profile_img_uri ? item.profile_img_uri : userImage} UserName={item.name} />
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView
            style={{
              ...GlobalStyles.scroll,
              overflow: 'hidden',
              marginBottom: 140,
            }}
            showsVerticalScrollIndicator={false}>
            <Notice
              facilityImage={userImage}
              facilityName={'yosida'}
              noticeDate={'2024.05.06'}
              noticeImage={longImagePlaceholder}
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
      </View>
      <NavigationBar
        homeb={false}
        mapb={false}
        favoritesb={true}
        myPageb={false}
        navigation={navigation}
      />
    </SafeAreaView>
  );
};

export default Favorites;
