
import './index.css'
import { Route,Routes } from 'react-router-dom'
import SigninForm from './_auth/forms/SigninForm'
import { AllUsers, CreatePost, EditPost, Explore, Home, LikedPost, Postdetails, Profile, Saved, UpdateProfile } from './_root/Pages'
import SignupForm from './_auth/forms/SignupForm'
import AuthLayout from './_auth/AuthLayout'
import { Toaster } from "@/components/ui/toaster"
import RootLayout from './_root/RootLayout'



// the main function here===================>
function App() {

  return (
   <main className='flex h-screen'>
      <Routes>
        {/* public Routes */}
        <Route element={<AuthLayout/>}>
        <Route path='/sign-in' element={<SigninForm/>} />
        <Route path='/sign-up' element={<SignupForm/>} />
         </Route>


        

        {/* private Routes */}

        <Route element={<RootLayout/>}>
        <Route path='/' element={<Home/>} />
        <Route path='/explore' element={<Explore/>} />
        <Route path='/saved' element={<Saved/>} />
        <Route path='/all-users' element={<AllUsers/>} />
        <Route path='/create-post' element={<CreatePost/>} />
        <Route path='/update-post/:id' element={<EditPost/>} />
        <Route path='/posts/:id' element={<Postdetails/>} />
        <Route path='/profile/:id/*' element={<Profile/>} />
        <Route path='/update-profile/:id' element={<UpdateProfile/>} />
        <Route path='/update-profile/:id' element={<LikedPost/>} />

        </Route>

      </Routes>
      <Toaster/>
   </main>
  )
}

export default App
