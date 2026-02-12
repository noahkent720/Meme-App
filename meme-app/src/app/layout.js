import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "MemeApp - Share Your Memes",
  description: "Create, share, and vote on memes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
