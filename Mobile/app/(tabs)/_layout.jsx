import { useUser } from "@clerk/clerk-expo";
import { Redirect, Tabs } from "expo-router";
import { Image } from "react-native";
import { COLORS, icons } from "../../constants";

export default function Layout() {
  const { isSignedIn } = useUser();

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Tabs>
      <Tabs.Screen
        name="dashboard"
        options={{
          headerShown: false,
          title: "Dashboard",
          tabBarIcon: ({ focused }) => {
            return (
              <Image
                source={focused ? icons.home : icons.homeOutline}
                resizeMode="contain"
                style={{
                  width: 24,
                  height: 24,
                  tintColor: focused ? COLORS.primary : COLORS.black,
                }}
              />
            );
          },
        }}
      />

      <Tabs.Screen
        name="create-transactions"
        options={{
          headerShown: false,
          title: "Ajouter Transaction",
          tabBarIcon: ({ focused }) => {
            return (
              <Image
                source={focused ? icons.plus : icons.plusOutline}
                resizeMode="contain"
                style={{
                  width: 24,
                  height: 24,
                  tintColor: focused ? COLORS.primary : COLORS.black,
                }}
              />
            );
          },
        }}
      />

      <Tabs.Screen
        name="transactions"
        options={{
          headerShown: false,
          title: "Transactions",
          tabBarIcon: ({ focused }) => {
            return (
              <Image
                source={focused ? icons.transaction : icons.transactionOutline}
                resizeMode="contain"
                style={{
                  width: 24,
                  height: 24,
                  tintColor: focused ? COLORS.primary : COLORS.black,
                }}
              />
            );
          },
        }}
      />
    </Tabs>

    // Nouvelles fonctionnalités dans les versions ulterieures
    // Budget
    // Notifications
    // Profile
    // Settings
    // Search
  );
}
