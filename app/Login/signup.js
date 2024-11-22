import { useState } from "react";
import {
  View, Text, TextInput,
  ImageBackground, TouchableOpacity,
  Pressable, ActivityIndicator, ToastAndroid
} from "react-native"
import tw from "twrnc"
import { Feather } from '@expo/vector-icons';
import app from "../firebase/firebase.mjs"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default function () {

  const auth = getAuth(app);

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")
  const [confirmPass, setConfirmPass] = useState("")
  const [showLoader, setShowLoader] = useState(false)

  function showToast(text) {
    ToastAndroid.show(text, ToastAndroid.SHORT);
  }


  //validation 
  if (showLoader) {
    setTimeout(() => {
      validation()
    }, 0)
  } {

  }
  let validation = () => {
    if (firstName == "") {
      showToast("Please Enter FirstName")
      setShowLoader(false)
      return false
    }
    if (firstName.length < 3) {
      showToast("firstName must be 3 or more characters")
      setShowLoader(false)
      return false
    }
    if (lastName == "") {
      showToast("Please Enter LastName")
      setShowLoader(false)
      return false
    }
    if (lastName.length < 3) {
      showToast("LastName must be 3 or more characters")
      setShowLoader(false)
      return false
    }
    if (email == "") {
      showToast("Please Enter Email")
      setShowLoader(false)
      return false
    } else {
      let emailCheck = email.includes("@") ? true : false
      if (!emailCheck) {
        showToast("Please Enter Valid Email")
        setShowLoader(false)
        return false
      }
    }


    if (pass == "") {
      showToast("Please Enter Password")
      setShowLoader(false)
      return false
    }
    if (pass.length < 6) {
      showToast("Password must be at least 6 characters")
      setShowLoader(false)
      return false
    }
    if (confirmPass == "") {
      showToast("Please Enter Confirm Password")
      setShowLoader(false)
      return false
    }
    if (pass != confirmPass) {
      showToast("Password and Confirm Password not matched")
      setShowLoader(false)
      return false
    }

    signup()



  }




  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureTextEntryForConfirmPass, setSecureTextEntryForConfirmPass] = useState(true);





  let signup = () => {
    createUserWithEmailAndPassword(auth, email, pass)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        // console.log(user,"this is credentials")
        showToast("Successfully Logged in!")
        setShowLoader(false)
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        showToast(errorMessage)
        // ..
        setShowLoader(false)
      });

  }


  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };
  const toggleSecureEntryForConfirmPass = () => {
    setSecureTextEntryForConfirmPass(!secureTextEntryForConfirmPass);
  };






  return (

    <View style={[tw``, { flex: 1 }]}>
      <ImageBackground source={{ uri: "https://wallpaper.forfun.com/fetch/5f/5f5510722572991a42d348263247be0d.jpeg" }} resizeMode="cover" style={[tw`h-full opacity-200`, { flex: 1, justifyContent: 'center', }]} >


        <View style={[tw` w-full h-100 mt-20`, { justifyContent: 'center', alignItems: "center" }]}>


          <TextInput
            style={[tw`bg-white mt-4 p-4 rounded-lg text-5`, { width: 300 }]}
            placeholder="FirstName"
            onChangeText={(text) => setFirstName(text)}
            value={firstName}
          />
          <TextInput
            style={[tw`bg-white mt-4 p-4 rounded-lg text-5`, { width: 300 }]}
            placeholder="LastName"
            onChangeText={(text) => setLastName(text)}
            value={lastName}
          />



          <TextInput
            style={[tw`bg-white mt-4 p-4 rounded-lg text-5`, { width: 300 }]}
            placeholder="Email"
            onChangeText={(text) => setEmail(text)}
            value={email}
          />
          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginRight: 48 }}>
            <TextInput
              style={[tw`bg-white p-4 rounded-lg text-5 mt-5 `, { width: 300 }]}
              placeholder="Password"
              onChangeText={(text) => setPass(text)}
              value={pass}
              secureTextEntry={secureTextEntry}
            />
            <TouchableOpacity onPress={toggleSecureEntry} style={tw`mt-6 mx-[-35]`}>
              <Feather name={secureTextEntry ? 'eye-off' : 'eye'} size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginRight: 48 }}>
            <TextInput
              style={[tw`bg-white p-4  mt-4 rounded-lg text-5`, { width: 300 }]}
              placeholder="Confirm Password"
              onChangeText={(text) => setConfirmPass(text)}
              value={confirmPass}
              secureTextEntry={secureTextEntryForConfirmPass}

            />
            <TouchableOpacity onPress={toggleSecureEntryForConfirmPass} style={tw`mt-6 mx-[-35]`}>
              <Feather name={secureTextEntryForConfirmPass ? 'eye-off' : 'eye'} size={24} color="black" />
            </TouchableOpacity>
          </View>


          {!showLoader ?

            <Pressable onPress={() => { setShowLoader(true) }} style={[tw` m-5 h-14`,]}>
              <View style={[tw`text-center border border-white rounded`, { width: 300, alignItems: "center", justifyContent: "center" }]}>

                <Text style={[tw`text-white text-xl font-extrabold  p-2`, {}]}>Sign Up</Text>
              </View>
            </Pressable>

            :
            <View style={{ width: 300, alignItems: "center", justifyContent: "center" }}>
              <ActivityIndicator style={tw`mt-5`} size="large" color="white" />
            </View>
          }

        </View>


        <View>


        </View>
      </ImageBackground>
    </View>
  );
}