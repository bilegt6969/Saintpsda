import React from 'react'
import './styles.css'
import Navbar from '@/components/Heading/Navbar'
import Footer from '@/components/footer'

import { ProductProvider } from '../../app/context/ProductContext'
import NextTopLoader from 'nextjs-toploader';


export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Saint. 2025.',
  icons: {
    icon: [
      '/favico/favicon-32x32.png?v=4',
      '/favico/favicon-16x16.png?v=4',
      '/favico/favicon.ico?v=4',
    ],
    apple: ['/icons/favico/apple-touch-icon.png?v=4'],
    other: [
      {
        rel: 'manifest',
        url: '/icons/favico/site.webmanifest?v=4',
      },
    ],
  },
}


export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <div className="pb-20">
          <Navbar />

        </div>
        <ProductProvider>
          <main>
            <div className="z-[1000 ]">
            <NextTopLoader
  color="#ffffff  "
  initialPosition={0.08}
  crawlSpeed={100}
  height={3}
  crawl={true}
  showSpinner={true}
  easing="ease"
  speed={200}
  shadow="0 0 10px #2299DD,0 0 5px #2299DD"
  template='<div class="bar" role="bar"><div class="peg"></div></div> 
  <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
  zIndex={1600}
  showAtBottom={false}
/>
            </div>
            {children}
            <Footer/>

          </main>
        </ProductProvider>
      </body>
    </html>
  )
}
