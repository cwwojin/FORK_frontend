import { Image, View, Text } from 'react-native';
import { GlobalStyles } from '../GlobalStyles.js';

const UserList = ({ UserImage, UserName }) => {
  if (UserImage == undefined) {
    UserImage = require('../assets/placeholders/User.png');
  };
  
  return (
    <View style={{ width: 70, alignItems: 'center', margin: 9, justifyContent: 'center' }}>
      <Image
        style={{ ...GlobalStyles.profileImage, marginTop: 0 }}
        contentFit="cover"
        source={Number.isInteger(UserImage) ? UserImage : { uri: UserImage }}
      />
      <Text
        style={{ ...GlobalStyles.body4, marginTop: 5}}
        numberOfLines={1}
        ellipsizeMode="tail">
        {UserName}
      </Text>
    </View>
  );
};

export default UserList;
