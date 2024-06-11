import { Image, View, Text } from 'react-native';
import { GlobalStyles } from '../GlobalStyles.js';
import { useEffect, useState } from 'react';

const UserList = ({ UserImage, UserName, UserEnglishName }) => {
  if (UserImage == undefined) {
    UserImage = require('../assets/placeholders/User.png');
  };

  const [language, setLanguage] = useState('en');  

  useEffect(() => {
    const fetchLanguage = async () => {
      const currentLanguage = await getLanguageToken();
      setLanguage(currentLanguage);
      console.log("language: ", language);
    }
    fetchLanguage();
  }, []);

  return (
    <View style={{ width: 70, alignItems: 'center', margin: 9, justifyContent: 'center' }}>
      <Image
        style={{ ...GlobalStyles.profileImage, marginTop: 0 }}
        contentFit="cover"
        source={Number.isInteger(UserImage) ? UserImage : { uri: UserImage }}
      />
      <Text
        style={{ ...GlobalStyles.body4, marginTop: 5 }}
        numberOfLines={1}
        ellipsizeMode="tail">
            {language === 'ko' ? UserName : UserEnglishName}
      </Text>
    </View>
  );
};

export default UserList;
