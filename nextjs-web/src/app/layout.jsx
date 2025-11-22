import '../styles/globals.css';

export const metadata = {
  title: 'AI Email Campaign Manager',
  description: 'Create and send personalized email campaigns with AI-powered assistance',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
