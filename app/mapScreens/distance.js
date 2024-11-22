import { useEffect, useState } from "react"
import { View, Text, Button, TouchableOpacity ,ToastAndroid,Alert} from "react-native"
import tw from "twrnc"

import { useSelector } from "react-redux"
import { getDistance, getPreciseDistance } from "geolib";
import { FontAwesome5 } from '@expo/vector-icons';

import Mapscreen from "."
import { ActivityIndicator } from "react-native-web";







export default function ({ distance }) {
    const showToast = (text) => {
        ToastAndroid.show(text, ToastAndroid.SHORT);
      };

    const [rideType, setRideType] = useState("")
    let [mode, setMode] = useState('')
    let [isWaiting, setIsWaiting] = useState(false)
    // const[modeSelected,setModeSelected]=useState(true)




    useEffect(() => {
        showDistance()
    }, [])



    function showDistance() {
        if (distance < 5) {
            setRideType("basic")

        } else if (distance < 10) {
            setRideType("mid")

        } else {
            setRideType("high")


        }
    }


    const faircharges = {
        motorcycle: {
            basic: 100, // 1 to 5 KM
            mid: 200, // 1 to 10 KM
            high: 400 // > 10 KM 

        },
        car: {
            basic: 300, // 1 to 5 KM
            mid: 600, // 1 to 10 KM
            high: 1000 // > 10 KM 

        },
        rickshaw: {
            basic: 200, // 1 to 5 KM
            mid: 400, // 1 to 10 KM
            high: 800 // > 10 KM 

        }
    }




    return (


        <View style={[tw`bg-white`, { flex: 0.5 }]}>

            <View style={[{ paddingHorizontal: 10, alignItems: "flex-start" }, tw`bg-white mx-1 mb-1`]}>


                <View
                    style={[{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", justifyContent: "space-between", }, tw`px-1 rounded+25 w-90 mt-9 mb-2 `]}>

                    <View>
                        <Text style={tw`text-center text-xl font-bold`}>Vehicle</Text>
                    </View>
                    <View>
                        <Text style={tw`text-center text-xl font-bold`}>Distance</Text>
                    </View>
                    <View>
                        <Text style={tw`text-center text-xl font-bold`}>Price</Text>
                    </View>
                </View>









                <TouchableOpacity
                    onPress={() => setMode("car")}
                    style={[{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", justifyContent: "space-between", }, tw`${mode === "car" && 'bg-blue-300'} px-1 rounded+4 w-90 mt-6 p-1 px-2`]}>
                    <FontAwesome5 style={tw`p-1`} name="car-side" size={30} color="black" />
                    <View>
                        <Text style={tw`text-center text-lg p-1`}>{distance}/KM</Text>
                    </View>
                    <View>
                        <Text style={tw`text-center text-lg p-1`}>{faircharges["car"][rideType]}</Text>
                    </View>
                </TouchableOpacity>


                <TouchableOpacity
                    onPress={() => setMode("motorcycle")}
                    style={[{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", justifyContent: "space-between", }, tw`${mode === "motorcycle" && 'bg-blue-300'} px-1 rounded+4 w-90 mt-5 p-1 px-2`]}>
                    <FontAwesome5 style={tw`p-1`} name="motorcycle" size={30} color="black" />
                    <View>
                        <Text style={tw`text-center text-lg p-1 `}>{distance}/KM</Text>
                    </View>
                    <View>
                        <Text style={tw`text-center text-lg p-1`}>{faircharges["motorcycle"][rideType]}</Text>
                    </View>
                </TouchableOpacity>


                <TouchableOpacity
                    onPress={() => { setMode("rickshaw") }}
                    style={[{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", justifyContent: "space-between", }, tw`${mode === "rickshaw" && 'bg-blue-300'}  rounded+4 w-90 mt-5  mb-3 p-1 px-2`]}>
                    <FontAwesome5 style={tw`p-1`} name="caravan" size={30} color="black" />
                    <View>
                        <Text style={tw`text-center text-lg p-1`}>{distance}/KM</Text>
                    </View>
                    <View>
                        <Text style={tw`text-center text-lg p-1`}>{faircharges["rickshaw"][rideType]}</Text>
                    </View>
                </TouchableOpacity>


            </View>


            <Button title={isWaiting ? "Waiting For Rider's Response " : "Book Ride Now"}
                disabled={mode ? false : true}
                onPress={() => {
                    Alert.alert("Uber","Please Wait For Rider's Response")
                    setIsWaiting(true)
                }} />





        </View>





    )
}