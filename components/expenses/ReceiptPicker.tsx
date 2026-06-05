import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

type Props = {
  storageId: string | null;
  onUpload: (storageId: string) => void;
  onRemove: () => void;
};

export function ReceiptPicker({ storageId, onUpload, onRemove }: Props) {
  const [uploading, setUploading] = useState(false);
  const [localUri, setLocalUri] = useState<string | null>(null);
  const generateUploadUrl = useMutation(api.expenses.generateUploadUrl);

  const pickAndUpload = async (source: "camera" | "library") => {
    let result: ImagePicker.ImagePickerResult;

    if (source === "camera") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission needed", "Camera access is required to take a receipt photo.");
        return;
      }
      result = await ImagePicker.launchCameraAsync({
        quality: 0.8,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
      });
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission needed", "Photo library access is required to attach a receipt.");
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync({
        quality: 0.8,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
      });
    }

    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    setUploading(true);
    try {
      const uploadUrl = await generateUploadUrl();

      const imageResponse = await fetch(asset.uri);
      const blob = await imageResponse.blob();

      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": blob.type || "image/jpeg" },
        body: blob,
      });

      if (!uploadResponse.ok) throw new Error("Upload failed");

      const { storageId: newStorageId } = await uploadResponse.json();
      setLocalUri(asset.uri);
      onUpload(newStorageId);
    } catch (_e) {
      Alert.alert("Error", "Failed to upload receipt. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handlePress = () => {
    Alert.alert("Attach Receipt", "Choose a source", [
      { text: "Camera", onPress: () => pickAndUpload("camera") },
      { text: "Photo Library", onPress: () => pickAndUpload("library") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleRemove = () => {
    setLocalUri(null);
    onRemove();
  };

  if (storageId && localUri) {
    return (
      <View style={{ gap: 8 }}>
        <Text style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: "#94A3B8" }}>
          Receipt
        </Text>
        <View style={{ position: "relative", alignSelf: "flex-start" }}>
          <Image
            source={{ uri: localUri }}
            style={{ width: 100, height: 75, borderRadius: 10 }}
            resizeMode="cover"
          />
          <TouchableOpacity
            onPress={handleRemove}
            style={{
              position: "absolute",
              top: -8,
              right: -8,
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: "#F43F5E",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#fff", fontSize: 12, fontWeight: "bold" }}>×</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={uploading}
      style={{
        backgroundColor: "#0F172A",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#334155",
        borderStyle: "dashed",
        paddingVertical: 14,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
        opacity: uploading ? 0.6 : 1,
      }}
    >
      <Text style={{ fontSize: 18 }}>📎</Text>
      <Text style={{ fontFamily: "Inter_500Medium", fontSize: 14, color: "#94A3B8" }}>
        {uploading ? "Uploading…" : "Attach Receipt (optional)"}
      </Text>
    </TouchableOpacity>
  );
}
