/* import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
  TextInput
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import ToggleSwitch from 'toggle-switch-react-native';
import { useTranslator } from 'react-native-translator'; 
import { GlobalStyles, Color, Border, FontSize } from '../GlobalStyles';
import { sendBugReport } from './api';

const initialTranslations = {
  settings: 'Settings',
  general: 'General',
  allowPushNotifications: 'Allow Push Notifications',
  shareMyLocation: 'Share My Location',
  language: 'Language',
  logout: 'Logout',
  deleteAccount: 'Delete Account',
  reportAnIssue: 'Report an Issue',
  description: 'Description',
  reviewContent: 'Review Content',
  send: 'Send',
};

const Settings = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const userProfile = 22;  // Placeholder for the user profile image
  const userName = "aya.hamane";
  const userEmail = "aya2023@kaist.ac.kr";

  const [pushNotification, setPushNotification] = useState(false);
  const [accessLocation, setAccessLocation] = useState(false);
  const { translate } = useTranslator();
  const [language, setLanguage] = useState('en');
  const [translations, setTranslations] = useState(initialTranslations);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(false);
  const [reportContent, setReportContent] = useState('');

  const togglePushNotification = () => {
    setPushNotification(!pushNotification);
  };

  const toggleAccessLocation = () => {
    setAccessLocation(!accessLocation);
  };

  const fetchTranslations = async (lang) => {
    try {
      //console.log(Fetching translations for language: ${lang});
      setLoading(true);

      const translationsToFetch = {
        settings: 'Settings',
        general: 'General',
        allowPushNotifications: 'Allow Push Notifications',
        shareMyLocation: 'Share My Location',
        language: 'Language',
        logout: 'Logout',
        deleteAccount: 'Delete Account',
        reportAnIssue: 'Report an Issue',
        description: 'Description',
        reviewContent: 'Review Content',
        send: 'Send',
      };

      const fetchedTranslations = {};
      for (const key in translationsToFetch) {
        const translatedText = await translate('en', lang, translationsToFetch[key], { timeout: 5000 });
        //console.log(Translation for "${translationsToFetch[key]}": ${translatedText});
        fetchedTranslations[key] = translatedText || translationsToFetch[key];
      }

      //console.log('Fetched Translations:', fetchedTranslations);
      setTranslations(fetchedTranslations);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching translations:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (language === 'ko') {
      fetchTranslations('ko');
    } else {
      setTranslations(initialTranslations);
    }
  }, [language]);

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ko' : 'en';
    //console.log(Toggling language to: ${newLanguage});
    setLanguage(newLanguage);
  };

  const toggleReport = () => {
    setReport(!report);
    setReportContent('');
  };

  const logout = () => {
    // Logic for logout
  };

  const deleteAccount = () => {
    // Logic for delete account
  };

  const sendReport = () => {
    Alert.alert("Report Sent");
    //console.log(reportContent);
    sendBugReport(reportContent);
    toggleReport();
    setReportContent('');
  };

  if (loading) {
    return (
      <SafeAreaView style={GlobalStyles.background}>
        <View style={GlobalStyles.content}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  } */

  import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
  TextInput
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import ToggleSwitch from 'toggle-switch-react-native';
import { useTranslator } from 'react-native-translator'; 
import { GlobalStyles, Color, Border, FontSize } from '../GlobalStyles';
import { sendBugReport } from './api';
import { setLanguageToken, getLanguageToken, getAllTranslations} from '../LanguageUtils';

const initialTranslations = {
  settings: 'Settings',
  general: 'General',
  allowPushNotifications: 'Allow Push Notifications',
  shareMyLocation: 'Share My Location',
  language: 'Language',
  logout: 'Logout',
  deleteAccount: 'Delete Account',
  reportAnIssue: 'Report an Issue',
  description: 'Description',
  reviewContent: 'Review Content',
  send: 'Send',
};

