import { useState } from 'react';
import { Image, View, Text, TouchableOpacity, Alert } from 'react-native';
import { Color, GlobalStyles } from '../GlobalStyles.js';
import Translator, {
  TranslatorProvider,
  useTranslator,
} from 'react-native-translator';

import Hashtag from './Hashtag';

const Review = ({
  userImage,
  userName,
  reviewDate,
  reviewScore,
  reviewImage,
  reviewContent,
  reviewHashtags,
  edit,
}) => {
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

    if (Array.isArray(reviewHashtags)) {
      for (let i = 0; i < reviewHashtags.length; i++) {
        hashtags.push(<Hashtag tag={reviewHashtags[i]} />);
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
      const _result = await translate('en', 'kr', reviewContent, {
        timeout: 5000,
      });
      setResult(_result);
    } catch (error) {
      Alert.alert('Translate error!');
      console.error('Translation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ width: '100%', alignItems: 'center' }}>
      <View
        style={{
          width: '95%',
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}>
        <TouchableOpacity onPress={onTranslate}>
          <Text style={{ ...GlobalStyles.body2, marginRight: 12 }}>
            Translate
          </Text>
        </TouchableOpacity>
        {edit && (
          <TouchableOpacity
            onPress={() => {
              {
                /*delete */
              }
            }}>
            <Image
              style={GlobalStyles.icon}
              contentFit="cover"
              source={require('../assets/icons/delete.png')}
            />
          </TouchableOpacity>
        )}
        {!edit && (
          <TouchableOpacity
            onPress={() => {
              {
                /*report */
              }
            }}>
            <Image
              style={GlobalStyles.icon}
              contentFit="cover"
              source={require('../assets/icons/report.png')}
            />
          </TouchableOpacity>
        )}
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '95%',
        }}>
        <Image
          style={{
            ...GlobalStyles.profileImage2,
            marginTop: 5,
            marginRight: 15,
          }}
          contentFit="cover"
          source={userImage}
        />
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '90%',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{ ...GlobalStyles.body, marginRight: 10 }}
              numberOfLines={1}
              ellipsizeMode="tail">
              {userName}
            </Text>
            <Text
              style={{ ...GlobalStyles.body2, marginRight: 10 }}
              numberOfLines={1}
              ellipsizeMode="tail">
              {reviewDate}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
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
        }}>
        {reviewImage && (
          <Image
            style={GlobalStyles.squareImage2}
            contentFit="cover"
            source={reviewImage}
          />
        )}
        <View style={{ width: '75%', paddingVertical: 20 }}>
          <Text
            style={{
              ...GlobalStyles.body4,
              paddingHorizontal: 30,
              marginLeft: -10,
            }}>
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
        }}>
        {renderHashtags()}
      </View>
      <View
        style={{
          borderBottomColor: Color.lightGrey,
          borderBottomWidth: 1,
          alignSelf: 'stretch',
          marginBottom: 10,
        }}
      />
    </View>
  );
};

export default Review;
