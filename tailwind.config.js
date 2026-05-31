/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#0F172A",
        surface: "#1E293B",
        border: "#334155",
        primary: "#10B981",
        danger: "#F43F5E",
        accent: "#F59E0B",
        text: "#F8FAFC",
        muted: "#94A3B8",
        card: "#1E293B",
        chart1: "#10B981",
        chart2: "#3B82F6",
        chart3: "#8B5CF6",
        chart4: "#F59E0B",
        chart5: "#F43F5E",
        chart6: "#06B6D4",
      },
      fontFamily: {
        sans: ["Inter_400Regular"],
        heading: ["PlusJakartaSans_700Bold"],
        mono: ["JetBrainsMono_500Medium"],
        interMedium: ["Inter_500Medium"],
        interSemiBold: ["Inter_600SemiBold"],
      },
    },
  },
  plugins: [],
};
