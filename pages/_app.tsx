import "@styles/index.scss";
import React, { ReactElement } from "react";
import { AppProps } from "next/app";
import Head from "next/head";

const App = ({ Component, pageProps }: AppProps): ReactElement => {
  return (
    <div>
      <Head>
        <title>Sad Wolf RPG Dice Roller</title>
      </Head>
      <Component {...pageProps} />
    </div>
  );
};

export default App;
