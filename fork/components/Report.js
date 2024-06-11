import { useState, useEffect } from 'react';
import { Image, View, Text, TouchableOpacity, Alert } from 'react-native';
import { Color, GlobalStyles } from '../GlobalStyles.js';
import { fetchImage, getUserByID, deleteReport } from '../screens/api.js';

import userImagePlaceholder from '../assets/placeholders/User.png';

const Report = ({
  userID,
  reportDate,
  reportContent,
  reportID,
  navigation,
}) => {
  const [userProfile, setUserProfile] = useState();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userInfo = await getUserByID(userID);
        if (userInfo.profile_img_uri) {
          const profileUrl = await fetchImage(userInfo.profile_img_uri);
          setUserProfile({
            userName: userInfo.account_id,
            userImage: profileUrl != undefined ? profileUrl : '',
          });
        } else {
          setUserProfile({ userName: userInfo.account_id, userImage: '' });
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchUserProfile();
  }, []);

  const reportHandled = () => {
    Alert.alert(
      'Report Handled',
      'Is the report handled?',
      [
        {
          text: 'Yes',
          onPress: () => {
            deleteReport(reportID);
            Alert.alert('Report Handled');
            navigation.replace('MyPage');
          },
        },
        {
          text: 'No',
          onPress: () => {},
          style: 'cancel',
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={{ width: '100%', alignItems: 'center' }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Image
            style={{
              ...GlobalStyles.profileImage2,
              marginTop: 5,
              marginRight: 15,
            }}
            contentFit="cover"
            source={
              userProfile?.userImage
                ? userProfile.userImage
                : userImagePlaceholder
            }
          />

          <Text
            style={GlobalStyles.body}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {userProfile?.userName}
          </Text>
        </View>
        <Text
          style={{ ...GlobalStyles.body2 }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {reportDate.slice(0, 10)}
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          paddingLeft: 70,
          paddingBottom: 20,
        }}
      >
        <Text style={GlobalStyles.body4}>{reportContent}</Text>
      </View>

      <TouchableOpacity
        onPress={reportHandled}
        style={{ alignSelf: 'flex-end' }}
      >
        <Text style={GlobalStyles.h4}>Fixed</Text>
      </TouchableOpacity>

      <View
        style={{
          borderBottomColor: Color.lightGrey,
          borderBottomWidth: 1,
          marginBottom: 10,
        }}
      />
    </View>
  );
};

export default Report;
