import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/home/HomePage";
import SignUpPage from "./pages/SignUpPage";
import Footer from "./pages/components/Footer";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authUser";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import WatchPage from "./pages/WatchPage";
import CastDetailPage from "./pages/CastDetailPage";
import SearchPage from "./pages/SearchPage";
import SearchHistoryPage from "./pages/SearchHistoryPage";
import NotFoundPage from "./pages/404";

export default function App() {
  const {user,isCheckingAuth,authCheck}= useAuthStore()

  useEffect(()=>{
    authCheck()
  },[])

  if (isCheckingAuth) {
		return (
			<div className='h-screen'>
				<div className='flex justify-center items-center bg-black h-full'>
					<Loader className='animate-spin text-red-600 size-10' />
				</div>
			</div>
		);
	}
  return (<>
    <Routes>
          <Route index element={<HomePage />} />
          <Route path="/login" element={!user? <LoginPage /> : <Navigate to={'/'}/>} />
          <Route path="/signup" element={!user? <SignUpPage /> : <Navigate to={'/'}/>} />
          <Route path="/search" element={user? <SearchPage /> : <Navigate to={'/login'}/>} />
          <Route path="/history" element={user? <SearchHistoryPage /> : <Navigate to={'/login'}/>} />
          <Route path="/watch/:type/:id" element={user? <WatchPage /> : <Navigate to={'/login'}/>} />
          <Route path="/cast/:id" element={user? <CastDetailPage /> : <Navigate to={'/login'}/>} />
          <Route path='/*' element={<NotFoundPage />} />
      </Routes>
      <Toaster/>
      <Footer/>
  </>
  )
}