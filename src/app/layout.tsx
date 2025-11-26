import { Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/Providers";
import ClientNavWrapper from "@/components/ClientNavWrapper";
import { Metadata } from "next";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Petly",
  description: "Encontre, adote e ajude pets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${roboto.variable} ${robotoMono.variable} antialiased`}
      >
        <Providers>
          {/* Global navigation available across pages; hide on login using ClientNavWrapper */}
          <ClientNavWrapper />

          {/* No fixed top padding on the layout so the navbar floats above the hero —
              widgets that may be hidden by the navbar should add their own padding/margins. */}
          {children}
        </Providers>
      </body>
    </html>
  );
}
