import MapPage from './pages/Map'
import Learn from './pages/Learn'
import Report from './pages/Report'
import Header from './assets/components/Header'

function App() {
  const path = window.location.pathname

  if (path === '/learn') {
    return (
      <>
        <Header />
        <Learn />
      </>
    )
  }

  if (path === '/report') {
    return <Report />
  }

  return <MapPage />
}

export default App
