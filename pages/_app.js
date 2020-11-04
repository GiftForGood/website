import * as React from 'react';
import App from 'next/app';
import { getTokens } from '@kiwicom/orbit-components';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { Provider } from 'react-redux';
import { createWrapper } from 'next-redux-wrapper';
import { colors } from '@constants/colors';
import store from '../store';
import 'react-toastify/dist/ReactToastify.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { initGA, logPageView } from '@utils/analytics';
import 'react-quill/dist/quill.snow.css';
import { RemoteConfigProvider } from '@components/remoteConfig/RemoteConfig';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0 auto;
    font-family: 'Trebuchet MS';
  }

  pre {
    font-family: 'Trebuchet MS';
    margin: 0;
    word-wrap: break-word;
    white-space: pre-wrap; 
    word-break: break-word;
  }

  .default-avatar {
    width: 40px;
    height: 40px;
  }

  #scrollableCategory::-webkit-scrollbar, .scrollableDonation::-webkit-scrollbar {
    display: none;
  }

  .carousel .slide {
    background: ${colors.bannerBackground};
  }

  .control-dots {
    padding-inline-start: 0px; 
  }

  .ql-editor li {
    padding-bottom: 15px;
  }
`;

const tokens = getTokens();

class MyApp extends App {
  componentDidMount() {
    if (!window.GA_INITIALIZED && process.env.NODE_ENV !== 'development') {
      initGA();
      window.GA_INITIALIZED = true;
    }
    logPageView();
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Provider store={store}>
        <RemoteConfigProvider>
          <ThemeProvider theme={{ orbit: tokens }}>
            <>
              <GlobalStyle />
              <Component {...pageProps} />
            </>
          </ThemeProvider>
        </RemoteConfigProvider>
      </Provider>
    );
  }
}

const makeStore = () => store;
const wrapper = createWrapper(makeStore);

export default wrapper.withRedux(MyApp);
