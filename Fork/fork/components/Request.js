import { useState, useEffect } from 'react';
import { Image, View, Text } from 'react-native';
import { Color, GlobalStyles } from '../GlobalStyles.js';
import { fetchImage } from '../screens/api.js';

import longImagePlaceholder from '../assets/placeholders/long_image.png';

const Request = ({
  facilityImage,
  facilityName,
  facilityAddress,
  state,
}) => {
  const [facilityImages, setFacilityImages] = useState();

  useEffect(() => {
    const fetchFacilityImage = async () => {
      try {
        const imageUrl = await fetchImage(facilityImage);
        if (imageUrl != undefined) {
          setFacilityImages(imageUrl);
        }
      } catch (error) {
        console.log(error.message);
      };
    }
    if (facilityImage != "") { fetchFacilityImage(); };
  }, []);

  return (
    <View style={{ width: '100%', alignItems: 'center' }}>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'flex-start',
          paddingTop: 5,
        }}>
        <Image
          style={{ ...GlobalStyles.squareImage2, marginBottom: 0 }}
          contentFit="cover"
          source={facilityImages ? { uri: facilityImages } : longImagePlaceholder}
        />
        <View style={{ width: '75%', paddingVertical: 10 }}>
          <Text
            style={{
              ...GlobalStyles.body,
              paddingHorizontal: 30,
              marginLeft: -10,
            }}>
            {facilityName}
          </Text>
          <View style={{ padding: 5 }} />
          <Text
            style={{
              ...GlobalStyles.body2,
              paddingHorizontal: 30,
              marginLeft: -10,
            }}>
            {facilityAddress}
          </Text>
        </View>
      </View>

      <Text
        style={{
          ...GlobalStyles.h4,
          paddingHorizontal: 20,
          textAlign: 'right'
        }}>
        {state}
      </Text>

      <View
        style={{
          borderBottomColor: Color.lightGrey,
          borderBottomWidth: 1,
          marginVertical: 10,
        }}
      />
    </View>
  );
};

export default Request;
