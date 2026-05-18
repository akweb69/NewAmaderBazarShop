import { Routes, Route } from 'react-router-dom'
import Signup from './NewResellar/Auth/Signup'
import HomePageLayout from './NewResellar/Homepage/HomePageLayout'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePageLayout />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  )
}

export default App