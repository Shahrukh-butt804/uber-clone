import { createSlice } from "@reduxjs/toolkit";
import { router } from "expo-router";
import distance from "../../mapScreens/distance";


const initialState = {
    origin: "rogins values",
    destination: "reiasdjjlaksdl",
    mapRef: null,
    routeHash:null,
    distance:null,
    // travelTimeInformation: null,

}












export const navSlice = createSlice({
    name: "nav",
    initialState,
    reducers: {
        setOrigin: (state, action) => {
             state.origin = action.payload;
            // console.log(state.origin,"origin Updated")
        },
        setDestination: (state, action) => {
            state.destination = action.payload;
            // console.log(state.destination,"destination Updated")
        },
        setMapRef: (state, action) => {
            state.mapRef = action.payload;
            // console.log(state.mapRef, "mapRef Updated")
        },
        setRouteHash:  (state, action) => {
            state.routeHash = action.payload;
            // console.log(state.routeHash,"routeHash Updated")

        },
        setDistance:  (state, action) => {
            // console.log("i am in")
            state.distance = action.payload;
            // console.log(state.distance,"distance Updated")

        }
        // setTravelTimeInformation: (state, action) => {
        //     state.travelTimeInformation = action.payload;
        // }
    }
})

export const { setOrigin, setDestination, setTravelTimeInformation,setMapRef,setRouteHash,setDistance } = navSlice.actions


// //Selector
export const selectOrigin = (state) => state.nav.origin;
export const selectDestination = (state) => state.nav.destination;
export const selectMapRef = (state) => state.nav.mapRef;
export const selectRouteHash = (state) => state.nav.routeHash;
export const selectDistance = (state) => state.nav.distance;
// export const selectTraveTimeInformation = (state) => state.nav.travelTimeInformation;


export default navSlice.reducer