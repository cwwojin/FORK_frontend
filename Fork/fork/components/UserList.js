import { Image, View, Text } from 'react-native';
import { GlobalStyles } from '../GlobalStyles.js';

const UserList = ({ UserImage, UserName }) => {
  return (
    <View style={{ width: 70, alignItems: 'center', margin: 9, justifyContent: 'center' }}>
      <Image
        style={{ ...GlobalStyles.profileImage, marginTop: 0 }}
        contentFit="cover"
        source={UserImage}
      />
      <Text
        style={{ ...GlobalStyles.body, marginTop: 5}}
        numberOfLines={1}
        ellipsizeMode="tail">
        {UserName}
      </Text>
    </View>
  );
};

export default UserList;