const Settings = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const userProfile = 22;  // Placeholder for the user profile image
  const userName = "aya.hamane";
  const userEmail = "aya2023@kaist.ac.kr";

  const [pushNotification, setPushNotification] = useState(false);
  const [accessLocation, setAccessLocation] = useState(false);
  const { translate } = useTranslator();
  const [language, setLanguage] = useState('en');
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(false);
  const [reportContent, setReportContent] = useState('');

  const togglePushNotification = () => {
    setPushNotification(!pushNotification);
  };

  const toggleAccessLocation = () => {
    setAccessLocation(!accessLocation);
  };

  const fetchTranslations = async (lang) => {
    setLoading(true);
    const fetchedTranslations = await getAllTranslations();
    setTranslations(fetchedTranslations);
    setLoading(false);
  };

  useEffect(() => {
    const initializeLanguage = async () => {
      const savedLanguage = await getLanguageToken();
      setLanguage(savedLanguage);
      await fetchTranslations(savedLanguage);
    };
    initializeLanguage();
  }, []);

  const toggleLanguage = async () => {
    const newLanguage = language === 'en' ? 'ko' : 'en';
    setLanguage(newLanguage);
    await setLanguageToken(newLanguage);
    await fetchTranslations(newLanguage);
  };

  const toggleReport = () => {
    setReport(!report);
    setReportContent('');
  };

  const logout = () => {
    // Logic for logout
  };

  const deleteAccount = () => {
    // Logic for delete account
  };

  const sendReport = () => {
    Alert.alert("Report Sent");
    sendBugReport(reportContent);
    toggleReport();
    setReportContent('');
  };

  if (loading) {
    return (
      <SafeAreaView style={GlobalStyles.background}>
        <View style={GlobalStyles.content}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={GlobalStyles.background}>
      <View style={GlobalStyles.content}>
        <View style={{ width: '100%', flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              style={GlobalStyles.icon}
              source={require('../assets/icons/navigate_left.png')}
            />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: -27, paddingBottom: 10 }}>
            <Text style={GlobalStyles.h1}>{translations.settings}</Text>
          </View>
        </View>

        <View style={{ alignItems: 'center', width: '100%' }}>
          <Image
            style={{ ...GlobalStyles.profileImage, marginTop: 10, marginBottom: 10 }}
            contentFit="cover"
            source={userProfile}
          />
          <Text style={GlobalStyles.body}>{userName}</Text>
          <Text style={{ ...GlobalStyles.body2, paddingVertical: 8 }}>{userEmail}</Text>
        </View>

        <View style={{ width: '100%', paddingVertical: 5 }}>
          <Text style={GlobalStyles.h2}>{translations.general}</Text>
          <View style={styles.container} onPress={togglePushNotification}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={require('../assets/icons/notification.png')}
                style={styles.icon}
              />
              <Text style={GlobalStyles.body}>{translations.allowPushNotifications}</Text>
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
              <Text style={GlobalStyles.body}>{translations.shareMyLocation}</Text>
            </View>
            <ToggleSwitch
              isOn={accessLocation}
              onColor={Color.orange_700}
              offColor={Color.lightGrey}
              size="small"
              onToggle={toggleAccessLocation}
            />
          </View>
          <View style={styles.container} onPress={toggleLanguage}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={require('../assets/icons/language.png')}
                style={styles.icon}
              />
              <Text style={GlobalStyles.body}>{translations.language}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ ...GlobalStyles.body2, paddingHorizontal: 5 }}>ENG</Text>
              <ToggleSwitch
                isOn={language === 'ko'}
                onColor={Color.orange_700}
                offColor={Color.lightGrey}
                size="small"
                onToggle={toggleLanguage}
              />
              <Text style={{ ...GlobalStyles.body2, paddingHorizontal: 5 }}>KOR</Text>
            </View>
          </View>
        </View>
        <View style={{ width: '100%', paddingVertical: 5 }}>
          <TouchableOpacity style={styles.container} onPress={logout}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={require('../assets/icons/logout.png')}
                style={styles.icon}
              />
              <Text style={GlobalStyles.body}>{translations.logout}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.container} onPress={deleteAccount}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={require('../assets/icons/delete.png')}
                style={styles.icon}
              />
              <Text style={GlobalStyles.body}>{translations.deleteAccount}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ width: '100%', paddingVertical: 5 }}>
          <TouchableOpacity style={styles.container} onPress={toggleReport}>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: Color.yellow_100, width: '100%', paddingVertical: 10, borderRadius: Border.br_2xs }}>
              <Image
                source={require('../assets/icons/report.png')}
                style={{ ...styles.icon, tintColor: Color.orange_700 }}
              />
              <Text style={GlobalStyles.body}>{translations.reportAnIssue}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {report && (
          <View style={styles.overlay}>
            <View style={styles.background}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={GlobalStyles.h2}>{translations.description}</Text>
                <TouchableOpacity style={{ ...GlobalStyles.topIcon, marginRight: 0 }} onPress={toggleReport}>
                  <Image
                    source={require('../assets/icons/navigate_close.png')}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ width: '100%', alignItems: 'center' }}>
                <View style={styles.inputSection}>
                  <Text style={GlobalStyles.h3}>{translations.description}</Text>
                  <View style={GlobalStyles.inputWrapper3}>
                    <TextInput
                      style={styles.registrationInput2}
                      onChangeText={setReportContent}
                      value={reportContent}
                      placeholder={translations.reviewContent}
                      multiline={false}
                      numberOfLines={5}
                      onSubmitEditing={() => Keyboard.dismiss()}
                    />
                  </View>
                </View>
                <View style={{ width: '100%', justifyContent: 'flex-end', flexDirection: 'row', paddingTop: 20 }}>
                  <TouchableOpacity onPress={sendReport}>
                    <Text style={GlobalStyles.h4}>{translations.send}</Text>
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
    marginRight: 10
  },
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center'
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
    height: '50%',
    width: '90%',
    justifyContent: 'flex-start',
    backgroundColor: Color.white,
    borderRadius: Border.br_lg,
    padding: 30,
    paddingTop: 15,
    alignItems: 'center'
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

  /* return (
    <SafeAreaView style={GlobalStyles.background}>
      <View style={GlobalStyles.content}>
        <View style={{ width: '100%', flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              style={GlobalStyles.icon}
              source={require('../assets/icons/navigate_left.png')}
            />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: -27, paddingBottom: 10 }}>
            <Text style={GlobalStyles.h1}>{translations.settings}</Text>
          </View>
        </View>

        <View style={{ alignItems: 'center', width: '100%' }}>
          <Image
            style={{ ...GlobalStyles.profileImage, marginTop: 10, marginBottom: 10 }}
            contentFit="cover"
            source={userProfile}
          />
          <Text style={GlobalStyles.body}>{userName}</Text>
          <Text style={{ ...GlobalStyles.body2, paddingVertical: 8 }}>{userEmail}</Text>
        </View>

        <View style={{ width: '100%', paddingVertical: 5 }}>
          <Text style={GlobalStyles.h2}>{translations.general}</Text>
          <View style={styles.container} onPress={togglePushNotification}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={require('../assets/icons/notification.png')}
                style={styles.icon}
              />
              <Text style={GlobalStyles.body}>{translations.allowPushNotifications}</Text>
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
              <Text style={GlobalStyles.body}>{translations.shareMyLocation}</Text>
            </View>
            <ToggleSwitch
              isOn={accessLocation}
              onColor={Color.orange_700}
              offColor={Color.lightGrey}
              size="small"
              onToggle={toggleAccessLocation}
            />
          </View>
          <View style={styles.container} onPress={toggleLanguage}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={require('../assets/icons/language.png')}
                style={styles.icon}
              />
              <Text style={GlobalStyles.body}>{translations.language}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ ...GlobalStyles.body2, paddingHorizontal: 5 }}>ENG</Text>
              <ToggleSwitch
                isOn={language === 'ko'}
                onColor={Color.orange_700}
                offColor={Color.lightGrey}
                size="small"
                onToggle={toggleLanguage}
              />
              <Text style={{ ...GlobalStyles.body2, paddingHorizontal: 5 }}>KOR</Text>
            </View>
          </View>
        </View>
        <View style={{ width: '100%', paddingVertical: 5 }}>
          <TouchableOpacity style={styles.container} onPress={logout}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={require('../assets/icons/logout.png')}
                style={styles.icon}
              />
              <Text style={GlobalStyles.body}>{translations.logout}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.container} onPress={deleteAccount}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={require('../assets/icons/delete.png')}
                style={styles.icon}
              />
              <Text style={GlobalStyles.body}>{translations.deleteAccount}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ width: '100%', paddingVertical: 5 }}>
          <TouchableOpacity style={styles.container} onPress={toggleReport}>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: Color.yellow_100, width: '100%', paddingVertical: 10, borderRadius: Border.br_2xs }}>
              <Image
                source={require('../assets/icons/report.png')}
                style={{ ...styles.icon, tintColor: Color.orange_700 }}
              />
              <Text style={GlobalStyles.body}>{translations.reportAnIssue}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {report && (
          <View style={styles.overlay}>
            <View style={styles.background}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={GlobalStyles.h2}>{translations.description}</Text>
                <TouchableOpacity style={{ ...GlobalStyles.topIcon, marginRight: 0 }} onPress={toggleReport}>
                  <Image
                    source={require('../assets/icons/navigate_close.png')}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ width: '100%', alignItems: 'center' }}>
                <View style={styles.inputSection}>
                  <Text style={GlobalStyles.h3}>{translations.description}</Text>
                  <View style={GlobalStyles.inputWrapper3}>
                    <TextInput
                      style={styles.registrationInput2}
                      onChangeText={setReportContent}
                      value={reportContent}
                      placeholder={translations.reviewContent}
                      multiline={false}
                      numberOfLines={5}
                      onSubmitEditing={() => Keyboard.dismiss()}
                    />
                  </View>
                </View>
                <View style={{ width: '100%', justifyContent: 'flex-end', flexDirection: 'row', paddingTop: 20 }}>
                  <TouchableOpacity onPress={sendReport}>
                    <Text style={GlobalStyles.h4}>{translations.send}</Text>
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
    marginRight: 10
  },
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center'
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
    height: '50%',
    width: '90%',
    justifyContent: 'flex-start',
    backgroundColor: Color.white,
    borderRadius: Border.br_lg,
    padding: 30,
    paddingTop: 15,
    alignItems: 'center'
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

export default Settings; */