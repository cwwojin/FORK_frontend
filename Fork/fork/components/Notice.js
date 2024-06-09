import { Image, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Color, GlobalStyles } from '../GlobalStyles.js';
import { useState, useEffect } from 'react';
import { fetchImage } from '../screens/api.js';
import Translator, {
  useTranslator,
} from 'react-native-translator';
import { deletePost } from '../screens/api.js';
import { useNavigation } from 'react-router-dom';
import { getAllTranslations, getLanguageToken } from '../LanguageUtils';

const Notice = ({
  facilityImage,
  facilityName,
  facilityEnglishName,
  noticeDate,
  noticeImage,
  noticeContent,
  postId,
  facilityID,
  owner,
  navigation,
}) => {


  const [translations, setTranslations] = useState({});
  const [language, setLanguage] = useState('en');


  useEffect(() => {
    const fetchTranslations = async () => {
      const fetchedTranslations = await getAllTranslations();
      setTranslations(fetchedTranslations);
    };
    fetchTranslations();
  }, []);


  if (facilityImage == undefined) {
    facilityImage = require('../assets/placeholders/User.png');
  };

  const [noticeImages, setNoticeImages] = useState('');

  useEffect(() => {
    const fetchNoticeImage = async () => {
      try {
        console.log(noticeImage);
        const imageUrl = await fetchImage(noticeImage);
        if (imageUrl != undefined) {
          setNoticeImages(imageUrl);
        }
      } catch (error) {
        console.log(error.message);
      };
    }
    if (noticeImage != "") {
      fetchNoticeImage();
    };
    const fetchLanguage = async () => {
      const currentLanguage = await getLanguageToken();
      setLanguage(currentLanguage);
      console.log("language: ", language);
    }
    fetchLanguage();
  }, []);

  const { translate } = useTranslator();
  const [result, setResult] = useState(noticeContent);

  const onTranslate = async () => {
    try {
      const currentLanguage = await getLanguageToken();
      const targetLanguage = currentLanguage === 'kr' ? 'en' : 'kr';
      const _result = await translate(targetLanguage, currentLanguage, noticeContent, {
        timeout: 5000,
      });
      setResult(_result);
    } catch (error) {
      Alert.alert('Translate error!');
      console.error('Translation error:', error);
    }
  };

  const deletePosts = () => {
    Alert.alert(
      "Delete Post",
      "Do you really want to delete this post?",
      [
        {
          text: "Yes",
          onPress: () => {
            deletePost({ facilityID: facilityID, postID: postId });
            Alert.alert(
              "Post deleted"
            );
            navigation.replace("FacilityDetail", { facilityID });
          }
        },
        {
          text: "No",
          onPress: () => { },
          style: "cancel"
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={{ width: '100%', alignItems: 'center' }}>
      <View
        style={{
          width: '95%',
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}>
        {postId && (
          <TouchableOpacity onPress={onTranslate}>
            <Text style={{ ...GlobalStyles.body2, marginRight: 12 }}>
              {translations.translate}
            </Text>
          </TouchableOpacity>
        )}
        {owner && (<TouchableOpacity
          onPress={deletePosts}>
          <Image
            style={GlobalStyles.icon}
            contentFit="cover"
            source={require('../assets/icons/delete.png')}
          />
        </TouchableOpacity>)}
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '95%',
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            style={{ ...GlobalStyles.profileImage2, marginTop: 5, marginRight: 15 }}
            contentFit="cover"
            source={Number.isInteger(facilityImage) ? facilityImage : { uri: facilityImage }}
          />
          <Text
            style={{ ...GlobalStyles.body, marginRight: 10 }}
            numberOfLines={1}
            ellipsizeMode="tail">
            {language === 'ko' ? facilityName : facilityEnglishName}
          </Text>
        </View>
        <Text
          style={{ ...GlobalStyles.body2, marginRight: 10 }}
          numberOfLines={1}
          ellipsizeMode="tail">
          {noticeDate.substring(0, 10)}
        </Text>
      </View>

      {(noticeImages) && (
        <Image
          style={GlobalStyles.longImage}
          contentFit="cover"
          source={{ uri: noticeImages }}
        />
      )}

      {!noticeImage && (
        <View
          style={{ height: 10 }}
        />
      )}
      <Text style={{ ...GlobalStyles.body4, width: '97%', marginBottom: 18 }}>
        {result}
      </Text>
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


export default Notice;
