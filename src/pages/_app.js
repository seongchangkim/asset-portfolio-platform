import '@/styles/globals.css'
import { Provider } from "react-redux" 
import React from "react";
import MemberStore from '@/store';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import Script from 'next/script';
import { kakaoInit } from '@/global/kakao';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import { Chart } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

let persistor = persistStore(MemberStore);

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <>
      <Provider store={MemberStore}>
        <PersistGate loading={null} persistor={persistor}>
          {
            getLayout(<Component {...pageProps} />)
          }
        </PersistGate>
      </Provider>
      <Script src="https://developers.kakao.com/sdk/js/kakao.js" onLoad={kakaoInit}></Script>
    </>
    
  );
}

