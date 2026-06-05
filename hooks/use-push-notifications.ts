import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Note: push notification delivery requires a development build.
// In Expo Go, permission is granted but the push token will be null on Android.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function registerForPushNotificationsAsync(): Promise<string | null> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") return null;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  try {
    const token = await Notifications.getExpoPushTokenAsync();
    return token.data;
  } catch {
    // Returns null in Expo Go on Android — requires a dev build
    return null;
  }
}

export function usePushNotifications() {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);
}
