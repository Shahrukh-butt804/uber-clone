import { Text, View, Image, FlatList, TouchableOpacity,StyleSheet } from 'react-native'
import tw from "twrnc";
import { Entypo } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import app from "../firebase/firebase.mjs"





// FIREBASE API KEY
//  AIzaSyBym762YkRnsEN4TgpQM1Za_lyrnV_zAqk 

export default function () {

  const [user, setUser] = useState(null)
  const auth = getAuth(app)

  useEffect(() => {
    const subscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // console.log(user.uid,"this is login user of now")
        setUser(user)
      } else {
        router.push("../")
        console.log("user is not login")
        setUser(null)
      }
    })
  }, [])


  const ItemSeparator = () => (
    <View style={styles.separator} />
  );



  const data = [
    {
      id: 1,
      title: "GO For Ride",
      image: "https://links.papareact.com/3pn",
      link: "../dashboard/(tabs)/Ride"
    },
    {
      id: 2,
      title: "Uber eats",
      image: "https://links.papareact.com/28w",
      link: "../dashboard/(tabs)/food"
    },
  ]

  const data2 = [
    {
      id:1,
      logo: "network",
      heading: "Work",
      text: "1455 market street",
    },
    {
      id:2,
      logo: "stopwatch",
      heading: "1600 michigan Stree",
      text: "san francisco",
    }
  ]



  return (
      <>
        <View style={tw`bg-white`}>
          <Image style={tw`text-blue-500 p-2 pt-2 m-3 mx-5`}
            source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0y4cwkKwm19K-l-AlIJjQZX4IWzDSFhZzvIeY7uwwHQ&s" }}
            width={130}
            height={65}
          />


          <FlatList

            data={data}
            renderItem={({ item }) => (

              <TouchableOpacity onPress={() => { router.push(item.link) }} style={[tw` p-2 mx-[-17]`, { marginLeft: 5, }]}>

                <View style={tw`bg-gray-100 m-1 p-5`}>
                  <Image
                    style={[tw`p-2 mb-1`, { resizeMode: "contain" }]}
                    source={{ uri: item.image }}
                    width={130}
                    height={140}
                  />

                  <Text style={tw`mx-2 font-semibold text-lg mb-2`}>{item.title}</Text>
                  <View style={{ marginHorizontal: -5 }}>
                    <Entypo style={tw`my-3 `} name="arrow-with-circle-right" size={24} color="black" />
                  </View>
                </View>
              </TouchableOpacity>

            )}
            keyExtractor={(item) => item.id}
            horizontal
          />


        </View>


      <View style={tw``}>
        <Text style={tw`px-5 pt-5  text-gray-500 bg-white font-bold text-xl`}>Go again</Text>
      <FlatList
        data={data2}
        renderItem={({ item }) => (
          <TouchableOpacity>
          <View style={[tw`bg-white p-2`, {flexDirection:"row", marginLeft: 5, }]}>
              <View style={tw`m-1 p-5`}>
                <Entypo style={tw`mt-2`} name={item.logo} size={24} color="black" />
              </View>
              <View style={tw` m-1 p-5`}>
                <Text style={tw`font-semibold text-4 mb-2`}>{item.heading}</Text>
                <Text style={tw`font-semibold text-4 mb-2`}>{item.text}</Text>
              </View>
          </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={ItemSeparator}
      />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: '#CED0CE',
  },
});
