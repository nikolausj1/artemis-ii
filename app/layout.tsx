import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Artemis II Mission Tracker | 3D Orbit Visualization",
  description:
    "Interactive 3D visualization of the Artemis II free-return lunar trajectory with real-time mission tracking. Follow the first crew to fly around the Moon since Apollo 17.",
  openGraph: {
    title: "Artemis II Mission Tracker",
    description:
      "Interactive 3D orbit visualization of NASA's Artemis II lunar mission. Real-time tracking of the first crewed flight around the Moon since 1972.",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Artemis II Mission Tracker",
    description:
      "Interactive 3D orbit visualization of NASA's Artemis II lunar mission.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-[#000008]">{children}</body>
    </html>
  );
}
