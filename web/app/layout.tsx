import "./style.css";
import type { Metadata } from "next";
export const metadata: Metadata = {
 metadataBase: new URL("https://canon-transactions.vercel.app"),
 title: "Canon Transactions — an append-only answer to what is current", description: "Append-only agent memory resolved into one canonical current answer, with every superseded record still readable.",
 icons: { icon: "/icon.svg", shortcut: "/icon.svg", apple: "/icon.svg" },
 openGraph: { title: "Canon Transactions — an append-only answer to what is current", description: "Append-only agent memory resolved into one canonical current answer, with every superseded record still readable.", images: [{url:"/og.svg", width:1200, height:630, alt:"Canon Transactions — an append-only answer to what is current"}] },
 twitter: { card:"summary_large_image", title:"Canon Transactions — an append-only answer to what is current", description:"Append-only agent memory resolved into one canonical current answer, with every superseded record still readable.", images:["/og.svg"] }
};
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
