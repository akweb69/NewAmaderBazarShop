import { Routes, Route } from 'react-router-dom'
import Signup from './NewResellar/Auth/Signup'
import HomePageLayout from './NewResellar/Homepage/HomePageLayout'
import Signin from './NewResellar/Auth/Signin'

function App() {
  return (
    <Routes >
      <Route path="/" element={<HomePageLayout />}>
        <Route path="signup" element={<Signup />} />
        <Route path="signin" element={<Signin />} />
      </Route>

    </Routes>
  )
}

export default App