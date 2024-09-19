import { Body } from "./Body";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Grid } from "./Structure";
import { myConfig } from "./config";
import { useIdleTimer } from 'react-idle-timer'
import { useState } from 'react';
import './app.css';

const { idle_seconds } = myConfig[process.env.REACT_APP_CAEN].chart;

function App() {
  const [state, setState] = useState('Active');

  const onIdle = () => {
    setState('Idle');
    // console.log('idle');
  }

  useIdleTimer({
    onIdle,
    timeout: idle_seconds * 1000,
  });

  if (state==="Idle") {
    return (<><div className="sleepcontainer">
      <div>
        <h1>CAEN Manager sleep mode</h1>
        <p>The tab noticed you weren't paying attention to it for a long time, so it decided to take a break</p>
        <h1 style={{fontSize: "10rem"}}>🥱</h1>
        <p>Refresh the tab to make it work</p>
      </div>
    </div></>);
  }

  return (
    <Grid>
      <Header />
      <Body />
      <Footer />
    </ Grid>
  );
}

export default App;
