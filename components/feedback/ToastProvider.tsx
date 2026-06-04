import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { Toast } from "./Toast";
import type { ToastVariant, ToastAction, ToastData } from "./Toast";

export type ToastOptions = {
  message: string;
  variant?: ToastVariant;
  durationMs?: number;
  action?: ToastAction;
};

type ToastContextValue = {
  show: (opts: ToastOptions) => string;
  hide: (id?: string) => void;
};

const ToastContext = createContext<ToastContextValue>({
  show: () => "",
  hide: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const [current, setCurrent] = useState<ToastData | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const translateY = useSharedValue(80);
  const opacity = useSharedValue(0);

  const dismiss = useCallback(() => {
    translateY.value = withTiming(80, { duration: 250 });
    opacity.value = withTiming(0, { duration: 250 });
    setTimeout(() => setCurrent(null), 260);
  }, [translateY, opacity]);

  const show = useCallback(
    (opts: ToastOptions): string => {
      const id = Math.random().toString(36).slice(2);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      const data: ToastData = {
        id,
        message: opts.message,
        variant: opts.variant ?? "success",
        action: opts.action,
      };

      setCurrent(data);
      translateY.value = 80;
      opacity.value = 0;
      translateY.value = withTiming(0, { duration: 300 });
      opacity.value = withTiming(1, { duration: 300 });

      timerRef.current = setTimeout(() => {
        dismiss();
      }, opts.durationMs ?? 3000);

      return id;
    },
    [translateY, opacity, dismiss]
  );

  const hide = useCallback(
    (_id?: string) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      dismiss();
    },
    [dismiss]
  );

  const handleActionPress = useCallback(() => {
    if (!current?.action) return;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    current.action.onPress();
    dismiss();
  }, [current, dismiss]);

  return (
    <ToastContext.Provider value={{ show, hide }}>
      {children}
      {current && (
        <View
          pointerEvents="box-none"
          style={{
            position: "absolute",
            bottom: insets.bottom + 80,
            left: 16,
            right: 16,
            zIndex: 9999,
          }}
        >
          <Toast
            data={current}
            translateY={translateY}
            opacity={opacity}
            onActionPress={handleActionPress}
          />
        </View>
      )}
    </ToastContext.Provider>
  );
}
