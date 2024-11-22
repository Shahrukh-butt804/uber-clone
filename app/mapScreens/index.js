import React, { useState, useEffect, useRef } from 'react';

import {
    StyleSheet, View, Text, Modal,
    TextInput, TouchableOpacity, KeyboardAvoidingView,
    FlatList, ActivityIndicator, Platform, ScrollView, ToastAndroid
} from 'react-native';

import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from "expo-location"
import tw from 'twrnc';
import { FontAwesome5 } from '@expo/vector-icons';
import { getDistance, getPreciseDistance } from "geolib";
import { decode } from '@mapbox/polyline';
import axios from 'axios';


import Distance from './distance';


// REDUX TOOLKIT
import { setOrigin, setDestination, setMapRef, setDistance } from '../redux/slices/navSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectOrigin, selectDestination } from '../redux/slices/navSlice';
import { set } from 'firebase/database';





//API KEY  FourSquare API
//  fsq3uQWznJMLf9AYjWf/mM62Nhf+V6H6UTMSgk17+HGREcg=
// fsq3kdXlJL2XUchnSztDpkZr/nYU3HCrv0tuThURCcrwcsM=

// uberDirection="7c9a068a-fef1-4db7-97b7-ad010a5d10fb"  ==> this is graphhoppher Api KEy


// `https://api.foursquare.com/v3/places/search?query=${places}$ll=${location.latitude},${location.longitude}$radius=3000`


// car url="https://w7.pngwing.com/pngs/5/851/png-transparent-marker-map-icon-car-location-automobile-vehicle-target-design-thumbnail.png"





