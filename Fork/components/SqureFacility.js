import { Image, View, Text } from 'react-native';
import { GlobalStyles } from '../GlobalStyles.js';
import { useState, useEffect } from 'react';

import { fetchImage } from '../screens/api.js';
import { getLanguageToken } from '../LanguageUtils.js';

import longImagePlaceholder from '../assets/placeholders/long_image.png';

const SquareFacility = ({
  facilityImage,
  facilityScore,
  facilityName,
  facilityEnglishName,
  facilityAddress,
  facilityKoreanAddress,
}) => {
  const [facilityImages, setFacilityImages] = useState();
  const [language, setLanguage] = useState('er');

  useEffect(() => {
    const fetchFacilityImage = async () => {
      try {
        const imageUrl = await fetchImage(facilityImage);
        if (imageUrl != undefined) {
          console.log('set image', imageUrl);
          setFacilityImages(imageUrl);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchLanguage = async () => {
      const currentLanguage = await getLanguageToken();
      console.log(currentLanguage);
      setLanguage(currentLanguage);
      if (facilityImage != '') {
        fetchFacilityImage();
      }
    };
    fetchLanguage();
  }, []);

  return (
    <View>
      <Image
        style={GlobalStyles.squareImage}
        contentFit="cover"
        source={facilityImages ? { uri: facilityImages } : longImagePlaceholder}
      />
      <View style={{ marginLeft: 15, marginRight: 15, width: 110 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Text
            style={GlobalStyles.body}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {language === 'ko' ? facilityName : facilityEnglishName}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              maxwidth: 20,
            }}
          >
            <Image
              style={GlobalStyles.icon}
              contentFit="cover"
              source={require('../assets/icons/star.png')}
            />
            <Text style={GlobalStyles.body3}>
              {facilityScore ? Math.round(facilityScore * 10) / 10 : '-'}
            </Text>
          </View>
        </View>
        <Text style={GlobalStyles.body2} numberOfLines={1} ellipsizeMode="tail">
          {language === 'ko' ? facilityKoreanAddress : facilityAddress}
        </Text>
      </View>
    </View>
  );
};

export default SquareFacility;
