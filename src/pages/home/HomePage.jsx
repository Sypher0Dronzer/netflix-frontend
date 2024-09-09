import { Helmet } from "react-helmet"
import { useAuthStore } from "../../store/authUser"
import AuthScreen from "./AuthScreen"
import HomeScreen from "./HomeScreen"
import { useEffect } from "react"

const HomePage = () => {
  const {user}= useAuthStore()
  useEffect(()=>{
    console.log(user)

  },[user])
  return (
    <>
    <Helmet>
      <title>Netflix Clone</title>
      <meta property="og:title" content='Netflix Clone' />
      <meta property="og:description" content="Discover top movies, TV shows, and cast details in our Netflix clone." />      
      <meta property="og:image" content="https://ibb.co/h1nz882"/>
      <meta property="og:url" content={`https://netflix-clone-7ldf.onrender.com/`} />
      <meta property="og:type" content="website" />
    </Helmet>
    <div >
      {user? <HomeScreen/> :<AuthScreen/>}
    </div>
    </>
  )
}

export default HomePage
