import "./style.css";
import type { Metadata } from "next";
export const metadata: Metadata = {
 metadataBase: new URL("https://canon-transactions-alfa.vercel.app"),
 title: "Canon Transactions | Walrus Sessions 7", description: "An agent workflow for resolving typed, append-only current truth.",
 icons: { icon: "/icon.svg" },
 openGraph: { title: "Canon Transactions | Walrus Sessions 7", description: "An agent workflow for resolving typed, append-only current truth.", images: [{url:"/og.svg", width:1200, height:630, alt:"Canon Transactions | Walrus Sessions 7"}] },
 twitter: { card:"summary_large_image", title:"Canon Transactions | Walrus Sessions 7", description:"An agent workflow for resolving typed, append-only current truth.", images:["/og.svg"] }
};
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
