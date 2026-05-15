// GP 品牌设计 token 常量
// 基于 Stitch 交付的 design_system.json

export const colors = {
  primary: "#0F172A",
  secondary: "#E0E7FF",
  tertiary: "#64748B",
  neutral: "#F1F5F9",
  background: "#F8F9FA",
  surface: "#FFFFFF",
  textPrimary: "#0F172A",
  textSecondary: "#64748B",
  border: "#F1F5F9",
  accent: "#0F172A",
} as const;

export const typography = {
  display: {
    fontFamily: "Inter",
    fontSize: "60px",
    fontWeight: 400,
    lineHeight: "60px",
    letterSpacing: "-0.025em",
  },
  displayMobile: {
    fontFamily: "Inter",
    fontSize: "36px",
    fontWeight: 400,
    lineHeight: "40px",
    letterSpacing: "-0.02em",
  },
  body: {
    fontFamily: "Inter",
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "24px",
  },
  label: {
    fontFamily: "Inter",
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "20px",
  },
} as const;

export const spacing = {
  base: 16,
  section: 64,
  card: 18,
  gap: 8,
  maxWidth: 1440,
} as const;

export const motion = {
  durations: [160, 200] as const,
  easing: "cubic-bezier(0.23, 1, 0.32, 1)" as const,
} as const;
