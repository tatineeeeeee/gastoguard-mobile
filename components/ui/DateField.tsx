import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, Platform } from "react-native";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";

type Props = {
  value: number;
  onChange: (ms: number) => void;
  label?: string;
  optional?: boolean;
  minimumDate?: number;
  maximumDate?: number;
};

export function DateField({
  value,
  onChange,
  label = "Date",
  optional = false,
  minimumDate,
  maximumDate,
}: Props) {
  const [open, setOpen] = useState(false);

  const displayDate = dayjs(value).format("MMM D, YYYY");

  return (
    <View>
      {label ? (
        <Text
          style={{
            fontFamily: "Inter_500Medium",
            fontSize: 13,
            color: "#94A3B8",
            marginBottom: 8,
          }}
        >
          {label}
        </Text>
      ) : null}
      <TouchableOpacity
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#0F172A",
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#334155",
          paddingVertical: 12,
          paddingHorizontal: 16,
        }}
      >
        <Text style={{ fontFamily: "Inter_400Regular", fontSize: 15, color: "#F8FAFC" }}>
          {displayDate}
        </Text>
        <Text style={{ fontSize: 16 }}>📅</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setOpen(false)}
          style={{ flex: 1, backgroundColor: "#00000080", justifyContent: "flex-end" }}
        >
          <TouchableOpacity activeOpacity={1}>
            <View
              style={{
                backgroundColor: "#1E293B",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: 20,
                paddingBottom: 36,
                borderWidth: 1,
                borderBottomWidth: 0,
                borderColor: "#334155",
              }}
            >
              <View style={{ alignItems: "center", marginBottom: 16 }}>
                <View
                  style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: "#334155" }}
                />
              </View>
              <Text
                style={{
                  fontFamily: "PlusJakartaSans_700Bold",
                  fontSize: 18,
                  color: "#F8FAFC",
                  marginBottom: 16,
                  textAlign: "center",
                }}
              >
                {label}
              </Text>
              <DateTimePicker
                mode="single"
                date={dayjs(value)}
                onChange={({ date }) => {
                  if (date) {
                    onChange(dayjs(date).valueOf());
                    setOpen(false);
                  }
                }}
                minDate={minimumDate ? dayjs(minimumDate) : undefined}
                maxDate={maximumDate ? dayjs(maximumDate) : undefined}
                classNames={{
                  day_cell: "rounded-lg",
                  selected_day: "bg-primary",
                  today: "border border-primary",
                  day_label: "text-text font-interMedium",
                  month_selector_label: "text-text font-heading",
                  year_selector_label: "text-text font-heading",
                  header: "mb-2",
                  weekday_label: "text-muted",
                }}
                calendarTextStyle={{ fontFamily: "Inter_400Regular", color: "#F8FAFC" }}
                selectedItemColor="#10B981"
                headerTextStyle={{
                  fontFamily: "PlusJakartaSans_700Bold",
                  color: "#F8FAFC",
                  fontSize: 16,
                }}
                dayContainerStyle={{ borderRadius: 8 }}
              />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
