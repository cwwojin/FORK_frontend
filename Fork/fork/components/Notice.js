import { Image, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Color, GlobalStyles } from '../GlobalStyles.js';
import { useState, useEffect } from 'react';
import { fetchImage } from '../screens/api.js';
import Translator, {
  useTranslator,
} from 'react-native-translator';

const Notice = ({
  facilityImage,
  facilityName,
  noticeDate,
  noticeImage,
  noticeContent,
}) => {
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
  }, []);

  const { translate } = useTranslator();
  const [result, setResult] = useState(noticeContent);

  const onTranslate = async () => {
    try {
      const _result = await translate('en', 'kr', noticeContent, {
        timeout: 5000,
      });
      setResult(_result);
    } catch (error) {
      Alert.alert('Translate error!');
      console.error('Translation error:', error);
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
            {facilityName}
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
