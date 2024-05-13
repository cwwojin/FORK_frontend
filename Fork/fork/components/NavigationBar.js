import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, View } from 'react-native';

import { Home } from '../screens/Home';
import { MyPage } from '../screens/MyPage';

const Tab = createBottomTabNavigator();

const CustomTabIcon = ({ focused, focusedSource, unfocusedSource }) => (
  <Image
    source={focused ? focusedSource : unfocusedSource} // Use different sources based on the focused state
    style={{ width: 34, height: 34 }} // Adjust width, height, and tintColor as needed
  />
);

const NavigationBar = () => {
  return (
    <View style={{ height: 50 }}>
      <Tab.Navigator
        tabBarOptions={{
          showLabel: false, // Hide tab labels
          tabStyle: {
            paddingVertical: 25,
          },
          iconStyle: {
            marginBottom: 5, // Adjust icon alignment if necessary
          },
        }}>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({ focused }) => (
              <CustomTabIcon
                focused={focused}
                focusedSource={require('../assets/icons/home_on.png')}
                unfocusedSource={require('../assets/icons/home_off.png')}
              />
            ),
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Map"
          component={Home}
          options={{
            tabBarIcon: ({ focused }) => (
              <CustomTabIcon
                focused={focused}
                focusedSource={require('../assets/icons/home_on.png')}
                unfocusedSource={require('../assets/icons/home_off.png')}
              />
            ),
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Favorite"
          component={Home}
          options={{
            tabBarIcon: ({ focused }) => (
              <CustomTabIcon
                focused={focused}
                focusedSource={require('../assets/icons/bookmark_on.png')}
                unfocusedSource={require('../assets/icons/bookmark_off.png')}
              />
            ),
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="My Page"
          component={MyPage}
          options={{
            tabBarIcon: ({ focused }) => (
              <CustomTabIcon
                focused={focused}
                focusedSource={require('../assets/icons/home_on.png')}
                unfocusedSource={require('../assets/icons/home_off.png')}
              />
            ),
            headerShown: false,
          }}
        />
        {/* Add more screens as needed */}
      </Tab.Navigator>
    </View>
  );
};

export default NavigationBar;