export default function App() {

    function showToast(text) {
        ToastAndroid.show(text, ToastAndroid.SHORT);
    }

    // work for origin or pickup point
    const [location, setLocation] = useState(null);
    const [locationName, setLocationName] = useState(undefined);
    const [placesForPickup, setplacesForPickup] = useState([]);
    const [loader, setLoader] = useState(true)

    const [showPickupModal, setShowPickupModal] = useState(false)
    const [showDestinationModal, setShowDestinationModal] = useState(false)


    // work for distination 
    const [places, setPlaces] = useState([]);
    const [pickup, setPickup] = useState(null);
    const [inputText, setInputText] = useState("");
    const [route, setRoute] = useState("");
    const mapRef = useRef(null);


    const [distance, setdistance] = useState("");
    // var dispatch = useDispatch();



    // Decoding the Direction Coordinates

    const decodePolyline = (encoded) => {
        const poly = [];
        let index = 0;
        let len = encoded.length;
        let lat = 0;
        let lng = 0;

        while (index < len) {
            let b;
            let shift = 0;
            let result = 0;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            const dlat = (result & 1) != 0 ? ~(result >> 1) : result >> 1;
            lat += dlat;

            shift = 0;
            result = 0;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            const dlng = (result & 1) != 0 ? ~(result >> 1) : result >> 1;
            lng += dlng;

            const latlng = { latitude: lat / 1e5, longitude: lng / 1e5 };
            poly.push(latlng);
        }
        // console.log(poly,"this is poly")
        return poly;

    };



    // Getting the Direction Coordinates

    const getDirections = async (origin, destination) => {
        // dispatch(setDestination({
        //     latitude: destination.latitude,
        //     longitude: destination.longitude
        // }))
        try {
            const apiKey = '7c9a068a-fef1-4db7-97b7-ad010a5d10fb';
            const response = await axios.get(
                `https://graphhopper.com/api/1/route?point=${origin.latitude},${origin.longitude}&point=${destination.latitude},${destination.longitude}&vehicle=car&key=${apiKey}`
            );
            setRoute(response.data.paths[0].points);
            //   console.log(response.data.paths[0].points)
            //   decodePolyline(response.data.paths[0].points)
        } catch (error) {
            showToast('Error fetching directions:', error);
        }
    }


    // Getting the Pickup point from mobile location initially

    useEffect(() => {
        fetchLocationPermission()
    }, []);

    // fetchLocationPermission()

    let fetchLocationPermission = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            setLocation(null)
            return;
        }
        let watchId = Location.watchPositionAsync({
            accuracy: Location.Accuracy.High,
            distanceInterval: 100,
            timeInterval: 100000
        }, (location) => {
            // console.log("this is my location of now", location)
            fetchLocationName(location.coords.latitude, location.coords.longitude)
            setLocation(location.coords)
            // dispatch(setOrigin({
            //     latitude: location.coords.latitude,
            //     longitude: location.coords.longitude,
            // }))
            setLoader(false)

        })
    };






    // Fetching the location name from latitude and longitude which is comes from useEffect
    let fetchLocationName = async (latitude, longitude) => {

        const apiKey = '7c9a068a-fef1-4db7-97b7-ad010a5d10fb';

        try {
            const response = await fetch(
                `https://graphhopper.com/api/1/geocode?reverse=true&point=${latitude},${longitude}&key=${apiKey}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch location');
            }

            const data = await response.json();
            if (data.hits && data.hits.length > 0) {
                console.log(data.hits[0].name)
                setLocationName(data.hits[0].name);

            } else {
                setLocationName(undefined);
            }
        } catch (error) {
            showToast('Error fetching location:', error);
            setLocationName('Error fetching location Name');
        }

    }





    // waiting to take a text from user and calling a function after sometime

    const handleInputChange = (value, isOrigin = false) => {
        setTimeout(() => {
            fetchSuggestions(value, isOrigin);
        }, 800)
    };



    // Fetching suggestion according to the userinput from FourSquare API

    let fetchSuggestions = (text, isOrigin = false) => {
        const options = {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization: "fsq3kdXlJL2XUchnSztDpkZr/nYU3HCrv0tuThURCcrwcsM=",
            },
        };

        fetch(`https://api.foursquare.com/v3/places/search?query=${text}&ll=${location.latitude}%2C${location.longitude}&limit=15`, options)
            .then((response) => response.json())
            .then((response) => {
                // console.log("response from Api", response.results.id);
                if (isOrigin) {
                    setplacesForPickup(response.results);

                } else {
                    setPlaces(response.results);
                    // console.log("this is", places)
                }
                // console.log("this is",places[0].categories[0].id)
            })
            .catch((err) => showToast(err, "error"));
    }



    // calculating Distance by passing pickup and Distination Coordinates To GeoLib

    const calculateDistance = (itemLat, itemLog) => {
        var dis = getDistance(
            {
                latitude: location.latitude,
                longitude: location.longitude,
            },
            { latitude: itemLat, longitude: itemLog }
        );
        setdistance((dis / 1000));
    };


    if (!location && location == null) {
        return (
            <ActivityIndicator
                style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
                size={"large"}
                color={"#0000ff"}
            />
        );
    }


    return (

        <>
            <>
                <View style={{ flex: 0.5 }}>

                    <MapView style={styles.map}
                        ref={mapRef}
                        initialRegion={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                    >

                        {location && (
                            <Marker coordinate={location}
                                title={"PickUp"}
                                description={locationName ? `${locationName}` : ""}
                            >
                                <View>
                                    <FontAwesome5 name="map-marker-alt" size={40} color="black" />
                                </View>

                            </Marker>
                        )}




                        {pickup && (
                            <>
                                <Marker
                                    coordinate={{
                                        latitude: pickup?.geocodes?.main?.latitude,
                                        longitude: pickup?.geocodes?.main?.longitude,
                                    }}
                                    title="Destination"
                                    description={pickup.name}
                                />

                                {distance && (
                                    <>
                                        <Marker
                                            coordinate={{
                                                latitude: 24.9172,
                                                longitude: 67.0924,
                                            }}
                                            title="Car"
                                            description="Gulshan-E-Iqbal">
                                            <View>
                                                <FontAwesome5 name="car-side" size={24} color="black" />
                                            </View>
                                        </Marker>


                                        <Marker
                                            coordinate={{
                                                latitude: 24.8825,
                                                longitude: 67.0694,
                                            }}
                                            title="Motor-Bike"
                                            description="Bahadurabad">
                                            <View>
                                                <FontAwesome5 name="motorcycle" size={24} color="black" />
                                            </View>
                                        </Marker>

                                        <Marker
                                            coordinate={{
                                                latitude: 24.8746,
                                                longitude: 67.0395,
                                            }}
                                            title="Rickshaw"
                                            description="Mazar-E-Quaid">
                                            <View>
                                                <FontAwesome5 name="caravan" size={24} color="black" />
                                            </View>
                                        </Marker>



                                        <Marker
                                            coordinate={{
                                                latitude: 24.8730,
                                                longitude: 67.0609,
                                            }}
                                            title="Car"
                                            description="Tariq Road">
                                            <View>
                                                <FontAwesome5 name="car-side" size={24} color="black" />
                                            </View>
                                        </Marker>


                                        <Marker
                                            coordinate={{
                                                latitude: 24.8904,
                                                longitude: 67.0911,
                                            }}
                                            title="Motor-Bike"
                                            description="Bahadurabad">
                                            <View>
                                                <FontAwesome5 name="motorcycle" size={24} color="black" />
                                            </View>
                                        </Marker>








                                    </>
                                )

                                }














                                {route && (
                                    <Polyline
                                        coordinates={decodePolyline(route)}
                                        strokeColor="#000" // black
                                        strokeWidth={3}
                                    />
                                )
                                }


                            </>
                        )}

                    </MapView>
                </View>


                {!distance ?
                    <>
                        <View style={[tw`p-2 gap-3 bg-white`, { flex: 0.5 }]}>
                            <ScrollView>
                                <Text style={tw`m-2 text-lg font-bold`}>From</Text>
                                <TextInput
                                    onPress={() => setShowPickupModal(true)}
                                    placeholder={locationName ? `${locationName}` : 'Pickup'}
                                    style={tw`bg-gray-200 p-1 mb-1 px-2 rounded-lg text-4`}
                                    onChangeText={(text) => {
                                        handleInputChange(text, true)
                                        setLocationName(text)
                                    }}
                                    value={locationName}
                                />

                                <Modal
                                    animationType="slide"  // or 'fade'
                                    // transparent={true}
                                    visible={showPickupModal}
                                    onRequestClose={() =>
                                        setShowPickupModal(false)}
                                >

                                    <TextInput
                                        onPress={() => setShowPickupModal(true)}
                                        placeholder={locationName ? `${locationName}` : 'Pickup'}
                                        style={tw`bg-gray-200 p-2 mb-1 px-5 rounded-lg text-2xl mt-5`}
                                        onChangeText={(text) => {
                                            handleInputChange(text, true)
                                            setLocationName(text)
                                        }}
                                        value={locationName}
                                    />


                                    {placesForPickup.length > 0 && (

                                        <FlatList
                                            style={tw`max-h-120 `}
                                            data={placesForPickup}
                                            keyExtractor={(item) => item?.categories?.id}
                                            renderItem={({ item }) => (
                                                <View key={item?.categories?.id} style={[tw`bg-gray-100 px-1 text-2xl`]}>
                                                    <TouchableOpacity
                                                        key={item?.categories?.id}
                                                        onPress={() => {
                                                            setLocationName(item.name);
                                                            setLocation(item.geocodes.main);
                                                            setplacesForPickup([])
                                                            setShowPickupModal(false)
                                                        }}
                                                    >
                                                        <Text style={tw`text-2xl mt-3 px-3`}>{item.name}</Text>
                                                    </TouchableOpacity>
                                                </View>

                                            )}
                                        />

                                    )}
                                </Modal>












                                <Text style={tw`m-2 text-lg font-bold`}>To</Text>
                                <TextInput
                                    onPress={() => {
                                        setShowDestinationModal(true)
                                    }}
                                    placeholder='Destination'
                                    style={tw`bg-gray-200 p-1 px-2 mb-1 rounded-lg text-4`}
                                    onChangeText={(text) => {
                                        handleInputChange(text)
                                        setInputText(text);
                                    }
                                    }
                                    value={inputText}
                                />

                                <Modal
                                    animationType="slide"  // or 'fade'
                                    // transparent={true}
                                    visible={showPickupModal}
                                    onRequestClose={() =>
                                        setShowPickupModal(false)}
                                >




                                    {places.length > 0 && (
                                        <FlatList
                                            style={tw`max-h-30 gap-1`}
                                            data={places}
                                            keyExtractor={(item) => item?.categories?.id}
                                            renderItem={({ item }) => (
                                                <View key={item?.categories?.id} style={[tw`bg-gray-100 px-1`]}>

                                                    <TouchableOpacity
                                                        key={item?.categories?.id}

                                                        onPress={() => {
                                                            setInputText(item.name);
                                                            setPickup(item);
                                                            calculateDistance(
                                                                item?.geocodes?.main?.latitude,
                                                                item?.geocodes?.main?.longitude
                                                            );
                                                            setPlaces([]);
                                                            mapRef.current.animateToRegion(
                                                                {
                                                                    latitude: item?.geocodes?.main?.latitude,
                                                                    longitude: item?.geocodes?.main?.longitude,
                                                                    latitudeDelta: 0.0922,
                                                                    longitudeDelta: 0.0421,
                                                                },
                                                                1000
                                                            );

                                                            getDirections(location, {
                                                                latitude: item?.geocodes?.main?.latitude,
                                                                longitude: item?.geocodes?.main?.longitude
                                                            })
                                                            // router.replace("/screens/distance")
                                                        }}
                                                    >
                                                        <Text style={tw`text-2xl mt-3 px-3`}>{item.name}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            )}
                                        />
                                    )}
                                </Modal>


                            </ScrollView>
                        </View>
                    </>


                    :


                    <>
                        <View style={[{ justifyContent: "space-evenly", alignItems: "center", flexDirection: "row", padding: 5, marginTop: 2, marginBottom: 0 }, tw`bg-gray-100`]}>
                            <TouchableOpacity
                                onPress={() => {
                                    setdistance(null)
                                    setLocationName(null)
                                    setInputText(null)
                                    setPickup(null)
                                }}
                                style={[tw`absolute top-3 left-6 `, { justifyContent: "center" }]}>
                                <FontAwesome5 name="chevron-left" size={24} color="black" />
                            </TouchableOpacity>
                            <Text style={[tw`text-xl p-1`, {}]}>select Your Ride</Text>
                        </View>
                        <Distance distance={distance} />
                    </>

                }




            </>



        </>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 0.5,
    },
    map: {
        width: '100%',
        height: '100%',
    },
});





