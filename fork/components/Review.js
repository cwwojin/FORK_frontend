import { useState, useEffect } from 'react';
import { Image, View, Text, TouchableOpacity, Alert } from 'react-native';
import { Color, GlobalStyles } from '../GlobalStyles.js';
import Translator, { useTranslator } from 'react-native-translator';
import { useNavigation } from 'react-router-dom';
import { getLanguageToken } from '../LanguageUtils.js';

import Hashtag from './Hashtag';
import {
  deleteReport,
  sendReviewReport,
  fetchImage,
  getUserByID,
  deleteReview,
} from '../screens/api.js';
import userProfilePlaceholder from '../assets/placeholders/User.png';

const Review = ({
  reviewId,
  userID,
  facilityName,
  facilityImage,
  reviewDate,
  reviewScore,
  reviewImage,
  reviewContent,
  reviewHashtags,
  edit,
  admin,
  reviewreport,
  navigation,
  facilityID,
}) => {
  const [reviewImages, setReviewImages] = useState();
  const [userProfile, setUserProfile] = useState({
    userName: facilityName ? facilityName : '',
    userImage: '',
  });

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
    const fetchFacilityProfile = async () => {
      console.log('fetching facility');
      try {
        if (facilityImage != '') {
          console.log('fetching');
          const profileUrl = await fetchImage(facilityImage);
          setUserProfile({
            userName: facilityName,
            userImage: profileUrl != undefined ? profileUrl : '',
          });
        } else {
          setUserProfile({ userName: facilityName, userImage: '' });
        }
        if (reviewImage != '') {
          fetchReviewImage();
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchReviewImage = async () => {
      try {
        const imageUrl = await fetchImage(reviewImage);
        if (imageUrl != undefined) {
          setReviewImages(imageUrl);
        }
        if (reviewImage != '') {
          fetchReviewImage();
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (userID) {
      fetchUserProfile();
    } else {
      fetchFacilityProfile();
    }
  }, []);

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < reviewScore; i++) {
      stars.push(
        <Image
          style={GlobalStyles.icon}
          source={require('../assets/icons/star.png')}
        />
      );
    }
    return stars;
  };

  const renderHashtags = () => {
    const hashtags = [];

    if (reviewHashtags[0] == null) {
      console.log(hashtags, 'empty');
      return hashtags;
    }
    if (Array.isArray(reviewHashtags)) {
      for (let i = 0; i < reviewHashtags.length; i++) {
        hashtags.push(<Hashtag tag={reviewHashtags[i].name} />);
      }
    } else {
      console.error('reviewHashtags is not an array.');
    }

    return hashtags;
  };

  const { translate } = useTranslator();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(reviewContent);

  const onTranslate = async () => {
    try {
      setLoading(true);
      const currentLanguage = await getLanguageToken();
      const targetLanguage = currentLanguage === 'kr' ? 'en' : 'kr';
      const _result = await translate(
        targetLanguage,
        currentLanguage,
        reviewContent,
        {
          timeout: 5000,
        }
      );
      setResult(_result);
    } catch (error) {
      Alert.alert('Translate error!', 'Already set to current language');
      console.error('Translation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteReviews = () => {
    Alert.alert(
      'Delete Review',
      'Do you really want to delete this review?',
      [
        {
          text: 'Yes',
          onPress: () => {
            deleteReview(reviewId);
            if (reviewreport) {
              deleteReport(reviewreport);
            }
            Alert.alert('Review deleted');
            if (!edit) {
              navigation.replace('MyPage');
            } else {
              navigation.replace('FacilityDetail', { facilityID });
            }
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

  const keepReview = () => {
    Alert.alert(
      'Keep Review',
      'Do you really want to keep this review?',
      [
        {
          text: 'Yes',
          onPress: () => {
            deleteReport(reviewreport);
            Alert.alert('Review kept');
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
  const reportReview = () => {
    Alert.alert(
      'Confirm Report',
      'Do you really want to report this review?',
      [
        {
          text: 'Yes',
          onPress: () => {
            console.log('Report Sent:', reviewId);
            sendReviewReport({ content: reviewContent, reviewId: reviewId });
            Alert.alert('Report Sent');
          },
        },
        {
          text: 'No',
          onPress: () => console.log('Report cancelled'),
          style: 'cancel',
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={{ width: '100%', alignItems: 'center' }}>
      {edit && (
        <View
          style={{
            width: '95%',
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}
        >
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('EditReview', {
                reviewId: reviewId,
                reviewConten: reviewContent,
                reviewImage: reviewImages,
                reviewHashtags: reviewHashtags.map((item) => item.name),
                reviewScore: reviewScore,
                facilityID: facilityID,
              })
            }
          >
            <Text style={{ ...GlobalStyles.body2, marginRight: 12 }}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={deleteReviews}>
            <Image
              style={GlobalStyles.icon}
              contentFit="cover"
              source={require('../assets/icons/delete.png')}
            />
          </TouchableOpacity>
        </View>
      )}
      {!edit && (
        <View
          style={{
            width: '95%',
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}
        >
          <TouchableOpacity onPress={onTranslate}>
            <Text style={{ ...GlobalStyles.body2, marginRight: 12 }}>
              Translate
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={reportReview}>
            <Image
              style={GlobalStyles.icon}
              contentFit="cover"
              source={require('../assets/icons/report.png')}
            />
          </TouchableOpacity>
        </View>
      )}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '95%',
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
            userProfile?.userImage == ''
              ? userProfilePlaceholder
              : { uri: userProfile?.userImage }
          }
        />
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '90%',
              justifyContent: 'space-between',
            }}
          >
            <Text
              style={{ ...GlobalStyles.body, marginRight: 10 }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {userProfile?.userName}
            </Text>
            <Text
              style={{ ...GlobalStyles.body2, marginRight: 10 }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {reviewDate.substring(0, 10)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            {renderStars()}
          </View>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'flex-start',
          paddingTop: 5,
        }}
      >
        {reviewImages && (
          <Image
            style={GlobalStyles.squareImage2}
            contentFit="cover"
            source={{ uri: reviewImages }}
          />
        )}
        <View style={{ width: '75%', paddingVertical: 20 }}>
          <Text
            style={{
              ...GlobalStyles.body4,
              paddingHorizontal: 30,
              marginLeft: -10,
              textTransform: 'none',
            }}
          >
            {result}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          flexWrap: 'wrap',
          width: '100%',
          paddingBottom: 15,
        }}
      >
        {renderHashtags()}
      </View>

      {admin && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            width: '100%',
            paddingBottom: 15,
          }}
        >
          <TouchableOpacity onPress={deleteReviews}>
            <Text style={GlobalStyles.h4}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={keepReview}>
            <Text style={{ ...GlobalStyles.h4, color: Color.darkgray }}>
              Keep
            </Text>
          </TouchableOpacity>
        </View>
      )}

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

export default Review;
