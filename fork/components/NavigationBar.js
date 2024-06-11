import { NavigationContainer } from '@react-navigation/native';
import { Image, View } from 'react-native';
import { useState } from 'react';

import { Home } from '../screens/Home';
import { MyPage } from '../screens/MyPage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Color, Border } from '../GlobalStyles';

const CustomTabIcon = ({ focused, focusedSource, unfocusedSource }) => (
  <Image
    source={focused ? focusedSource : unfocusedSource} // Use different sources based on the focused state
    style={{ width: 34, height: 34 }} // Adjust width, height, and tintColor as needed
  />
);

const NavigationBar = ({ homeb, mapb, favoritesb, myPageb, navigation }) => {
  const [home, setHome] = useState(homeb);
  const [favorites, setFavorites] = useState(favoritesb);
  const [map, setMap] = useState(mapb);
  const [myPage, setMyPage] = useState(myPageb);

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        height: 50,
        width: '100%',
        position: 'absolute',
        bottom: 0,
        backgroundColor: Color.white,
        paddingTop: 10,
        borderRadius: Border.br_sm,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          navigation.replace('Home');
        }}
      >
        <CustomTabIcon
          focused={home}
          focusedSource={require('../assets/icons/home_on.png')}
          unfocusedSource={require('../assets/icons/home_off.png')}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.replace('MapView');
        }}
      >
        <CustomTabIcon
          focused={map}
          focusedSource={require('../assets/icons/map_on.png')}
          unfocusedSource={require('../assets/icons/map_off.png')}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.replace('Favorites');
        }}
      >
        <CustomTabIcon
          focused={favorites}
          focusedSource={require('../assets/icons/bookmark_on.png')}
          unfocusedSource={require('../assets/icons/bookmark_off.png')}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.replace('MyPage');
        }}
      >
        <CustomTabIcon
          focused={myPage}
          focusedSource={require('../assets/icons/myPage_on.png')}
          unfocusedSource={require('../assets/icons/myPage_off.png')}
        />
      </TouchableOpacity>
      {/* Add more screens as needed */}
    </View>
  );
};

export default NavigationBar;
