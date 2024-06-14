import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import NavigationBar from '../components/NavigationBar';
import { WebView } from 'react-native-webview';
import {
  fetchFacilityWithName,
  fetchFacilitiesInBounds,
  getParsedUserPreferences,
  LOGIN,
} from './api';
import { FacilityDetails } from './MapViewFunctions';
import { isOpenNow } from './MapViewFunctions';
import * as Location from 'expo-location';
import { getLanguageToken, getAllTranslations } from '../LanguageUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MapView = () => {
  const navigation = useNavigation();

  useEffect(() => {
    if (!LOGIN) {
      navigation.replace('SignUpLogIn');
    }
  }, LOGIN);

  const [searchQuery, setSearchQuery] = useState('');
  const webViewRef = useRef(null);
  const [webViewReady, setWebViewReady] = useState(false);
  const [displayedFacilities, setDisplayedFacilities] = useState([]);
  const [showOnlyOpen, setShowOnlyOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 36.3715, lng: 127.3625 });
  const [mapZoom, setMapZoom] = useState(3);
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [userPreferencesActive, setUserPreferencesActive] = useState(false);
  const userBookmarkedActive = useRef(false);

  const [neLat, setNeLat] = useState(null);
  const [neLng, setNeLng] = useState(null);
  const [swLat, setSwLat] = useState(null);
  const [swLng, setSwLng] = useState(null);

  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [selectedDietaryPreferences, setSelectedDietaryPreferences] = useState(
    []
  );

  var isUserMarkerVisible = false;

  const cuisines = [
    {
      id: 1,
      name: 'Korean',
      typeIcon: require('../assets/icons/attributes/korean.png'),
    },
    {
      id: 2,
      name: 'Japanese',
      typeIcon: require('../assets/icons/attributes/japanese.png'),
    },
    {
      id: 3,
      name: 'Chinese',
      typeIcon: require('../assets/icons/attributes/chinese.png'),
    },
    {
      id: 4,
      name: 'Asian',
      typeIcon: require('../assets/icons/attributes/asian.png'),
    },
    {
      id: 5,
      name: 'Western',
      typeIcon: require('../assets/icons/attributes/western.png'),
    },
    {
      id: 6,
      name: 'Pizza',
      typeIcon: require('../assets/icons/attributes/pizza.png'),
    },
    {
      id: 7,
      name: 'Burger',
      typeIcon: require('../assets/icons/attributes/burger.png'),
    },
    {
      id: 8,
      name: 'Chicken',
      typeIcon: require('../assets/icons/attributes/chicken.png'),
    },
    {
      id: 9,
      name: 'Salad',
      typeIcon: require('../assets/icons/attributes/salad.png'),
    },
    {
      id: 10,
      name: 'Cafe',
      typeIcon: require('../assets/icons/attributes/coffee.png'),
    },
    {
      id: 11,
      name: 'Bar',
      typeIcon: require('../assets/icons/attributes/bar.png'),
    },
  ];

  const dietaryPreferences = [
    {
      id: 12,
      name: 'Vegetarian',
      typeIcon: require('../assets/icons/attributes/vegetarian.png'),
    },
    {
      id: 13,
      name: 'Vegan',
      typeIcon: require('../assets/icons/attributes/salad.png'),
    },
    {
      id: 14,
      name: 'Pescatarian',
      typeIcon: require('../assets/icons/attributes/pescatarian.png'),
    },
    {
      id: 15,
      name: 'Halal',
      typeIcon: require('../assets/icons/attributes/halal.png'),
    },
    {
      id: 16,
      name: 'LactoseFree',
      typeIcon: require('../assets/icons/attributes/lactosefree.png'),
    },
    {
      id: 17,
      name: 'GlutenFree',
      typeIcon: require('../assets/icons/attributes/glutenfree.png'),
    },
  ];

  const [translations, setTranslations] = useState({
    filter: '',
    openFacilitiesOnly: '',
    allFacilities: '',
    enterFacilityName: '',
    cuisineType: '',
    dietaryPreference: '',
    loadingFacilities: '',
    enterFacilityName: '',
    cuisines: {},
    dietaryPreferences: {},
  });

  useEffect(() => {
    const fetchTranslations = async () => {
      const fetchedTranslations = await getAllTranslations();
      setTranslations(fetchedTranslations);
    };
    fetchTranslations();
  }, []);

  const handleSelectCuisine = (cuisine) => {
    setSelectedCuisines((prev) => {
      const newCuisines = prev.includes(cuisine)
        ? prev.filter((item) => item !== cuisine)
        : [...prev, cuisine];
      fetchAndUpdateFacilities('', neLat, neLng, swLat, swLng);
      return newCuisines;
    });
  };

  const handleSelectDietaryPreference = (preference) => {
    setSelectedDietaryPreferences((prev) => {
      const newPreferences = prev.includes(preference)
        ? prev.filter((item) => item !== preference)
        : [...prev, preference];
      fetchAndUpdateFacilities('', neLat, neLng, swLat, swLng);
      return newPreferences;
    });
  };

  const handleLocate = async () => {
    const locationPermission = await AsyncStorage.getItem('locationPermission');
    console.log('value in Map: ' + locationPermission);
    if (locationPermission === 'true') {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(translations.permissionDenied);
        return;
      }
      console.log(translations.permissionGranted);
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const locationData = {
        type: 'addUserMarker',
        lat: latitude,
        lng: longitude,
      };
      webViewRef.current.postMessage(JSON.stringify(locationData));
    } else {
      Alert.alert(translations.permissionDenied);
      const removeMarkerData = {
        type: 'removeUserMarker',
      };
      webViewRef.current.postMessage(JSON.stringify(removeMarkerData));
    }
  };

  const handleTogglePreferences = () => {
    const newActiveState = !userPreferencesActive;
    setUserPreferencesActive(newActiveState);
    if (newActiveState) {
      const preferences = getParsedUserPreferences();
      const newSelectedCuisines = preferences.filter((pref) => {
        const matched = cuisines.some((c) => c.id === pref);
        return matched;
      });

      const newSelectedDietaryPreferences = preferences.filter((pref) => {
        const matched = dietaryPreferences.some((d) => d.id === pref);
        return matched;
      });
      setSelectedCuisines(newSelectedCuisines);
      setSelectedDietaryPreferences(newSelectedDietaryPreferences);
    } else {
      setSelectedCuisines([]);
      setSelectedDietaryPreferences([]);
    }
  };

  const handleToggleBookmarked = () => {
    newActiveState = !userBookmarkedActive.current;
    userBookmarkedActive.current = newActiveState;
    fetchAndUpdateFacilities(searchQuery, neLat, neLng, swLat, swLng);
  };

  const mapHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>KAKAO MAP</title>
    <style>
      html, body, #map {
        height: 100%;
        margin: 0;
        padding: 0;
      }
      #zoomControls {
        position: absolute;
        right: 17px; /* Right spacing */
        top: 50%; /* Vertically middle */
        /*transform: translateY(80%);*/
        transform: translateY(-30%);
        z-index: 5;
      }
      .button {
        display: block;
        padding: 12px;
        margin-top: 10px;
        cursor: pointer;
        background-color: #fff;
        border: none;
        border-radius: 50%; /* Circular buttons */
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        width: 100px; /* Diameter of buttons */
        height: 100px; /* Diameter of buttons */
        font-size: 48px; /* Font size for '+' and '-' */
        color: #EA7700; /* Font color for '+' and '-' */
        font-weight: bold; /* Font weight for '+' and '-' */
        text-align: center;
        line-height: 50px; /* Center the text vertically */
      }
      .buttonOn {
        display: block;
        padding: 12px;
        margin-top: 10px;
        cursor: pointer;
        background-color: #fff;
        border: 2px solid #EA7700;
        border-radius: 50%; /* Circular buttons */
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        width: 100px; /* Diameter of buttons */
        height: 100px; /* Diameter of buttons */
        font-size: 48px; /* Font size for '+' and '-' */
        color: #EA7700; /* Font color for '+' and '-' */
        font-weight: bold; /* Font weight for '+' and '-' */
        text-align: center;
        line-height: 50px; /* Center the text vertically */
      }
      .overlay {
        background: rgba(255, 255, 255, 0.8); /* Semi-transparent white background */
        border-radius: 5px; /* Rounded corners */
        border: 1px solid #EA7700; /* Orange border */
        padding: 5px 10px; /* Padding around text */
        font-size: 22px; /* Larger font size */
        color: #EA7700; /* Orange text color */
        font-weight: bold; /* Bold text */
        text-align: center; /* Centered text */
        min-width: 30px; /* Minimum width */
        min-height: 25px;
      }
    </style>
    <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=894c8ee198dfae892065023fefacf3ec"></script>
  </head>
  <body>
    <div id="zoomControls">
      <button class="button" onclick="zoomIn()">+</button>
      <button class="button" onclick="zoomOut()">-</button>
      <button class="button" id="locateButton" onclick="toggleLocate()">📍</button>
      <button class="button" id="preferencesButton" onclick="togglePreferences()">⚙️</button>
      <button class="button" id="bookmarkedButton" onclick="toggleBookmarked()">★</button>
    </div>
    <div id="map"></div>
    <script>
      var map;
      var userMarkerVisible = false; 
      var container = document.getElementById('map');
      var options = {
        center: new kakao.maps.LatLng(36.3695, 127.3625,),
        level: 3
      };

      function initMap() {
        map = new kakao.maps.Map(container, options);
        kakao.maps.event.addListener(map, 'idle', handleBoundsChange);
        kakao.maps.event.addListener(map, 'zoom_changed', adjustMarkerSize);
        kakao.maps.event.addListener(map, 'center_changed', function() {
          const center = map.getCenter();
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'updateCenterAndZoom',
            centerLat: center.getLat(),
            centerLng: center.getLng(),
            zoomLevel: map.getLevel()
          }));
        });

        window.userMarker = null;
        window.markers = [];
        window.overlays = [];
        window.addEventListener('message', handleMessage);
      }

      function toggleLocate() {
        userMarkerVisible = !userMarkerVisible; // Toggle the marker visibility state
        var locateButton = document.getElementById('locateButton');
        
        if (locateButton.classList.contains('buttonOn')) {
          locateButton.classList.remove('buttonOn'); // Remove 'buttonOn' to show default style
          locateButton.classList.add('button'); // Add 'button' to ensure styling consistency
        } else {
          locateButton.classList.remove('button'); // Remove 'button' if it exists
          locateButton.classList.add('buttonOn'); // Add 'buttonOn' to show active state
        }
        // window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'debug', message: "toggling" + userMarkerVisible }));
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'markerVisibilityChanged',
          isVisible: userMarkerVisible
        }));
      }

      function togglePreferences() {
        const updateMarker = {
          type: 'debug', 
          message:"in togglePreferences()"
        };

        if (preferencesButton.classList.contains('buttonOn')) {
          preferencesButton.classList.remove('buttonOn'); // Remove 'buttonOn' to show default style
          preferencesButton.classList.add('button'); // Add 'button' to ensure styling consistency
        } else {
          preferencesButton.classList.remove('button'); // Remove 'button' if it exists
          preferencesButton.classList.add('buttonOn'); // Add 'buttonOn' to show active state
        }

        window.ReactNativeWebView.postMessage(JSON.stringify(updateMarker));
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'togglePreferences'
        }));
      }

      function toggleBookmarked() {
        const updateMarker = {
          type: 'debug', 
          message:"in toggleBookmarked()"
        };

        if (bookmarkedButton.classList.contains('buttonOn')) {
          bookmarkedButton.classList.remove('buttonOn'); // Remove 'buttonOn' to show default style
          bookmarkedButton.classList.add('button'); // Add 'button' to ensure styling consistency
        } else {
          bookmarkedButton.classList.remove('button'); // Remove 'button' if it exists
          bookmarkedButton.classList.add('buttonOn'); // Add 'buttonOn' to show active state
        }
        
        window.ReactNativeWebView.postMessage(JSON.stringify(updateMarker));
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'toggleBookmarked'
        }));
      }
      
      function handleMessage(event) {
        var data = JSON.parse(event.data);
        createOrUpdateMarker(data);
        if (data.type === 'restoreMapState') {
          var newCenter = new kakao.maps.LatLng(data.lat, data.lng);
          if (!map.getCenter().equals(newCenter) || map.getLevel() !== data.zoom) {
            map.setCenter(newCenter);
            map.setLevel(data.zoom);
          }
        }
        if (data.type === 'addUserMarker') {
          if (window.userMarker) {
            var newMarkerPosition = new kakao.maps.LatLng(data.lat, data.lng);
            window.userMarker.setPosition(newMarkerPosition);
          } else {
            var imgUrl = 'https://images.emojiterra.com/google/android-12l/512px/1f4cd.png';
            var imgSize = new kakao.maps.Size(90, 90); 
            var img = new kakao.maps.MarkerImage(imgUrl, new kakao.maps.Size(imgSize, imgSize));
            var imgOption = {offset: new kakao.maps.Point(27, 69)}; 
            var markerImage = new kakao.maps.MarkerImage(imgUrl, imgSize, imgOption);
            var markerPosition = new kakao.maps.LatLng(data.lat, data.lng);
            window.userMarker = new kakao.maps.Marker({
                position: markerPosition,
                image: markerImage, 
                map: map
            });
          }
        } else if (data.type === 'removeUserMarker') {
          if (window.userMarker) {
            window.userMarker.setMap(null);
            window.userMarker = null;
          }
        } 
      }

      function adjustMarkerSize() {
        var currentZoom = map.getLevel();
        var size = calculateMarkerSize(currentZoom);
        updateMarkerSize(size);
      }
      
      function calculateMarkerSize(zoomLevel) {
        // Adjust these values based on your preference and testing
        var baseSize = 180; // Base size at a "normal" zoom level
        var size = baseSize - (zoomLevel * 10); // Example calculation, customize as needed
        return Math.max(size, 20); // Minimum size to ensure visibility
      }
      
      function updateMarkerSize(size) {
        window.markers.forEach(marker => {
          if (marker) {
            var imageSize = new kakao.maps.Size(size, size);
            var markerImage = new kakao.maps.MarkerImage(marker.getImage().src, imageSize);
            marker.setImage(markerImage);
          }
        });
      }
      
      function createOrUpdateMarker(data) {
        if (data.type === 'centerMap') {
          var moveTo = new kakao.maps.LatLng(data.lat, data.lng);
          if (data.shouldCenter) {
              map.setCenter(moveTo);
              map.setLevel(2);
          }
  
          if (window.markers) {
            window.markers.forEach(marker => marker.setMap(null));
            window.markers = [];
          }
          if (window.overlays) {
            window.overlays.forEach(overlay => overlay.setMap(null));
            window.overlays = [];
          }
         
          data.facilities.forEach(facility => {
            var position = new kakao.maps.LatLng(facility.lat, facility.lng);
            var markerSize = calculateMarkerSize(map.getLevel());
            var markerImageUrl = 'https://png.pngtree.com/png-clipart/20221022/original/pngtree-orange-pin-map-png-image_8711935.png';
            var markerImage = new kakao.maps.MarkerImage(markerImageUrl, new kakao.maps.Size(markerSize, markerSize));

            var marker = new kakao.maps.Marker({
                position: position,
                map: map,
                image: markerImage
            });
            window.markers.push(marker);
            
            if(facility.avg_score) {
              var content = '<div class="overlay">' + (facility.avg_score ? facility.avg_score.toFixed(1) : 'N/A') + '</div>';
              var overlay = new kakao.maps.CustomOverlay({
                  map: map,
                  position: position,
                  content: content,
                  yAnchor: 0.75,
                  xAnchor: 0.5
              });
              window.overlays.push(overlay);
            }
            kakao.maps.event.addListener(marker, 'click', function () {
              const markerClickMessage = {
                type: 'markerClick',
                facilityId: facility.id,
                facilityName: facility.name
              };
              window.ReactNativeWebView.postMessage(JSON.stringify(markerClickMessage));
            });
          });
        }
      }  
    
      function handleBoundsChange() {
        const bounds = map.getBounds();
        const neLat = bounds.getNorthEast().getLat();
        const neLng = bounds.getNorthEast().getLng();
        const swLat = bounds.getSouthWest().getLat();
        const swLng = bounds.getSouthWest().getLng();
    
        // Post message to React Native with the new bounds
        window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'updateBounds',
            neLat: neLat,
            neLng: neLng,
            swLat: swLat,
            swLng: swLng
        }));
      }

      function zoomIn() {
        var level = map.getLevel();
        map.setLevel(level - 1);
      }

      function zoomOut() {
        var level = map.getLevel();
        map.setLevel(level + 1);
      }

      initMap();
    </script>
  </body>
  </html>
  `;

  const handleSearch = () => {
    fetchAndUpdateFacilities(searchQuery);
  };

  const fetchAndUpdateFacilities = useCallback(
    async (
      searchQuery = '',
      neLat = null,
      neLng = null,
      swLat = null,
      swLng = null
    ) => {
      let facilities = [];

      try {
        if (searchQuery) {
          const result = await fetchFacilityWithName(searchQuery, showOnlyOpen);
          facilities = result || [];
        } else if (neLat && neLng && swLat && swLng) {
          facilities = await fetchFacilitiesInBounds(
            neLat,
            neLng,
            swLat,
            swLng,
            userBookmarkedActive.current,
            showOnlyOpen
          );
        }

        if (
          selectedCuisines.length > 0 ||
          selectedDietaryPreferences.length > 0
        ) {
          facilities = facilities.filter((facility) => {
            const validPreferences = facility.preferences
              ? facility.preferences.filter((pref) => pref)
              : [];
            const facilityCuisines = validPreferences
              .filter((pref) => pref.type === 0)
              .map((pref) => pref.id);
            const facilityDiets = validPreferences
              .filter((pref) => pref.type === 1)
              .map((pref) => pref.id);
            const hasSelectedCuisine = selectedCuisines.some((cuisine) =>
              facilityCuisines.includes(cuisine)
            );
            const hasSelectedDiet = selectedDietaryPreferences.some((diet) =>
              facilityDiets.includes(diet)
            );
            return hasSelectedCuisine || hasSelectedDiet;
          });
        }

        const uniqueFacilities = facilities.reduce((acc, current) => {
          const x = acc.find((item) => item.id === current.id);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);

        if (Array.isArray(uniqueFacilities) && uniqueFacilities.length > 0) {
          setDisplayedFacilities(uniqueFacilities);
        } else {
          setDisplayedFacilities([]);
        }
      } catch (error) {
        console.error('Failed to fetch facilities:', error);
        setDisplayedFacilities([]);
      }
    },
    [showOnlyOpen, selectedCuisines, selectedDietaryPreferences]
  );

  const onWebViewMessage = (event) => {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.type === 'markerVisibilityChanged') {
      isUserMarkerVisible = data.isVisible;
      handleLocate();
    }
    if (data.type === 'updateBounds') {
      setNeLat(data.neLat);
      setNeLng(data.neLng);
      setSwLat(data.swLat);
      setSwLng(data.swLng);
      if (!searchQuery) {
        fetchAndUpdateFacilities(
          '',
          data.neLat,
          data.neLng,
          data.swLat,
          data.swLng
        );
      }
    }
    if (data.type === 'updateCenterAndZoom') {
      setMapCenter((prev) =>
        prev.lat !== data.centerLat || prev.lng !== data.centerLng
          ? { lat: data.centerLat, lng: data.centerLng }
          : prev
      );
      setMapZoom((prev) => (data.zoomLevel !== prev ? data.zoomLevel : prev));
    }
    if (data.type === 'debug') {
      console.log('DEBUG', data.message);
    }
    if (data.type === 'togglePreferences') {
      handleTogglePreferences();
    }
    if (data.type === 'toggleBookmarked') {
      handleToggleBookmarked();
    }
    if (data.type === 'markerClick') {
      navigation.navigate('FacilityDetail', {
        facilityID: data.facilityId,
      });
    }
  };

  const handleShowOnlyOpenToggle = () => {
    const newShowOnlyOpen = !showOnlyOpen;
    setShowOnlyOpen(newShowOnlyOpen);
  };

  useEffect(() => {
    if (
      webViewReady &&
      neLat &&
      neLng &&
      swLat &&
      swLng &&
      searchQuery === ''
    ) {
      fetchAndUpdateFacilities('', neLat, neLng, swLat, swLng);
    }
  }, [
    showOnlyOpen,
    selectedCuisines,
    selectedDietaryPreferences,
    neLat,
    neLng,
    swLat,
    swLng,
    webViewReady,
    searchQuery,
  ]);

  useEffect(() => {
    if (webViewRef.current && webViewReady && isExpanded) {
      webViewRef.current.postMessage(
        JSON.stringify({
          type: 'restoreMapState',
          lat: mapCenter.lat,
          lng: mapCenter.lng,
          zoom: mapZoom,
          facilities: displayedFacilities,
        })
      );
    }
  }, [
    webViewRef,
    webViewReady,
    mapCenter,
    mapZoom,
    isExpanded,
    displayedFacilities,
  ]);

  useEffect(() => {
    if (webViewRef.current) {
      webViewRef.current.postMessage(
        JSON.stringify({
          type: 'centerMap',
          facilities: displayedFacilities,
          shouldCenter: false,
        })
      );
    }
  }, [displayedFacilities]);

  return (
    <View style={styles.container}>
      {webViewReady && (
        <View style={styles.topContainer}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder={translations.enterFacilityName}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity onPress={handleSearch}>
              <Image
                source={{
                  uri: 'https://icones.pro/wp-content/uploads/2021/02/loupe-et-icone-de-recherche-de-couleur-orange.png',
                }}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.allOptionsContainer}>
            <TouchableOpacity
              onPress={() => setFilterExpanded(!filterExpanded)}
              style={styles.filterButton}
              activeOpacity={0.7}
            >
              <Text style={styles.filterButtonText}>{translations.filter}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleShowOnlyOpenToggle()}
              style={styles.toggleButton}
              activeOpacity={0.7}
            >
              <Text style={styles.toggleButtonText}>
                {showOnlyOpen
                  ? translations.allFacilities
                  : translations.openFacilitiesOnly}
              </Text>
            </TouchableOpacity>
          </View>
          {filterExpanded && (
            <ScrollView
              style={
                filterExpanded
                  ? styles.filtersContainer
                  : styles.filtersContainerCollapsed
              }
            >
              <Text style={styles.subHeader}>{translations.cuisineType}</Text>
              <View style={styles.grid}>
                {cuisines.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.option,
                      selectedCuisines.includes(item.id) && styles.selected,
                    ]}
                    onPress={() => handleSelectCuisine(item.id)}
                  >
                    <Image source={item.typeIcon} style={styles.typeIcon} />
                    <Text>{translations.pref[item.name]}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.subHeader}>
                {translations.dietaryPreferences}
              </Text>
              <View style={styles.grid}>
                {dietaryPreferences.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.option,
                      selectedDietaryPreferences.includes(item.id) &&
                        styles.selected,
                    ]}
                    onPress={() => handleSelectDietaryPreference(item.id)}
                  >
                    <Image
                      source={item.typeIcon}
                      style={[
                        styles.typeIcon,
                        (item.id === 'lactose-free' ||
                          item.id === 'gluten-free') &&
                          styles.typeDoubleIconcon,
                      ]}
                    />
                    {/* <Text>{item.name}</Text> */}
                    <Text>{translations.pref[item.name]}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )}
        </View>
      )}
      <View
        style={
          filterExpanded ? styles.mainContainerExpanded : styles.mainContainer
        }
      >
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: mapHtml }}
          style={
            isExpanded || filterExpanded
              ? styles.webViewCollapsed
              : styles.webView
          }
          onMessage={onWebViewMessage}
          onLoad={() => {
            setWebViewReady(true);
          }}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('WebView error:', nativeEvent);
          }}
        />
        <View
          style={isExpanded ? styles.subContainerExpanded : styles.subContainer}
        >
          <TouchableOpacity
            style={styles.expandButton}
            onPress={() => setIsExpanded(!isExpanded)}
          >
            <Image
              source={{
                uri: 'https://icones.pro/wp-content/uploads/2021/06/symbole-fleche-droite-orange.png',
              }}
              style={
                isExpanded ? styles.expandImageRotated : styles.expandImage
              }
            />
          </TouchableOpacity>
          <ScrollView style={styles.ScrollView}>
            {Array.isArray(displayedFacilities) ? (
              displayedFacilities.map((facility) => (
                <FacilityDetails
                  key={facility.id}
                  facility={facility}
                  onPress={() =>
                    navigation.navigate('FacilityDetail', {
                      facilityID: facility.id,
                    })
                  }
                />
              ))
            ) : (
              <Text>translations.loadingFacilities</Text>
            )}
          </ScrollView>
        </View>
      </View>
      <NavigationBar
        homeb={false}
        mapb={true}
        favoritesb={false}
        myPageb={false}
        navigation={navigation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: 40,
  },
  topContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: 40,
  },
  topContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#EA7700',
    borderRadius: 20,
    marginRight: 10,
    marginLeft: 10,
    backgroundColor: 'white',
    height: 40,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  icon: {
    width: 30,
    height: 30,
  },

  allOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderRadius: 20,
    marginRight: 10,
    marginLeft: 10,
    backgroundColor: 'white',
    height: 40,
  },
  filtersContainer: {
    flex: 1,
    marginLeft: 5,
    backgroundColor: 'white',
  },
  filtersContainerCollapsed: {
    flex: 1,
    opacity: 0.0,
  },
  filterButton: {
    backgroundColor: '#EA7700',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 7,
    height: 30,
    width: 70,
    elevation: 5,
  },
  filterButtonText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  toggleButton: {
    backgroundColor: '#EA7700',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 7,
    height: 30,
    width: 120,
    elevation: 5,
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 40,
  },
  option: {
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    width: '30%',
    borderRadius: 10,
  },
  selected: {
    borderColor: 'orange',
  },
  typeIcon: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  typeDoubleIcon: {
    width: 50,
    height: 30,
    marginBottom: 5,
  },

  mainContainer: {
    flex: 8,
    backgroundColor: 'white',
  },
  mainContainerCollapsed: {
    flex: 1,
    opacity: 0.0,
    backgroundColor: 'white',
  },

  webView: {
    flex: 1,
    backgroundColor: 'white',
  },
  webViewCollapsed: {
    flex: 1,
    opacity: 0.0,
  },

  subContainer: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  subContainerExpanded: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
  },

  ScrollView: {
    paddingHorizontal: 10,
    flex: 1,
    paddingTop: 17,
  },
  subContainerText: {
    fontSize: 16,
    color: '#333',
  },
  expandButton: {
    position: 'absolute',
    top: 4,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandImage: {
    width: 35,
    height: 27,
    transform: [{ rotate: '-90deg' }],
  },
  expandImageRotated: {
    width: 27,
    height: 27,
    transform: [{ rotate: '90deg' }],
  },
});

export default MapView;
