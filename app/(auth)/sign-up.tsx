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
import { useSignUp } from "@clerk/expo";

export default function SignUpScreen() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);

  const handleSignUp = async () => {
    if (!isLoaded || !email.trim() || !password.trim() || !name.trim()) return;
    setLoading(true);
    try {
      await signUp.create({
        emailAddress: email.trim(),
        password,
        firstName: name.split(" ")[0],
        lastName: name.split(" ").slice(1).join(" ") || undefined,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      const message =
        err?.errors?.[0]?.longMessage ??
        err?.errors?.[0]?.message ??
        "Sign up failed. Please try again.";
      Alert.alert("Sign Up Failed", message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!isLoaded || !code.trim()) return;
    setVerifyLoading(true);
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/(app)");
      }
    } catch {
      Alert.alert("Verification Failed", "Invalid code. Please try again.");
    } finally {
      setVerifyLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-background"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 24, paddingVertical: 48 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="items-center mb-10">
            <View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center mb-4">
              <Text style={{ fontSize: 28 }}>📧</Text>
            </View>
            <Text
              className="text-text text-2xl font-bold mb-2"
              style={{ fontFamily: "PlusJakartaSans_700Bold" }}
            >
              Check your email
            </Text>
            <Text
              className="text-muted text-sm text-center"
              style={{ fontFamily: "Inter_400Regular", paddingHorizontal: 24 }}
            >
              We sent a 6-digit code to {email}
            </Text>
          </View>

          <View className="bg-surface rounded-2xl p-6 border border-border">
            <TextInput
              value={code}
              onChangeText={setCode}
              placeholder="000000"
              placeholderTextColor="#94A3B8"
              keyboardType="number-pad"
              maxLength={6}
              returnKeyType="done"
              onSubmitEditing={handleVerify}
              className="bg-background border border-border rounded-xl px-4 text-text text-center mb-6"
              style={{
                fontFamily: "JetBrainsMono_500Medium",
                paddingVertical: 16,
                fontSize: 24,
                letterSpacing: 8,
              }}
            />

            <TouchableOpacity
              onPress={handleVerify}
              disabled={verifyLoading || code.length < 6}
              className="bg-primary rounded-xl py-4 items-center"
              style={{ opacity: verifyLoading || code.length < 6 ? 0.6 : 1 }}
            >
              {verifyLoading ? (
                <ActivityIndicator color="#022c22" size="small" />
              ) : (
                <Text
                  className="text-white font-semibold text-base"
                  style={{ fontFamily: "Inter_600SemiBold" }}
                >
                  Verify Email
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

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
            Free expense tracker for Filipinos
          </Text>
        </View>

        <View className="bg-surface rounded-2xl p-6 border border-border">
          <Text
            className="text-text text-xl font-bold mb-6"
            style={{ fontFamily: "PlusJakartaSans_700Bold" }}
          >
            Create your account
          </Text>

          {/* Name */}
          <View className="mb-4">
            <Text
              className="text-muted text-xs font-medium mb-1.5"
              style={{ fontFamily: "Inter_500Medium", letterSpacing: 0.8 }}
            >
              FULL NAME
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Juan dela Cruz"
              placeholderTextColor="#94A3B8"
              autoCapitalize="words"
              returnKeyType="next"
              className="bg-background border border-border rounded-xl px-4 text-text"
              style={{ fontFamily: "Inter_400Regular", paddingVertical: 14, fontSize: 15 }}
            />
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
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Min. 8 characters"
              placeholderTextColor="#94A3B8"
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleSignUp}
              className="bg-background border border-border rounded-xl px-4 text-text"
              style={{ fontFamily: "Inter_400Regular", paddingVertical: 14, fontSize: 15 }}
            />
          </View>

          <TouchableOpacity
            onPress={handleSignUp}
            disabled={loading || !email.trim() || !password.trim() || !name.trim()}
            className="bg-primary rounded-xl py-4 items-center"
            style={{
              opacity: loading || !email.trim() || !password.trim() || !name.trim() ? 0.6 : 1,
            }}
          >
            {loading ? (
              <ActivityIndicator color="#022c22" size="small" />
            ) : (
              <Text
                className="text-white font-semibold text-base"
                style={{ fontFamily: "Inter_600SemiBold" }}
              >
                Create Account — It's Free
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-center mt-6">
          <Text
            className="text-muted text-sm"
            style={{ fontFamily: "Inter_400Regular" }}
          >
            Already have an account?{" "}
          </Text>
          <Link href="/(auth)/sign-in" asChild>
            <TouchableOpacity>
              <Text
                className="text-primary text-sm font-medium"
                style={{ fontFamily: "Inter_500Medium" }}
              >
                Sign in
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
