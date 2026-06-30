import './globals.css';

export const metadata = {
  title: 'Caliber Asset Assessment',
  description: 'Remote property assessment for hospitality PM and asset stabilization.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
