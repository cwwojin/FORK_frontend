import * as React from 'react';
import { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { GlobalStyles, Color } from '../GlobalStyles';
import { USERID, getUserFavorites, fetchImage, getFavoritesNotices } from './api';

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

  const [myFavorites, setMyFavorites] = useState([]);
  const [favoritesImageList, setFavoritesImageList] = useState([]);
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await getUserFavorites();
        setMyFavorites(data);

        const newfavoritesImage = {};
        for (const item of data) {
          if (item.profile_img_uri) {
            const imageUrl = await fetchImage(item.profile_img_uri);
            newfavoritesImage[item.id] = {image: imageUrl, name: item.name};
          } else {
            newfavoritesImage[item.id] = {image: userImage, name: item.name};
          }
        }
        setFavoritesImageList(newfavoritesImage);
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchNotices = async () => {
      try {
        const data = await getFavoritesNotices();
        setNotices(data);
        console.log(data);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchFavorites();
    fetchNotices();
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
                navigation.navigate("FacilityDetail", { facilityID: item.id });
              }}>
                <UserList UserImage={favoritesImageList[item.id]?.image} UserName={item.name} />
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView
            style={{
              ...GlobalStyles.scroll,
              overflow: 'hidden',
              marginBottom: 150,
            }}
            showsVerticalScrollIndicator={false}>
            {notices && notices.length > 0 ? (
              notices.map(item => (
                <TouchableOpacity
                  key={item.id} // Always add a unique key for list items
                  onPress={() => {
                    navigation.navigate("FacilityDetail", { facilityID: item.facility_id });
                  }}
                >
                  <Notice
                    facilityImage={favoritesImageList[item.facility_id]?.image}
                    facilityName={favoritesImageList[item.facility_id]?.name}
                    noticeDate={item.post_date}
                    noticeImage={item.img_uri}
                    noticeContent={item.title + '\n' + item.content} // Corrected to '\n'
                  />
                </TouchableOpacity>
              ))
            ) : (
              <Text>No notices available</Text>
            )}
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
