import React from "react";
import { View, Text } from "react-native";
import Svg, { Circle, Text as SvgText } from "react-native-svg";

const RADIUS = 56;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type BreakdownItem = {
  label: string;
  points: number;
  maxPoints: number;
};

type Props = {
  score: number;
  breakdown: BreakdownItem[];
};

function scoreColor(score: number): string {
  if (score >= 80) return "#10B981";
  if (score >= 50) return "#F59E0B";
  return "#F43F5E";
}

function scoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Needs work";
}

export function HealthScoreGauge({ score, breakdown }: Props) {
  const clampedScore = Math.min(Math.max(score, 0), 100);
  const dashOffset = CIRCUMFERENCE * (1 - clampedScore / 100);
  const color = scoreColor(clampedScore);

  return (
    <View style={{ alignItems: "center", gap: 20 }}>
      {/* Gauge */}
      <View style={{ alignItems: "center" }}>
        <Svg width={140} height={140}>
          <Circle
            cx={70}
            cy={70}
            r={RADIUS}
            stroke="#334155"
            strokeWidth={10}
            fill="none"
          />
          <Circle
            cx={70}
            cy={70}
            r={RADIUS}
            stroke={color}
            strokeWidth={10}
            fill="none"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            rotation={-90}
            origin="70, 70"
          />
          <SvgText
            x={70}
            y={62}
            textAnchor="middle"
            fontSize={32}
            fontWeight="700"
            fill="#F8FAFC"
          >
            {clampedScore}
          </SvgText>
          <SvgText
            x={70}
            y={80}
            textAnchor="middle"
            fontSize={12}
            fill={color}
          >
            {scoreLabel(clampedScore)}
          </SvgText>
          <SvgText
            x={70}
            y={96}
            textAnchor="middle"
            fontSize={10}
            fill="#94A3B8"
          >
            out of 100
          </SvgText>
        </Svg>
      </View>

      {/* Breakdown */}
      <View style={{ width: "100%", gap: 10 }}>
        {breakdown.map((item) => {
          const fraction = item.maxPoints > 0 ? item.points / item.maxPoints : 0;
          const barColor = fraction >= 0.8 ? "#10B981" : fraction >= 0.5 ? "#F59E0B" : "#F43F5E";
          return (
            <View key={item.label} style={{ gap: 4 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: "#F8FAFC" }}
                >
                  {item.label}
                </Text>
                <Text
                  style={{ fontFamily: "JetBrainsMono_500Medium", fontSize: 12, color: "#94A3B8" }}
                >
                  {item.points}/{item.maxPoints}
                </Text>
              </View>
              <View
                style={{
                  height: 6,
                  backgroundColor: "#334155",
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: barColor,
                    width: `${Math.round(fraction * 100)}%`,
                  }}
                />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
