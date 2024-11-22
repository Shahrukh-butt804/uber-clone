import { useEffect, useState } from "react";
import {
  View, Text, TextInput,
  ImageBackground, TouchableOpacity,
  ActivityIndicator, Pressable, ToastAndroid
} from "react-native"
import tw from "twrnc"
import { Feather } from '@expo/vector-icons';
import { Link, router } from "expo-router";
import app from "../firebase/firebase.mjs"
import {
  getAuth, signInWithEmailAndPassword,
  onAuthStateChanged
} from "firebase/auth";

export default function () {

  const auth = getAuth(app);

  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")
  const [user, setUser] = useState(null)
  const [showLoader, setShowLoader] = useState(false)


  function showToast(text) {
    ToastAndroid.show(text, ToastAndroid.SHORT);
  }

  useEffect(() => {
    const subscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // console.log(user.uid,"this is login user of now")
        setUser(user)
        router.push("../drawerScreens")
      } else {
        setUser(null)
      }
    })
  }, [])

  if (showLoader) {
    setTimeout(() => {
      signin()
    }, 0)
  }

  let signin = () => {
    signInWithEmailAndPassword(auth, email, pass)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // console.log(user, "login time credentials")
        // alert("successfully login ! ")
        showToast("successfully logged in")
        router.push("../drawerScreens")
        setShowLoader(false)

        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // alert(errorMessage)
        showToast(errorMessage)
        setShowLoader(false)
      });
  }

  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };







  return (
    <View style={[tw``, { flex: 1 }]}>
      <ImageBackground source={{ uri: "https://wallpaper.forfun.com/fetch/5f/5f5510722572991a42d348263247be0d.jpeg" }} resizeMode="cover" style={[tw`h-full opacity-200`, { flex: 1, justifyContent: 'center', }]} >


        <View style={[tw` w-full h-100 mt-20`, { justifyContent: 'center', alignItems: "center" }]}>
          <TextInput
            style={[tw`bg-white p-2 rounded-lg text-5`, { width: 300 }]}
            placeholder="Email"
            onChangeText={(text) => setEmail(text)}
            value={email}
          />
          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginRight: 48 }}>
            <TextInput
              style={[tw`bg-white p-2 rounded-lg text-5 mt-5 `, { width: 300 }]}
              placeholder="Password"
              onChangeText={(text) => setPass(text)}
              value={pass}
              secureTextEntry={secureTextEntry}

            /><TouchableOpacity onPress={toggleSecureEntry} style={tw`mt-6 mx-[-35]`}>
              <Feather name={secureTextEntry ? 'eye-off' : 'eye'} size={24} color="black" />
            </TouchableOpacity>
          </View>

          {!showLoader ?
            <Pressable onPress={() => { setShowLoader(true) }} style={[tw` m-5 h-14`,]}>
              <View style={[tw`text-center border border-white rounded`, { width: 300, alignItems: "center", justifyContent: "center" }]}>

                <Text style={[tw`text-white text-xl font-extrabold  p-2`, {}]}>Login</Text>
              </View>
            </Pressable>

            :
            <View style={{ width: 300, alignItems: "center", justifyContent: "center" }}>
              <ActivityIndicator style={tw`mt-5`} size="large" color="white" />
            </View>
          }

          <TouchableOpacity onPress={() => alert("forgot")} style={[tw` mt-5 h-13`,]}>
            <Text style={[tw`text-white text-2xl font-extrabold  p-2`, { width: 300, marginLeft: 2, textDecorationLine: "underline" }]}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { }} style={[tw`relative right-7 h-14`,]}>
            <Link href="./Login/signup">
              <Text style={[tw`text-white text-2xl font-extrabold p-2`, { width: 300, marginLeft: 2, textDecorationLine: "underline" }]}>
                Click here to Sign Up
              </Text>
            </Link>
          </TouchableOpacity>

        </View>


        <View>


        </View>
      </ImageBackground>
    </View>
  );
}