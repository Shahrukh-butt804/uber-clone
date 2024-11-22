import { Tabs } from "expo-router";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";

export default function () {
  return (
    <Tabs 
    screenOptions={{
      headerShown: false,
    }}
    >
      <Tabs.Screen name="Ride" options={{
         title: "Ride",
         tabBarIcon: ({ color }) => <FontAwesome5 size={28} name="car-side" color={color} />

         
         }} />
          <Tabs.Screen name="food" options={{
         title: "Food",
         tabBarIcon: ({ color }) => <Ionicons size={21} name="fast-food" color={color} />

      }} />
    </Tabs>
  );
}