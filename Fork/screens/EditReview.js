import { useState, useEffect } from 'react';
import {
  Text,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import ToggleSwitch from 'toggle-switch-react-native';
import * as ImagePicker from 'expo-image-picker';
import QRCode from 'react-qr-code';
import * as ImageManipulator from 'expo-image-manipulator';

import {
  GlobalStyles,
  Color,
  FontFamily,
  FontSize,
  Border,
} from '../GlobalStyles';
import Hashtag from '../components/Hashtag';
import { editReview, LOGIN } from './api';

const EditReview = () => {
  const route = useRoute();
  const {
    reviewId,
    reviewConten,
    reviewImage,
    reviewHashtags,
    reviewScore,
    facilityID,
  } = route.params;

  const navigation = useNavigation();
  useEffect(() => {
    if (!LOGIN) {
      navigation.replace('SignUpLogIn');
    }
  }, LOGIN);

  const [reviewContent, setReviewContent] = useState(reviewConten);
  const [hashtag, setHashtag] = useState('');
  const [inputHashtag, setInputHashtag] = useState(
    reviewHashtags.map((item, index) => ({ id: index, tag: item }))
  );
  const [moderate, setModerate] = useState(false);

  const handleEditReview = async () => {
    setModerate(true);
    try {
      const response = await editReview({
        reviewId: reviewId,
        content: reviewContent,
        hashtags: inputHashtag.map((item) => item.tag),
      });
      console.log('Review updated successfully:', response);
      Alert.alert('Review updated successfully');
      setModerate(false);
      navigation.goBack();
      navigation.replace('FacilityDetail', { facilityID });
    } catch (error) {
      if (error && error === 499) {
        setModerate(false);
        Alert.alert('Error', 'Review update fail due to harmful content');
      } else {
        setModerate(false);
        Alert.alert('Error', 'Review update failed. Please try again.');
      }
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Image
          style={styles.star}
          tintColor={i >= reviewScore && Color.orange_100}
          source={require('../assets/icons/star.png')}
        />
      );
    }
    return stars;
  };

  const pushHashtag = () => {
    setInputHashtag([
      ...inputHashtag,
      { id: inputHashtag.length + 1, tag: hashtag },
    ]);
    setHashtag('');
  };

  const deleteHashtag = (id) => {
    setInputHashtag(inputHashtag.filter((item) => item.id !== id));
  };

  const confirmDeleteHashtag = (id) => {
    Alert.alert('Delete Hashtag', 'Do you want to delete this hashtag?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => deleteHashtag(id),
      },
    ]);
  };

  return (
    <SafeAreaView style={GlobalStyles.background}>
      <View style={GlobalStyles.contentNoNav}>
        <View style={styles.overlay}>
          <View style={styles.background}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={GlobalStyles.h2}>Write Reviews</Text>
              <TouchableOpacity
                style={{ ...GlobalStyles.topIcon, marginRight: 0 }}
                onPress={() => navigation.goBack()}
              >
                <Image source={require('../assets/icons/navigate_close.png')} />
              </TouchableOpacity>
            </View>
            <ScrollView
              style={{ width: '100%' }}
              showsVerticalScrollIndicator={false}
            >
              <View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  paddingVertical: 10,
                }}
              >
                {reviewImage && (
                  <Image
                    source={{ uri: reviewImage }}
                    style={GlobalStyles.squareImage2}
                  />
                )}
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    padding: 10,
                  }}
                >
                  {renderStars()}
                </View>
                <View style={styles.inputSection}>
                  <Text style={GlobalStyles.h3}>Review</Text>
                  <View style={GlobalStyles.inputWrapper3}>
                    <TextInput
                      style={GlobalStyles.registrationInput2}
                      onChangeText={setReviewContent}
                      value={reviewContent}
                      placeholder="Review Content"
                      multiline={true}
                      numberOfLines={5}
                    />
                  </View>
                </View>
                <View style={styles.inputSection}>
                  <Text style={GlobalStyles.h3}>Hashtags</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      width: '100%',
                    }}
                  >
                    {inputHashtag &&
                      inputHashtag.map((item) => (
                        <TouchableOpacity
                          key={item.id}
                          onPress={() => confirmDeleteHashtag(item.id)}
                        >
                          <Hashtag tag={item.tag} />
                        </TouchableOpacity>
                      ))}
                  </View>
                  <View style={styles.hashtagHolder}>
                    <TextInput
                      style={GlobalStyles.hashtag}
                      onChangeText={setHashtag}
                      value={hashtag}
                      placeholder="+ Hashtag"
                    />
                  </View>
                  {hashtag && (
                    <TouchableOpacity onPress={pushHashtag}>
                      <View style={styles.hashtagHolder}>
                        <Text
                          style={{
                            ...GlobalStyles.hashtag,
                            color: Color.lightGrey,
                          }}
                        >
                          Add Hashtag
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
                <View
                  style={{
                    width: '100%',
                    justifyContent: 'flex-end',
                    flexDirection: 'row',
                    paddingTop: 20,
                  }}
                >
                  <TouchableOpacity onPress={handleEditReview}>
                    <Text style={GlobalStyles.h4}>Edit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>

          {moderate && (
            <View style={styles.overlay}>
              <View style={styles.background}>
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={Color.orange_700} />
                  <Text>Moderating...</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 15,
    height: 15,
    marginTop: 2,
    marginLeft: 2,
    marginRight: 7,
  },
  star: {
    width: 25,
    height: 25,
  },
  navigator: {
    width: 22,
    height: 22,
  },
  tab: {
    fontFamily: FontFamily.robotoBold,
    fontWeight: '700',
    textTransform: 'capitalize',
    letterSpacing: 0,
    fontSize: FontSize.size_lgi,
    color: Color.orange_700,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    height: '85%',
    width: '90%',
    justifyContent: 'flex-start',
    backgroundColor: Color.white,
    borderRadius: Border.br_lg,
    padding: 30,
    paddingTop: 15,
    alignItems: 'center',
  },
  inputSection: {
    width: '100%',
    paddingVertical: 10,
  },
  hashtagHolder: {
    backgroundColor: Color.yellow_100,
    padding: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginHorizontal: 5,
    marginTop: 9,
    justifyContent: 'center',
    borderRadius: Border.br_lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditReview;
