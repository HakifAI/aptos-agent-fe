import localFont from "next/font/local";

export const murecho = localFont({
  src: [
    {
      path: "../../public/fonts/Murecho-Regular.ttf",
      weight: "400",
    },
    {
      path: "../../public/fonts/Murecho-SemiBold.ttf",
      weight: "600",
    },
  ],
  variable: "--font-murecho",
  display: "swap",
});


