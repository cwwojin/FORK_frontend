import { Image, View, Text } from 'react-native';
import { Color, GlobalStyles } from '../GlobalStyles.js';
import { fetchImage } from '../screens/api.js';
import { useEffect, useState } from 'react';

import longImagePlaceholder from '../assets/placeholders/long_image.png';

const Menu = ({
  menuName,
  menuDescription,
  menuQuantity,
  menuPrice,
  menuImage,
}) => {
  const [menuImages, setMenuImages] = useState();

  useEffect(() => {
    const fetchMenuImage = async () => {
      try {
        const imageUrl = await fetchImage(menuImage);
        if (imageUrl != undefined) {
          setMenuImages(imageUrl);
        }
      } catch (error) {
        console.log(error.message);
      };
    }
    if (menuImage != "") {
      fetchMenuImage();
    };
  }, []);

  return (
    <View style={{ width: '100%', alignItems: 'center' }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'space-between',
          paddingVertical: 10
        }}>
        <Image
          style={GlobalStyles.squareImage2}
          contentFit="cover"
          source={(menuImages && menuImages != undefined) ? { uri: menuImages } : longImagePlaceholder}
        />
        <View style={{ width: '60%', paddingVertical: 10 }}>
          <View style={{ paddingBottom: 10 }}>
            <Text
              style={{
                ...GlobalStyles.body,
                padding: 3,
              }}>
              {menuName}
            </Text>
            <Text
              style={{
                ...GlobalStyles.body2,
                padding: 3,

              }}>
              {menuDescription}
            </Text>
            <Text
              style={{
                ...GlobalStyles.body2,
                padding: 3,

              }}>
              {menuQuantity}
            </Text>
          </View>
          <Text style={{ ...GlobalStyles.body4 }}>{menuPrice} Won</Text>
        </View>
      </View>
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

export default Menu;
