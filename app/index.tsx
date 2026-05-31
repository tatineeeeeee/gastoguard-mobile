import { Redirect } from "expo-router";
import { useAuth } from "@clerk/expo";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color="#10B981" size="large" />
      </View>
    );
  }

  if (isSignedIn) {
    return <Redirect href="/(app)" />;
  }

  return <Redirect href="/(auth)/sign-in" />;
}
