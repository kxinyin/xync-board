import { Roboto } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@ant-design/v5-patch-for-react-19";
import RootLayoutClient from "./layout.client";

const roboto = Roboto({
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "400", "700", "900"], // Light, Base, Semibold, Bold (Roboto)
  variable: "--font-roboto",
});

export const metadata = {
  title: "Xync Board",
  description: "Welcome to Xync Board.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${roboto.className} antialiased`}>
        <AntdRegistry>
          <RootLayoutClient children={children} roboto={roboto} />
        </AntdRegistry>
      </body>
    </html>
  );
}
