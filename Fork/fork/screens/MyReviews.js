import * as React from 'react';
import {
  Text,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';

import { GlobalStyles, Color } from '../GlobalStyles';
import Review from '../components/Review';
import { getReviewByQuery, getFacilityByID, USERID } from './api';


const MyReviews = () => {
  //Get Informations of facilities
  //All the reviews [facility_img, facility_name, score(int), date(string), review_img, review_content, hashtags(Array)]

  const navigation = useNavigation();

  const [userReview, setUserReview] = useState([]);
  const [userReviewFacility, setUserReviewFacility] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyReviews = async () => {
      try {
        const data = await getReviewByQuery(USERID);
        const reviewfacilityName = {};
        for (const item of data) {
          const facilityInfo = await getFacilityByID(item.facility_id);
          reviewfacilityName[item.facility_id] = { name: facilityInfo.name, image: facilityInfo.profile_img_uri };
        }
        setUserReviewFacility(reviewfacilityName);
        setUserReview(data);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMyReviews();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={GlobalStyles.background}>
        <View style={{...GlobalStyles.content, justifyContent: 'center'}}>
          <ActivityIndicator size="large" color={Color.orange_700} />
        </View>
      </SafeAreaView>
    );
  }

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
              paddingBottom: 10,
            }}>
            <Text style={GlobalStyles.h1}>My Reviews</Text>
          </View>
        </View>

        <ScrollView
          style={{
            ...GlobalStyles.scroll,
            overflow: 'hidden',
            marginBottom: -27,
          }}
          showsVerticalScrollIndicator={false}>
          {userReview?.map(item => (
            <TouchableOpacity
              key={item.id}
              onPress={() => {
                navigation.navigate("FacilityDetail", { facilityID: item.facility_id });
              }}
            >
              <Review
                facilityImage={userReviewFacility[item.facility_id]?.image}
                facilityName={userReviewFacility[item.facility_id]?.name}
                reviewDate={item.post_date}
                reviewScore={item.score}
                reviewImage={item.img_uri}
                reviewContent={item.content}
                reviewHashtags={item.hashtags}
                edit={true}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default MyReviews;
