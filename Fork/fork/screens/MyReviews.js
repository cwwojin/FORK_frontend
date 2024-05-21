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
import Review from '../components/Review';

import userImage from '../assets/placeholders/User.png';

//To be deleted
import longImagePlaceholder from '../assets/placeholders/long_image.png';
const hashtags = ['🥰Lovely', '😋Tasty'];

const MyReviews = () => {
  //Get Informations of facilities
  //All the reviews [facility_img, facility_name, score(int), date(string), review_img, review_content, hashtags(Array)]

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
          <Review
            userImage={userImage}
            userName={'yosida'}
            reviewDate={'2024.05.06'}
            reviewScore={5}
            reviewImage={longImagePlaceholder}
            reviewContent={'Loved it'}
            reviewHashtags={['🥰Lovely', '😋Tasty']}
            edit={true}
          /> 
          <Review
            userImage={userImage}
            userName={'motiff'}
            reviewDate={'2024.05.06'}
            reviewScore={3}
            reviewContent={'왕맛있당'}
            reviewHashtags={['🥰Lovely', '😋Tasty', '😋Tasty', '😋Tasty']}
            edit={false}
          />
          <Review
            userImage={userImage}
            userName={'malgm'}
            reviewDate={'2024.05.06'}
            reviewScore={5}
            reviewImage={longImagePlaceholder}
            reviewContent={'Loved it'}
            reviewHashtags={['🥰Lovely', '😋Tasty']}
            edit={true}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default MyReviews;
