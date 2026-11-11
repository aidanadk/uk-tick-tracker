import {useEffect, useState} from 'react';

function App(){
  // stores the data to show 
  const [status, setStatus] = useState('loading...'); 
  // works once when the page is downloaded
  useEffect(() => {
    // requests the data
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch(()=> setStatus('error: backend not reachable'));
  }, []);

  return <h1>Backend Status: {status}</h1>
}

export default App;