import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "../styles/globals.css"
import PageLoader from "@/components/PageLoader"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:3000"),
  title: {
    default: "Gilby | Portfolio",
    template: "%s | Gilby Portfolio",
  },
  description: "Personal portfolio of Gilby Maleeq Gibrany. Web Developer specializing in modern web design and interactive interfaces.",
  keywords: ["Gilby", "Gilby Maleeq Gibrany", "Portfolio", "Web Developer", "Frontend", "UI/UX", "SMKN 4 Malang", "HTML5", "CSS3", "JavaScript"],
  authors: [{ name: "Gilby Maleeq Gibrany" }],
  creator: "Gilby Maleeq Gibrany",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    title: "Gilby | Portfolio",
    description: "Personal portfolio of Gilby Maleeq Gibrany. Web Developer specializing in modern web design and interactive interfaces.",
    siteName: "Gilby Portfolio",
    images: [
      {
        url: "/images/gilby.png",
        width: 1200,
        height: 630,
        alt: "Gilby Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gilby | Portfolio",
    description: "Personal portfolio of Gilby Maleeq Gibrany. Web Developer specializing in modern web design and interactive interfaces.",
    images: ["/images/gilby.png"],
    creator: "@gilby",
  },
  icons: {
    icon: "/images/gilby.png",
    shortcut: "/images/gilby.png",
    apple: "/images/gilby.png",
  },
  alternates: {
    canonical: "/",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <PageLoader />
        {children}
      </body>
    </html>
  )
}

