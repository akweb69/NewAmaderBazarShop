import { Routes, Route } from 'react-router-dom'
import Signup from './NewResellar/Auth/Signup'
import HomePageLayout from './NewResellar/Homepage/HomePageLayout'
import Signin from './NewResellar/Auth/Signin'
import HeroSection from './NewResellar/Homepage/HeroSection'
import Cat_Prod_page from './NewResellar/Homepage/Cat_Prod_page'
import Prod_Details_Page from './NewResellar/Homepage/Prod_Details_Page'
import BottomCategory from './NewResellar/Homepage/BottomCategory'
import Search from './NewResellar/Homepage/Search'


function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePageLayout />}>
        <Route index element={<HeroSection />} />
        <Route path="/category/products" element={<Cat_Prod_page />} />
        <Route path="/product/:id" element={<Prod_Details_Page />} />
        <Route path="/category_form_bottom_nav" element={<BottomCategory />} />
        <Route path="/search_by_text" element={<Search />} />
      </Route>

      {/* authentication routes */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />


      {/* user dashboard routes starts here */}

    </Routes>


  )
}

export default App