import "./style.css";
import type { Metadata } from "next";
export const metadata: Metadata = {
 metadataBase: new URL("https://canon-transactions.vercel.app"),
 title: "Canon Transactions | Walrus Sessions 7", description: "A read-only agent lab that resolves typed, append-only memory into one canonical current state.",
 icons: { icon: "/icon.svg", shortcut: "/icon.svg", apple: "/icon.svg" },
 openGraph: { title: "Canon Transactions | Walrus Sessions 7", description: "A read-only agent lab that resolves typed, append-only memory into one canonical current state.", images: [{url:"/og.svg", width:1200, height:630, alt:"Canon Transactions | Walrus Sessions 7"}] },
 twitter: { card:"summary_large_image", title:"Canon Transactions | Walrus Sessions 7", description:"A read-only agent lab that resolves typed, append-only memory into one canonical current state.", images:["/og.svg"] }
};
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
