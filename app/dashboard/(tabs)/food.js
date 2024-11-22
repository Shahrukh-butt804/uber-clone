import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";
// import { getDistance, getPreciseDistance } from "geolib";

const Pickup = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [places, setPlaces] = useState([]);
  const [pickup, setPickup] = useState(null);
  const [inputText, setInputText] = useState("");
  const [distance, setdistance] = useState("");
  const mapRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 1,
          timeInterval: 1000,
        },
        (newLocation) => {
          setLocation(newLocation);
        }
      );
    }

    fetchData();
  }, []);

  const handleChange = (text) => {
    setTimeout(() => searchPlaces(text), 800);
  };

  // const calculateDistance = (itemLat, itemLog) => {
  //   var dis = getDistance(
  //     {
  //       latitude: location.coords.latitude,
  //       longitude: location.coords.longitude,
  //     },
  //     { latitude: itemLat, longitude: itemLog }
  //   );
  //   // alert(`Distance\n\n${dis} Meter\nOR\n${dis / 1000} KM`);
  //   setdistance(dis);
  //   console.log(dis, "distance");
  // };

  const searchPlaces = async (text) => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: "fsq3mvUGiD+3ms10/xcy7LGd3r50NvPEQbZPvCemQC5TMV8=",
      },
    };
    fetch(`https://api.foursquare.com/v3/places/search?query=${text}`, options)
      .then((response) => response.json())
      .then((response) => {
        console.log("response", response);
        setPlaces(response.results);
      })
      .catch((err) => console.error(err, "eeror"));
  };

  if (errorMsg) {
    return <Text>{errorMsg}</Text>;
  }
  if (!location) {
    return (
      <ActivityIndicator
        size={"large"}
        color={"#0000ff"}
        style={styles.lodding}
      />
    );
  }

  console.log(places, "places");
  console.log(pickup, "pickup");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.placesContainer}>
        <TextInput
          style={styles.input}
          placeholder="Where to?"
          value={inputText}
          onChangeText={(text) => {
            handleChange(text);
            setInputText(text);
          }}
        />
        {places.length > 0 && (
          <FlatList
            style={styles.placesList}
            data={places}
            renderItem={({ item }) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  setPickup(item);
                  calculateDistance(
                    item.geocodes.main.latitude,
                    item.geocodes.main.longitude
                  );
                  setPlaces([]);
                  mapRef.current.animateToRegion(
                    {
                      latitude: item.geocodes.main.latitude,
                      longitude: item.geocodes.main.longitude,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    },
                    1000
                  );
                }}
              >
                <Text style={styles.placeText}>{item.name}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
          />
        )}
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          title={"Your Location"}
        />
        {pickup && (
          <Marker
            coordinate={{
              latitude: pickup.geocodes.main.latitude,
              longitude: pickup.geocodes.main.longitude,
            }}
            title={pickup.name}
          />
        )}
      </MapView>
      {pickup && (
        <>
          <View style={styles.cancleBtn}>
            <TouchableOpacity
              onPress={() => {
                setPickup(null);
                setPlaces([]);
                setInputText("");
              }}
            >
              <MaterialIcons name="cancel" size={38} />
            </TouchableOpacity>
          </View>
          {/* <View style={styles.distance}>
            <Text>Distance: {distance / 1000}KM</Text>
            <Text>Total Price: 100 Rs</Text>
          </View> */}
        </>
      )}
    </SafeAreaView>
  );
};

export default Pickup;

// Styles remain unchanged

const styles = StyleSheet.create({
  lodding: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  paragraph: {
    fontSize: 18,
    textAlign: "center",
  },
  descriptionContainer: {
    display: "flex",
    gap: 16,
    marginTop: 20,
    padding: 15,
  },
  input: {
    backgroundColor: "#F6F6F6",
    width: 328,
    padding: 10,
    borderRadius: 3,
    zIndex: 888,
    top: 18,
    marginRight: 9,
    marginLeft: 9,
    left: 0,
  },
  placesContainer: {
    position: "absolute",
  },
  placesList: {
    zIndex: 99999,
    backgroundColor: "lightgray",
    width: 328,
    padding: 10,
    borderRadius: 3,
    zIndex: 888,
    top: 30,
    marginRight: 9,
    marginLeft: 9,
    left: 0,
    maxHeight: 120,
    overflow: "scroll",
  },
  placeText: {
    backgroundColor: "white",
    borderRadius: 20,
    marginBottom: 10,
    padding: 6,
    shadowColor: "#000000",
    shadowOpacity: 3,
    shadowRadius: 20,
    elevation: 8,
  },
  cancleBtn: {
    position: "absolute",
    right: 20,
    bottom: 20, // Adjust as needed based on your layout
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { height: 2, width: 0 },
  },
  distance: {
    position: "absolute",
    left: 20,
    bottom: 20,
    backgroundColor: "white",

    padding: 10,
    borderRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { height: 2, width: 0 },
  },
});
