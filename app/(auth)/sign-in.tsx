import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useSignIn, useOAuth } from "@clerk/expo";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async () => {
    if (!isLoaded || !email.trim() || !password.trim()) return;
    setLoading(true);
    try {
      const result = await signIn.create({
        identifier: email.trim(),
        password,
      });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/(app)");
      }
    } catch (err: any) {
      const message =
        err?.errors?.[0]?.longMessage ??
        err?.errors?.[0]?.message ??
        "Sign in failed. Check your email and password.";
      Alert.alert("Sign In Failed", message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const { createdSessionId, setActive: oauthSetActive } =
        await startOAuthFlow();
      if (createdSessionId && oauthSetActive) {
        await oauthSetActive({ session: createdSessionId });
        router.replace("/(app)");
      }
    } catch {
      Alert.alert("Google Sign In Failed", "Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 24, paddingVertical: 48 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo / Header */}
        <View className="items-center mb-10">
          <View className="w-16 h-16 rounded-2xl bg-primary/10 items-center justify-center mb-4 border border-primary/30">
            <Text style={{ fontSize: 28 }}>₱</Text>
          </View>
          <Text
            className="text-text text-3xl font-bold mb-1"
            style={{ fontFamily: "PlusJakartaSans_700Bold" }}
          >
            GastoGuard
          </Text>
          <Text
            className="text-muted text-sm"
            style={{ fontFamily: "Inter_400Regular" }}
          >
            Guard your gastos. Track every peso.
          </Text>
        </View>

        {/* Card */}
        <View className="bg-surface rounded-2xl p-6 border border-border">
          <Text
            className="text-text text-xl font-bold mb-6"
            style={{ fontFamily: "PlusJakartaSans_700Bold" }}
          >
            Welcome back
          </Text>

          {/* Google OAuth Button */}
          <TouchableOpacity
            onPress={handleGoogleSignIn}
            disabled={googleLoading}
            className="flex-row items-center justify-center bg-background border border-border rounded-xl py-3 mb-4"
            style={{ gap: 8 }}
          >
            {googleLoading ? (
              <ActivityIndicator color="#F8FAFC" size="small" />
            ) : (
              <>
                <Text
                  className="text-text font-bold"
                  style={{ fontSize: 18, lineHeight: 22 }}
                >
                  G
                </Text>
                <Text
                  className="text-text"
                  style={{ fontFamily: "Inter_500Medium" }}
                >
                  Continue with Google
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center mb-4" style={{ gap: 12 }}>
            <View className="flex-1 h-px bg-border" />
            <Text
              className="text-muted text-xs"
              style={{ fontFamily: "Inter_400Regular" }}
            >
              or sign in with email
            </Text>
            <View className="flex-1 h-px bg-border" />
          </View>

          {/* Email */}
          <View className="mb-4">
            <Text
              className="text-muted text-xs font-medium mb-1.5"
              style={{ fontFamily: "Inter_500Medium", letterSpacing: 0.8 }}
            >
              EMAIL
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="juan@example.com"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              className="bg-background border border-border rounded-xl px-4 text-text"
              style={{ fontFamily: "Inter_400Regular", paddingVertical: 14, fontSize: 15 }}
            />
          </View>

          {/* Password */}
          <View className="mb-6">
            <Text
              className="text-muted text-xs font-medium mb-1.5"
              style={{ fontFamily: "Inter_500Medium", letterSpacing: 0.8 }}
            >
              PASSWORD
            </Text>
            <View>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showPassword}
                returnKeyType="done"
                onSubmitEditing={handleSignIn}
                className="bg-background border border-border rounded-xl px-4 text-text"
                style={{ fontFamily: "Inter_400Regular", paddingVertical: 14, paddingRight: 56, fontSize: 15 }}
              />
              <TouchableOpacity
                onPress={() => setShowPassword((p) => !p)}
                style={{ position: "absolute", right: 16, top: 14 }}
              >
                <Text
                  className="text-muted text-sm"
                  style={{ fontFamily: "Inter_400Regular" }}
                >
                  {showPassword ? "Hide" : "Show"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            onPress={handleSignIn}
            disabled={loading || !email.trim() || !password.trim()}
            className="bg-primary rounded-xl py-4 items-center"
            style={{ opacity: loading || !email.trim() || !password.trim() ? 0.6 : 1 }}
          >
            {loading ? (
              <ActivityIndicator color="#022c22" size="small" />
            ) : (
              <Text
                className="text-white font-semibold text-base"
                style={{ fontFamily: "Inter_600SemiBold" }}
              >
                Sign In
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Sign up link */}
        <View className="flex-row justify-center mt-6">
          <Text
            className="text-muted text-sm"
            style={{ fontFamily: "Inter_400Regular" }}
          >
            Don't have an account?{" "}
          </Text>
          <Link href="/(auth)/sign-up" asChild>
            <TouchableOpacity>
              <Text
                className="text-primary text-sm font-medium"
                style={{ fontFamily: "Inter_500Medium" }}
              >
                Sign up free
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
