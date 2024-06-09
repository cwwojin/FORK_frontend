import { Image, View, Text, ActivityIndicator } from 'react-native';
import { Color, GlobalStyles } from '../GlobalStyles.js';
import { fetchImage } from '../screens/api.js';
import { useEffect, useState } from 'react';
import longImagePlaceholder from '../assets/placeholders/long_image.png';
import { getLanguageToken } from '../LanguageUtils';
import Translator, {
  useTranslator,
} from 'react-native-translator';

const Menu = ({
  menuName,
  menuDescription,
  menuQuantity,
  menuPrice,
  menuImage,
}) => {
  const [menuImages, setMenuImages] = useState();
  const [translatedMenu, setTranslatedMenu] = useState({
    name: menuName,
    description: menuDescription,
    quantity: menuQuantity,
  });
  const [loading, setLoading] = useState(true);
  const { translate } = useTranslator();
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const imageUrl = await fetchImage(menuImage);
        if (imageUrl != undefined) {
          setMenuImages(imageUrl);
        }
        const currentLanguage = await getLanguageToken();
    
        const targetLanguage = currentLanguage === 'ko' ? 'en' : 'kr';
        let translatedMenuData = {
          name: await translate(targetLanguage, currentLanguage, menuName, {
            timeout: 5000,
          }),
          description: await translate(targetLanguage, currentLanguage, menuDescription, {
            timeout: 5000,
          }),
          quantity: await translate(targetLanguage, currentLanguage, menuQuantity, {
              timeout: 5000,
          })
        };
        setTranslatedMenu(translatedMenuData);
        setLanguage(targetLanguage);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    }; 
    fetchData();
  }, [language]);

  if (loading) {
    return <ActivityIndicator size="large" color={Color.orange_700} />;
  }

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
              {translatedMenu.name}
            </Text>
            <Text
              style={{
                ...GlobalStyles.body2,
                padding: 3,

              }}>
              {translatedMenu.description}
            </Text>
            <Text
              style={{
                ...GlobalStyles.body2,
                padding: 3,

              }}>
              {translatedMenu.quantity}
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
