import Script from 'next/script';
import React from 'react';

export default function Ads() {
  const env = process.env.NODE_ENV;
  const isProduction = env === 'production';

  if (isProduction) {
    return (
      <Script
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1288517130363555"
      />
    );
  }
}
