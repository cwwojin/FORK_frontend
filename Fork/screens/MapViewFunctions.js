import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, ScrollView, TextInput, Button, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Color, GlobalStyles } from '../GlobalStyles';
import LongImage from '../assets/placeholders/long_image.png';
import { getAllTranslations, getLanguageToken } from '../LanguageUtils';
import Translator, {
    useTranslator,
  } from 'react-native-translator';

export const isOpenNow = (openingHours) => {
    const [translation, setTranslation] = useState({});

    useEffect(() => {
      const fetchTranslations = async () => {
        const fetchedTranslations = await getAllTranslations();
        setTranslation(fetchedTranslations);
      };
      fetchTranslations();
    }, []);

    if (!openingHours || openingHours.length === 0) {
        return { status: translation.closed, color: 'red' };
    }
    const now = new Date();
    const dayOfWeek = now.getDay(); // JavaScript's Date.getDay() gives Sunday - Saturday : 0 - 6

    // Adjust to match your database indexing (0 for Monday, 6 for Sunday)
    const apiDayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    const todayHours = openingHours.find(obj => obj !== null && obj.day !== null && obj.day === apiDayIndex);
    if (!todayHours || todayHours.open_time === null || todayHours.close_time === null) {
        // If today's hours are undefined or times or day are null, assume closed
        return { status: translation.closed, color: 'red' };
    }

    const currentTime = now.toTimeString().substr(0, 8); // "HH:MM:SS" format
    const { open_time, close_time } = todayHours;

    // Check if the current time is between the opening and closing times
    if (currentTime >= open_time && currentTime <= close_time) {
        return { status: translation.open, color: 'green' };
    }
    return { status: translation.closed, color: 'red' };
};

const s3UriToRequestUrl = (baseUrl, uri) => {
    const url = new URL(uri);
    const key = url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname;
    const parsedKey = key.replaceAll('/', '%2F');

    return `${baseUrl}/s3/${url.hostname}/${parsedKey}`;
};

const baseUrl = "https://taqjpw7a54.execute-api.ap-southeast-2.amazonaws.com/stage-dev";

const categorizePreferences = (preferences) => {
    const cuisineTypes = preferences.filter(pref => pref !== null && pref.type === 0).map(pref => pref.name);
    const dietTypes = preferences.filter(pref => pref !== null && pref.type === 1).map(pref => pref.name);
    return { cuisineTypes, dietTypes };
};


export const FacilityDetails = ({ facility, onPress }) => {
    const [translations, setTranslations] = useState({});
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        const initializeLanguage = async () => {
          const savedLanguage = await getLanguageToken();
          setLanguage(savedLanguage);
          const fetchedTranslations = await getAllTranslations();
          setTranslations(fetchedTranslations);
        };
        initializeLanguage();
    }, [language]);

    
    let status = "Unknown";
    let color = 'grey';
    if (facility.opening_hours != null) {
        const isOpen = isOpenNow(facility.opening_hours);
        if (isOpen) {
            status = isOpen.status;
            color = isOpen.color;
        } else {
            status = "Unknown";
            color = 'grey';
        }
    }
    const image = facility.profile_img_uri ? { uri: s3UriToRequestUrl(baseUrl, facility.profile_img_uri) } : LongImage;

    let cuisineTypes = [];
    let dietTypes = [];

    if (facility.preferences != null) {
        const categorizedPreferences = categorizePreferences(facility.preferences);
        cuisineTypes = categorizedPreferences.cuisineTypes;
        dietTypes = categorizedPreferences.dietTypes;
        if (cuisineTypes.length > 0 || dietTypes.length > 0) {
            //console.log("Cuisine types : " + cuisineTypes + ", Diet types : " + dietTypes);
        }
    }

    return (

        <TouchableOpacity onPress={onPress} style={styles.facilityContainer}>
            <View style={{ width: '100%', alignItems: 'center' }}>
                <Image
                    style={{ ...GlobalStyles.longImage, marginTop: 5 }}
                    contentFit="cover"
                    source={image}
                />
                <View style={{ marginLeft: 20, marginRight: 20, width: '95%' }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                            <Text
                                style={{ ...GlobalStyles.body, marginRight: 10 }}
                                numberOfLines={1}
                                ellipsizeMode="tail">
                                {language === 'ko' ? facility.name : facility.english_name}
                            </Text>
                            <Text style={{...GlobalStyles.body2, color: color}}>{status}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Image
                                style={GlobalStyles.icon}
                                contentFit="cover"
                                source={require('../assets/icons/star.png')}
                            />
                            <Text style={GlobalStyles.body3}>{facility.avg_score ? facility.avg_score : '-'}</Text>
                        </View>
                    </View>
                    <Text style={{ ...GlobalStyles.body2, marginBottom: 18 }} numberOfLines={1} ellipsizeMode="tail">
                        {language === 'ko' ? facility.road_address : facility.english_address}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};


const styles = StyleSheet.create({
    facilityContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: 'white',
        marginTop: 10,
    },
    facilityImage: {
        width: '100%',
        height: 180,
        borderRadius: 10,
        marginBottom: 5,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 3,
    },
    nameStatusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    facilityName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 5,
        flexShrink: 1,
    },
    openClosedText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 7,
        marginLeft: 10,
    },
    facilityScore: {
        fontSize: 18,
        color: Color.orange_700,
        fontWeight: 'bold',
        marginTop: 5,
        marginRight: 5,
    },
    facilityLocation: {
        fontSize: 16,
        color: '#666',
    },
    facilityDescription: {
        fontSize: 14,
        marginTop: 5,
    },
});

