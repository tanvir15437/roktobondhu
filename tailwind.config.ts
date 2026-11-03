import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#6D4AFF",
          secondary: "#8B73FF",
          light: "#F0ECFF",
          subtle: "#F8F6FF",
          dark: "#5735E2",
        },
        ink: {
          primary: "#17151F",
          secondary: "#6B6875",
          muted: "#96929F",
        },
        ui: {
          border: "#E7E4EC",
          bg: "#FAFAFB",
          surface: "#FFFFFF",
        },
        semantic: {
          success: "#168A5B",
          "success-subtle": "#E8F6F0",
          warning: "#D98A00",
          "warning-subtle": "#FEF6E7",
          error: "#D64545",
          "error-subtle": "#FDECEC",
          info: "#3578E5",
          "info-subtle": "#EBF2FC",
        },
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "system-ui", "-apple-system", "sans-serif"],
      },
      fontSize: {
        "12": ["12px", { lineHeight: "16px" }],
        "14": ["14px", { lineHeight: "20px" }],
        "16": ["16px", { lineHeight: "24px" }],
        "18": ["18px", { lineHeight: "28px" }],
        "20": ["20px", { lineHeight: "28px" }],
        "22": ["22px", { lineHeight: "30px" }],
        "24": ["24px", { lineHeight: "32px" }],
        "32": ["32px", { lineHeight: "40px" }],
        "36": ["36px", { lineHeight: "44px" }],
        "44": ["44px", { lineHeight: "52px" }],
      },
      fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },
      borderRadius: {
        none: "0px",
        sm: "4px",
        md: "8px",
        lg: "12px",
        full: "9999px", // reserved for avatar dots & indicator pips only
      },
      spacing: {
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        5: "20px",
        6: "24px",
        8: "32px",
        10: "40px",
        12: "48px",
        14: "56px",
        16: "64px",
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(23, 21, 31, 0.04), 0 1px 2px -1px rgba(23, 21, 31, 0.04)",
        card: "0 2px 8px -2px rgba(23, 21, 31, 0.06)",
        dropdown: "0 4px 16px -2px rgba(23, 21, 31, 0.08)",
        modal: "0 12px 32px -4px rgba(23, 21, 31, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;

