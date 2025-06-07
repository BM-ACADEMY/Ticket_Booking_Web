import { useState } from 'react'
import { Button } from './components/ui/button'
import './App.css'
import Page from './module/dashboard/Page'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Page />
    </>
  )
}

export default App
