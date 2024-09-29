import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';
import React from "react";
import {AppRouterCacheProvider} from "@mui/material-nextjs/v14-appRouter";
import {Roboto} from "next/font/google";
import {ThemeProvider} from "@mui/material/styles";
import theme from "@/theme/theme";
import Navbar from "@/components/Navbar/Navbar";
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";
import {Container} from "@mui/material";
import {ToastContainer} from "react-toastify";

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-roboto',
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    const session = await getServerSession(authOptions);

  return (
    <html lang="en">
    <body className={roboto.variable}>
    <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>
            <Navbar session={session}/>
            <Container maxWidth="xl">
                {children}
            </Container>
            <ToastContainer theme="dark"/>
        </ThemeProvider>
    </AppRouterCacheProvider>
      </body>
    </html>
  );
}
