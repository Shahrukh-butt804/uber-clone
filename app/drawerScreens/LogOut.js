import {View,Text,ActivityIndicator} from "react-native"
import { getAuth } from 'firebase/auth';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import app from "../firebase/firebase.mjs"
import { useEffect } from "react";
import { router } from "expo-router";


export default function (){

    const auth = getAuth(app);

   useEffect(()=>{
        signOut(auth).then(() => {
          console.log("You are Sign Out")
          router.push(".././")
        }).catch((error) => {
            console.log(error,"the error")
          // An error happened.
        });
   },[])


    return(
        <View style={{flex:1,justifyContent:"center",alignItems:"center",flexDirection:"row"}}>
          <Text>Signing Out..</Text>
            <ActivityIndicator size="large" color="#0000ff"/>
        </View>
    )}