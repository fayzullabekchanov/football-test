// pages/_app.js
import { SessionProvider } from 'next-auth/react'
import { LangProvider } from '../lib/useLang'
import '../styles/globals.css'

export default function App({ Component, pageProps: { session, ...pageProps } }) {
    return (
        <SessionProvider session={session}>
            <LangProvider>
                <Component {...pageProps} />
            </LangProvider>
        </SessionProvider>
    )
}