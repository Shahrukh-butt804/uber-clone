import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import {
  Ionicons,
  FontAwesome,
} from "@expo/vector-icons";
import { Image, SafeAreaView, Text, View } from "react-native";
import { DrawerItemList } from "@react-navigation/drawer";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => {
          return (
            <SafeAreaView style={{ marginTop: 50 }}>
              <View
                style={{
                  height: 200,
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  borderBottomColor: "#000",
                  marginBottom: 10,
                  borderBottomWidth: 0.5,
                }}
              >
                <Image
                source={{uri:"https://thumbs.dreamstime.com/b/businessman-icon-vector-male-avatar-profile-image-profile-businessman-icon-vector-male-avatar-profile-image-182095609.jpg"}}
                  style={{ height: 130, width: 130, borderRadius: 65 }}
                />
                <Text
                  style={{
                    color: "#000",
                    fontSize: 22,
                    marginVertical: 6,
                    fontWeight: "bold",
                  }}
                >
                  SHAHRUKH BUTT
                </Text>
                <Text style={{ color: "#000", fontSize: 16, marginBottom: 10 }}>
                  Frontend Developer
                </Text>
              </View>
              <DrawerItemList {...props} />
            </SafeAreaView>
          );
        }}
        screenOptions={{
          drawerActiveBackgroundColor: "skyblue",
          drawerActiveTintColor: "#000",
          drawerLabelStyle: {
            color: "#000",
          },
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: "Home",
            title: "Home",
            drawerIcon: ({ size }) => (
              <Ionicons name="home-outline" size={size} />
            ),
          }}
        />

        <Drawer.Screen
          name="profile"
          options={{
            drawerLabel: "Profile",
            title: "Profile",
            drawerIcon: ({ size }) => (
              <Ionicons
                name="person-outline"
                size={size}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            drawerLabel: "settings",
            title: "settings",
            drawerIcon: ({ size }) => (
              <Ionicons name="settings-outline" size={size} />
            ),
          }}
        />

        <Drawer.Screen
          name="LogOut"
          options={{
            drawerLabel: "Sign Out",
            title: "sign-out",
            drawerIcon: ({ size }) => (
              <FontAwesome name="sign-out" size={size} />
              // <Ionicons name="person-outline" size={size} />
            ),
          }}
        />

        {/* <Drawer.Screen
          name="contact/contact"
          options={{
            drawerLabel: "Contact",
            title: "Contact",
            drawerIcon: ({ size }) => <AntDesign name="contacts" size={size} />,
          }}
        /> */}
        
      </Drawer>
    </GestureHandlerRootView>
  );
}
       

