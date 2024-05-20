import React, { useEffect, useState, useRef, useCallback } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, ScrollView, TextInput, Button, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Color, GlobalStyles } from '../GlobalStyles';

import SquareFacility from '../components/SqureFacility';
import LongFacility from '../components/LongFacility';
import NavigationBar from '../components/NavigationBar';
import { WebView } from 'react-native-webview';
import { fetchFacilityWithName, mockFetchFacilityWithName, fetchFacilitiesInBounds, mockFetchFacilitiesInBounds } from './api';
import { FacilityDetails } from './MapViewFunctions';
import { isOpenNow } from './MapViewFunctions';

const MapView = () => {
  const navigation = useNavigation();

  const isTesting = true;
  const [searchQuery, setSearchQuery] = useState('');
  const webViewRef = useRef(null);
  const [webViewReady, setWebViewReady] = useState(false);
  const [displayedFacilities, setDisplayedFacilities] = useState([]);
  const [showOnlyOpen, setShowOnlyOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 36.3715, lng: 127.3625 }); // Default center
  const [mapZoom, setMapZoom] = useState(3); // Default zoom level

  // State variables for map bounds
  const [neLat, setNeLat] = useState(null);
  const [neLng, setNeLng] = useState(null);
  const [swLat, setSwLat] = useState(null);
  const [swLng, setSwLng] = useState(null);

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
        right: 35px; /* Right spacing */
        top: 50%; /* Vertically middle */
        transform: translateY(80%);
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
    </div>
    <div id="map"></div>
    <script>
      var map;
      var container = document.getElementById('map');
      var options = {
        center: new kakao.maps.LatLng(36.3715, 127.3625,),
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

        window.markers = [];
        window.overlays = [];
        window.addEventListener('message', receiveMessage);
      }
      
      function handleMessage(event) {
        var data = JSON.parse(event.data);
        if (data.type === 'restoreMapState') {
          var newCenter = new kakao.maps.LatLng(data.lat, data.lng);
          if (!map.getCenter().equals(newCenter) || map.getLevel() !== data.zoom) {
            map.setCenter(newCenter);
            map.setLevel(data.zoom);
          }
        }
      }

      window.addEventListener('message', handleMessage);

      function receiveMessage(event) {
        var data = JSON.parse(event.data);
        createOrUpdateMarker(data);
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

          // Iterate over facilities data if it's an array
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

            var content = '<div class="overlay">' + facility.avg_score.toFixed(1) + '</div>';
            var overlay = new kakao.maps.CustomOverlay({
                map: map,
                position: position,
                content: content,
                yAnchor: 0.75,
                xAnchor: 0.5
            });
            window.overlays.push(overlay);
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

  const handleSearch = async () => {
    //console.log("handleSearch called", { searchQuery, webViewReady });
    if (searchQuery.trim() && webViewReady) {
      //console.log("Passed conditions for fetching");
      try {
        let facilities = [];
        if (isTesting) {
          //console.log("Testing");
          facilities = await mockFetchFacilityWithName(searchQuery); // Use mock function
        } else {
          facilities = await fetchFacilityWithName(searchQuery); // Use real API functionconst facilities
        }
        //console.log("Facilities fetched:", facilities);
        // Sending facilities data to WebView
        if (webViewRef.current && facilities.length > 0) {
          const { lat, lng, avg_score } = facilities[0]; // Assuming you want to center on the first returned facility
          //console.log("Facility data:", { lat, lng, avg_score });
          webViewRef.current.postMessage(JSON.stringify({
            type: 'centerMap',
            lat: lat,
            lng: lng,
            avg_score: avg_score,
            shouldCenter: true
          }));
        } else {
          console.error("WebView is not mounted yet or the ref is not attached.");
        }
      } catch (error) {
        console.error('Failed to load facilities:', error);
      }
    } else if (!webViewReady) {
      console.error("WebView is not ready yet.");
    }
  };

  const fetchAndUpdateFacilities =
    useCallback(async (neLat, neLng, swLat, swLng) => {
      try {
        console.log("In fetchAndUpdateFacilities");
        let facilities = [];
        if (isTesting) {
          console.log("Testing");
          facilities = await mockFetchFacilitiesInBounds(neLat, neLng, swLat, swLng); // Use mock function
        } else {
          facilities = await fetchFacilitiesInBounds(neLat, neLng, swLat, swLng); // Use real API function
        }
        console.log("Facilities in view fetched:", facilities);

        if (showOnlyOpen) {
          facilities = facilities.filter(facility => {
            const { status } = isOpenNow(facility.opening_hours);
            return status === "Open";
          })
        }

        // Process the facilities to update markers on the map
        if (webViewRef.current && facilities.length > 0) {
          const { lat, lng, avg_score } = facilities[0]; // Assuming you want to center on the first returned facility
          //console.log("Facility data:", { lat, lng, avg_score });
          webViewRef.current.postMessage(JSON.stringify({
            type: 'centerMap',
            facilities: facilities,
            shouldCenter: false
          }));
        }
        setDisplayedFacilities(facilities);
      } catch (error) {
        console.error('Failed to load facilities in view:', error);
      }
    }, [isTesting, showOnlyOpen]);


  // Function to receive messages from the WebView
  const onWebViewMessage = (event) => {
    const data = JSON.parse(event.nativeEvent.data);
    console.log('onWebViewMessage called. Provided data:', data);
    if (data.type === 'updateBounds') {
      console.log('neLat', data.neLat);
      setNeLat(data.neLat);
      setNeLng(data.neLng);
      setSwLat(data.swLat);
      setSwLng(data.swLng);
      fetchAndUpdateFacilities(data.neLat, data.neLng, data.swLat, data.swLng);
    }
    if (data.type === 'updateCenterAndZoom') {
      setMapCenter((prev) => (prev.lat !== data.centerLat || prev.lng !== data.centerLng) ? { lat: data.centerLat, lng: data.centerLng } : prev);
      setMapZoom((prev) => data.zoomLevel !== prev ? data.zoomLevel : prev);
    }
  };

  const handleShowOnlyOpenToggle = () => {
    setShowOnlyOpen(!showOnlyOpen);

    // Immediately update the displayed facilities based on the new state
    if (!showOnlyOpen) {
      // Filter the currently displayed facilities to show only open ones
      const openFacilities = displayedFacilities.filter(facility => {
        const { status } = isOpenNow(facility.opening_hours);
        return status === "Open";
      });
      setDisplayedFacilities(openFacilities);
    } else {
      // If showing all facilities, fetch or restore the original list
      fetchAndUpdateFacilities(neLat, neLng, swLat, swLng);
    }
  };

  /* const renderOpeningHours = (hours) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return hours.map(hour => (
        <Text key={hour.day}>
            {days[hour.day]}: {hour.open_time} - {hour.close_time}
        </Text>
    ));
  }; */

  useEffect(() => {
    if (webViewReady && neLat && neLng && swLat && swLng) {
      fetchAndUpdateFacilities(neLat, neLng, swLat, swLng);
    }
  }, [showOnlyOpen, neLat, neLng, swLat, swLng, webViewReady]);

  useEffect(() => {
    if (webViewRef.current && webViewReady && isExpanded) {
      console.log("Restoring map state", { lat: mapCenter.lat, lng: mapCenter.lng, zoom: mapZoom });
      webViewRef.current.postMessage(JSON.stringify({
        type: 'restoreMapState',
        lat: mapCenter.lat,
        lng: mapCenter.lng,
        zoom: mapZoom
      }));
    }
  }, [webViewRef, webViewReady, mapCenter, mapZoom, isExpanded]);

  return (
    <View style={styles.container}>
      {webViewReady && (
        <View>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Enter facility name"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity onPress={handleSearch}>
              <Image
                source={{ uri: 'https://icones.pro/wp-content/uploads/2021/02/loupe-et-icone-de-recherche-de-couleur-orange.png' }}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => setShowOnlyOpen(!showOnlyOpen)}
            style={styles.toggleButton}
            activeOpacity={0.7}>
            <Text style={styles.toggleButtonText}>
              {showOnlyOpen ? "All Facilities" : "Open Facilities Only"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={isExpanded ? styles.mainContainerCollapsed : styles.mainContainer}>
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: mapHtml }}
          style={isExpanded ? styles.webViewCollapsed : styles.webView}
          onMessage={onWebViewMessage}
          onLoad={() => {
            console.log("WebView loaded");
            setWebViewReady(true);
          }}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('WebView error:', nativeEvent);
          }}
        />
        <View style={isExpanded ? styles.subContainerExpanded : styles.subContainer}>
          <TouchableOpacity style={styles.expandButton} onPress={() => setIsExpanded(!isExpanded)}>
            <Image
              source={{ uri: 'https://icones.pro/wp-content/uploads/2021/06/symbole-fleche-droite-orange.png' }}
              style={isExpanded ? styles.expandImageRotated : styles.expandImage}
            />
          </TouchableOpacity>
          <ScrollView style={styles.ScrollView}>
            {displayedFacilities.map(facility => (
              <FacilityDetails key={facility.id} facility={facility} />
            ))}
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

  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  mainContainerCollapsed: {
    flex: 1,
    backgroundColor: 'white',
  },

  webView: {
    flex: 1,
    backgroundColor: 'white',
  },
  webViewCollapsed: {
    /* flex: 0, 
    height: 0, 
    width: 0, 
    overflow: 'hidden', 
    opacity: 0, */
    flex: 1,
    opacity: 0.0, // Make invisible but still rendered
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
  toggleButton: {
    backgroundColor: '#EA7700',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 7,
    height: 30,
    width: 120,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginLeft: 257,
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default MapView;

