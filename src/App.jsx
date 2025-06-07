import { useState } from 'react'
import { Button } from './components/ui/button'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div>this is new code</div>
    <Button variant="secondary">click me</Button>
    </>
  )
}

export default App
