import { Image, View, Text } from 'react-native';
import { Color, GlobalStyles } from '../GlobalStyles.js';

const Menu = ({
  menuName,
  menuDescription,
  menuPrice,
  menuImage,
}) => {

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
          source={Number.isInteger(menuImage) ? menuImage : { uri: menuImage }}
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
          </View>
          <Text style={{ ...GlobalStyles.body4 }}>{menuPrice} Won</Text>
        </View>
      </View>
      <View
        style={{
          borderBottomColor: Color.lightGrey,
          borderBottomWidth: 1,
          alignSelf: 'stretch',
          marginBottom: 10,
        }}
      />
    </View>
  );
};

export default Menu;
