import * as React from 'react';
import { Text, View, SafeAreaView, ScrollView } from 'react-native';
import { GlobalStyles } from '../GlobalStyles';
import UserList from '../components/UserList';
import Notice from '../components/Notice';

import userImage from '../assets/placeholders/User.png';

//To be deleted
import longImagePlaceholder from '../assets/placeholders/long_image.png';

const Favorites = () => {
  //Get Informations of facilities
  //all the bookmarked facilities information [img_url, name], recent notices of each restaurants [img_url, name, notice_img_url, notice_contents]

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
            <UserList UserImage={userImage} UserName={'yosida'} />
            <UserList UserImage={userImage} UserName={'Motiff'} />
            <UserList UserImage={userImage} UserName={'malgm'} />
            <UserList UserImage={userImage} UserName={'yosida'} />
            <UserList UserImage={userImage} UserName={'yosida'} />
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
    </SafeAreaView>
  );
};

export default Favorites;
