import { useState, useEffect, useCallback } from "react";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";

const PREF_KEY = "biometricEnabled";

export function useBiometricAuth() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function check() {
      const [hasHardware, isEnrolled, pref] = await Promise.all([
        LocalAuthentication.hasHardwareAsync(),
        LocalAuthentication.isEnrolledAsync(),
        SecureStore.getItemAsync(PREF_KEY),
      ]);
      if (!mounted) return;
      setIsAvailable(hasHardware && isEnrolled);
      setIsEnabled(pref === "true");
      setIsChecking(false);
    }
    check();
    return () => { mounted = false; };
  }, []);

  const enable = useCallback(async () => {
    await SecureStore.setItemAsync(PREF_KEY, "true");
    setIsEnabled(true);
  }, []);

  const disable = useCallback(async () => {
    await SecureStore.setItemAsync(PREF_KEY, "false");
    setIsEnabled(false);
  }, []);

  const authenticate = useCallback(async (): Promise<boolean> => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Unlock GastoGuard",
        fallbackLabel: "Use PIN",
        cancelLabel: "Cancel",
      });
      return result.success;
    } catch {
      return false;
    }
  }, []);

  return { isAvailable, isEnabled, isChecking, enable, disable, authenticate };
}
