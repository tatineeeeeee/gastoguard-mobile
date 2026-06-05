import React, { useState } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBiometricAuth } from "@/hooks/use-biometric-auth";
import { Button } from "@/components/ui/Button";

export default function BiometricLockScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { authenticate } = useBiometricAuth();
  const [failed, setFailed] = useState(false);

  const handleUnlock = async () => {
    setFailed(false);
    const success = await authenticate();
    if (success) {
      router.back();
    } else {
      setFailed(true);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0F172A",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 32,
        paddingBottom: insets.bottom + 24,
      }}
    >
      <Text style={{ fontSize: 56, marginBottom: 24 }}>🔒</Text>
      <Text
        style={{
          fontFamily: "PlusJakartaSans_700Bold",
          fontSize: 24,
          color: "#F8FAFC",
          marginBottom: 8,
          textAlign: "center",
        }}
      >
        GastoGuard is locked
      </Text>
      <Text
        style={{
          fontFamily: "Inter_400Regular",
          fontSize: 15,
          color: "#94A3B8",
          textAlign: "center",
          marginBottom: 40,
          lineHeight: 22,
        }}
      >
        Use biometrics to unlock and continue.
      </Text>

      {failed && (
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 14,
            color: "#F43F5E",
            textAlign: "center",
            marginBottom: 16,
          }}
        >
          Authentication failed. Please try again.
        </Text>
      )}

      <Button label="Unlock" onPress={handleUnlock} variant="primary" fullWidth />
    </View>
  );
}
