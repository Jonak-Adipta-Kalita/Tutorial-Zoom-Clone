import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tabs
        screenOptions={({ route }) => ({
          header: () => null,
          tabBarActiveTintColor: "#5F5DEC",
          tabBarStyle: {
            display: route.name === "[id]" ? "none" : "flex",
          },
        })}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "All Calls",
            tabBarIcon: ({ color }) => (
              <Ionicons name="call-outline" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="[id]"
          options={{
            title: "Start a New Call",
            unmountOnBlur: true,
            header: () => null,
            tabBarIcon: ({ color }) => (
              <View className="absolute justify-center items-center top-[-10px] left-[20px] right-[20px] bottom-0 m-auto rounded-[50px] z-[100px] bg-white border-gray-500 border-[0.2px] border-t border-b-0">
                <FontAwesome
                  name="plus-circle"
                  size={30}
                  color="#6b7280"
                  className="z-[200px]"
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="join"
          options={{
            title: "Join Call",
            // headerTitle: "Enter the Room ID",
            tabBarIcon: ({ color }) => (
              <Ionicons name="enter-outline" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
};
