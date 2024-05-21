import React, { useEffect, useState, useRef }  from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, ScrollView, TextInput, Button, TouchableOpacity  } from 'react-native';
import { Color, GlobalStyles } from '../GlobalStyles';

export const isOpenNow = (openingHours) => {
    if (!openingHours) {
        // If openingHours is undefined or not provided, assume closed or handle accordingly
        return { status: "Unknown", color: 'grey' };
    } 

    const now = new Date();
    const dayOfWeek = now.getDay(); // Sunday - Saturday : 0 - 6
    const currentTime = now.toTimeString().substr(0, 5); // "HH:MM" format

    const todayHours = openingHours.find(hour => hour.day === dayOfWeek);
    if (!todayHours) {
        return { status: "Closed", color: 'red' };
    }

    const { open_time, close_time } = todayHours;
    const normalizeTime = (time) => time.length === 5 ? time : `${time}:00`;

    if (currentTime >= normalizeTime(open_time) && currentTime <= normalizeTime(close_time)) {
        return { status: "Open", color: 'green' };
    }

    return { status: "Closed", color: 'red' };
};

export const FacilityDetails = ({ facility }) => {
    // const { status, color } = isOpenNow(facility.opening_hours);
    const scoreDisplay = facility.avg_score !== null ? facility.avg_score.toFixed(1) : "N/A";

    return (
      <View style={styles.facilityContainer}>
        {/* <Image 
          source={{ uri: facility.profile_img_uri }} 
          style={styles.facilityImage}
          resizeMode="cover"
        /> */}
        <View style={styles.titleContainer}>
            <View style={styles.nameStatusContainer}>
                <Text style={styles.facilityName}>{facility.name}</Text>
                {/* <Text style={[styles.openClosedText, { color: color }]}>{status}</Text> */}
            </View>
          <Text style={styles.facilityScore}>{scoreDisplay}</Text>
        </View>
        <Text style={styles.facilityLocation}>{facility.location}</Text>
        <Text style={styles.facilityDescription}>{facility.description}</Text>
        {/* <View>{renderOpeningHours(facility.opening_hours)}</View> */}
      </View>
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
  
