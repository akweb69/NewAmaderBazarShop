import { Routes, Route } from 'react-router-dom'
import Signup from './NewResellar/Auth/Signup'
import HomePageLayout from './NewResellar/Homepage/HomePageLayout'
import Signin from './NewResellar/Auth/Signin'
import HeroSection from './NewResellar/Homepage/HeroSection'


function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePageLayout />}>
        <Route index element={<HeroSection />} />

      </Route>

      {/* authentication routes */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />


      {/* user dashboard routes starts here */}

    </Routes>


  )
}

export default App