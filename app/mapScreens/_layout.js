import { Stack } from "expo-router";

export default function () {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShown:false
      }}>
      <Stack.Screen name="index" options={{

    }} />
    <Stack.Screen name="distance" options={{

    }} />
    </Stack>
  );
}