import { useState } from 'react';
import {
  Text,
  View,
  Image,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import ToggleSwitch from 'toggle-switch-react-native';

import { GlobalStyles, Color, Border, FontSize } from '../GlobalStyles';

const Settings = () => {
  //Get Informations of facilities
  //All the reviews [facility_img, facility_name, score(int), date(string), review_img, review_content, hashtags(Array)]

  const navigation = useNavigation();
  const route = useRoute();

  const { userProfile, userName, userEmail } = route.params;

  const [pushNotification, setPushNotification] = useState(false);
  const [accessLocation, setAccessLocation] = useState(false);
  const [language, setLanguage] = useState(false);

  const [report, setReport] = useState(false);
  const [reportContent, setReportContent] = useState('');

  const togglePushNotification = () => {
    setPushNotification(!pushNotification);
  };
  const toggleAccessLocation = () => {
    setAccessLocation(!accessLocation);
  };
  const toggleLaguage = () => {
    setLanguage(!language);
  };

  const toggleReport = () => {
    setReport(!report);
  };

  const logout = () => {
    Alert.alert(
      'Confirm Logout',
      'Do you really want to logout?',
      [
        {
          text: 'No',
          onPress: () => console.log('Logout cancelled'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            console.log('User logged out');
            // Add your logout logic here
          },
        },
      ],
      { cancelable: false }
    );
  };

  const deleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Do you really want to delete your account?',
      [
        {
          text: 'No',
          onPress: () => console.log('Logout cancelled'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            console.log('User logged out');
            // Add your logout logic here
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <SafeAreaView style={GlobalStyles.background}>
      <View style={GlobalStyles.content}>
        <View style={{ width: '100%', flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Image
              style={GlobalStyles.icon}
              source={require('../assets/icons/navigate_left.png')}
            />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: -27,
              paddingBottom: 10,
            }}
          >
            <Text style={GlobalStyles.h1}>Settings</Text>
          </View>
        </View>

        <View
          style={{
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Image
            style={{
              ...GlobalStyles.profileImage,
              marginTop: 10,
              marginBottom: 10,
            }}
            contentFit="cover"
            source={userProfile}
          />
          <Text style={GlobalStyles.body}>{userName}</Text>
          <Text style={{ ...GlobalStyles.body2, paddingVertical: 8 }}>
            {userEmail}
          </Text>
        </View>

        <View style={{ width: '100%', paddingVertical: 5 }}>
          <Text style={GlobalStyles.h2}>General</Text>
          <View style={styles.container} onPress={togglePushNotification}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={require('../assets/icons/notification.png')}
                style={styles.icon}
              />
              <Text style={GlobalStyles.body}>Allow Push Notifications</Text>
            </View>
            <ToggleSwitch
              isOn={pushNotification}
              onColor={Color.orange_700}
              offColor={Color.lightGrey}
              size="small"
              onToggle={togglePushNotification}
            />
          </View>
          <View style={styles.container} onPress={toggleAccessLocation}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={require('../assets/icons/location.png')}
                style={styles.icon}
              />
              <Text style={GlobalStyles.body}>Share my location</Text>
            </View>
            <ToggleSwitch
              isOn={accessLocation}
              onColor={Color.orange_700}
              offColor={Color.lightGrey}
              size="small"
              onToggle={toggleAccessLocation}
            />
          </View>
          <View style={styles.container} onPress={toggleLaguage}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={require('../assets/icons/language.png')}
                style={styles.icon}
              />
              <Text style={GlobalStyles.body}>language</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ ...GlobalStyles.body2, paddingHorizontal: 5 }}>
                ENG
              </Text>
              <ToggleSwitch
                isOn={language}
                onColor={Color.orange_700}
                offColor={Color.lightGrey}
                size="small"
                onToggle={toggleLaguage}
              />
              <Text style={{ ...GlobalStyles.body2, paddingHorizontal: 5 }}>
                KOR
              </Text>
            </View>
          </View>
        </View>

        <View style={{ width: '100%', paddingVertical: 5 }}>
          <Text style={GlobalStyles.h2}>Account</Text>
          <TouchableOpacity style={styles.container} onPress={logout}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={require('../assets/icons/logout.png')}
                style={styles.icon}
              />
              <Text style={GlobalStyles.body}>logout</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.container} onPress={deleteAccount}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={require('../assets/icons/delete.png')}
                style={styles.icon}
              />
              <Text style={GlobalStyles.body}>Delete account</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ width: '100%', paddingVertical: 5 }}>
          <Text style={GlobalStyles.h2}>Support</Text>
          <TouchableOpacity style={styles.container} onPress={toggleReport}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: Color.yellow_100,
                width: '100%',
                paddingVertical: 10,
                borderRadius: Border.br_2xs,
              }}
            >
              <Image
                source={require('../assets/icons/report.png')}
                style={{ ...styles.icon, tintColor: Color.orange_700 }}
              />
              <Text style={GlobalStyles.body}>Report an Issue</Text>
            </View>
          </TouchableOpacity>
        </View>

        {report && (
          <View style={styles.overlay}>
            <View style={styles.background}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={GlobalStyles.h2}>Issue Report</Text>
                <TouchableOpacity
                  style={{ ...GlobalStyles.topIcon, marginRight: 0 }}
                  onPress={toggleReport}
                >
                  <Image
                    source={require('../assets/icons/navigate_close.png')}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ width: '100%', alignItems: 'center' }}>
                <View style={styles.inputSection}>
                  <Text style={GlobalStyles.h3}>title</Text>
                  <View style={GlobalStyles.inputWrapper3}>
                    <TextInput
                      style={styles.registrationInput1}
                      onChangeText={setReportContent}
                      value={reportContent}
                      placeholder="Review Content"
                      multiline={true}
                      numberOfLines={1}
                    />
                  </View>
                </View>
                <View style={styles.inputSection}>
                  <Text style={GlobalStyles.h3}>description</Text>
                  <View style={GlobalStyles.inputWrapper3}>
                    <TextInput
                      style={styles.registrationInput2}
                      onChangeText={setReportContent}
                      value={reportContent}
                      placeholder="Review Content"
                      multiline={true}
                      numberOfLines={5}
                    />
                  </View>
                </View>
                <View
                  style={{
                    width: '100%',
                    justifyContent: 'flex-end',
                    flexDirection: 'row',
                    paddingTop: 20,
                  }}
                >
                  <TouchableOpacity>
                    <Text style={GlobalStyles.h4}>Send</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayTouchable: {
    width: '80%',
    height: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    height: '70%',
    width: '90%',
    justifyContent: 'flex-start',
    backgroundColor: Color.white,
    borderRadius: Border.br_lg,
    padding: 30,
    paddingTop: 15,
    alignItems: 'center',
  },
  inputSection: {
    width: '100%',
    paddingVertical: 10,
  },
  registrationInput1: {
    width: '100%',
    borderColor: Color.lightGrey,
    paddingVertical: 20,
    paddingTop: 20,
    fontSize: FontSize.size_sm,
    color: Color.black,
    paddingHorizontal: 25,
    borderRadius: Border.br_9xs,
    borderWidth: 2,
    height: 60,
  },
  registrationInput2: {
    width: '100%',
    borderColor: Color.lightGrey,
    paddingVertical: 20,
    paddingTop: 20,
    fontSize: FontSize.size_sm,
    color: Color.black,
    paddingHorizontal: 25,
    borderRadius: Border.br_9xs,
    borderWidth: 2,
    height: 180,
  },
});

export default Settings;
