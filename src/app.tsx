import React, { useEffect } from 'react';
import { getInstance as gs } from '@ombori/grid-signals-react';
import ShortUrlQrCode from '@ombori/ga-react-qr-run';
import styled from 'styled-components';
import { useSettings } from '@ombori/ga-settings';
import { formatRemoteKey } from './format-remote-key';

import { Schema as Settings } from './schema';

const MY_DEV_URL = 'http://localhost:3002';

function App() {
  const settings = useSettings<Settings>();

  useEffect(() => {
    const startSessionSubscription = async () => {
      const spaceEventSubscription = await gs().subscribeSpaceEvent((spaceEvent) => {
        switch(spaceEvent.eventType) {
          case 'GWREMOTE_REQUEST': {
            console.log("GWREMOTE_REQUEST:", spaceEvent);
            const currentSessionId = gs().getInstanceProps().sessionId;
            if (currentSessionId === spaceEvent.sessionId) {
              gs().setState({
                key: formatRemoteKey(spaceEvent.str1),
                value: spaceEvent.str1,
                expiryDuration: 10,
              });
            }
          }
        }
      });

      const spaceStateSubscription = await gs().subscribeSpaceState((spaceState) => {
        console.log('spaceState:', spaceState);
      });
  
      return () => {
        spaceEventSubscription.stop();
        spaceStateSubscription.stop();
      }
    }

    startSessionSubscription();
  }, []);

  const currentSessionId = gs().getInstanceProps().sessionId;

  if (!settings) {
    return <Container>Loading gridapp settings...</Container>
  }

  return (
    <Container>
      <ShortUrlQrCode
        url={`${MY_DEV_URL}#s=${currentSessionId}`}
        size={112}
      >
        {(shortUrl) => (
          <ShortUrlContainer>
            <ShortUrl>{shortUrl.replace(/^https:\/\//, '')}</ShortUrl>
          </ShortUrlContainer>
        )}
      </ShortUrlQrCode>
      <div>{`${MY_DEV_URL}#s=${currentSessionId}`}</div>
    </Container>
  );
}

const Container = styled.div`
  text-align: center;
  background-color: #282c34;
  height: 100%;
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 100%;
  color: white;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 1.5vmin);
`;

const ShortUrlContainer = styled.div`

`;

const ShortUrl = styled.div``;

export default App;
