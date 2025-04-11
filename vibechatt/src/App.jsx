
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Auth from './pages/auth/Auth'
import Chat from './pages/chat/Chat'
import Profile from './pages/profile/Profile'
import { Children, useEffect, useState } from 'react'
import { useAppStore } from './store'
import { apiClient } from './lib/api-client'
import { GETUSER_INFO } from './utils/constants'

const PrivateRoute = ({children}) => {
  const { userInfo } = useAppStore();
  const isAuthenticate = !!userInfo;
  console.log(userInfo)
  return isAuthenticate ? children : <Navigate to="/auth" />
}

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticate = !!userInfo;
  return isAuthenticate ? <Navigate to="/chat" /> : children;
}

function App() {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get(GETUSER_INFO, { withCredentials: true })
        if (response.status === 200 && response.data.id) {
          setUserInfo(response.data);
        } else {
          setUserInfo(undefined);
        }
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }

  }, [userInfo, setUserInfo])

  if(loading) return <div>Loading</div>

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/auth' element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          } />
          <Route path='/chat' element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          } />
          <Route path='/profile' element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          <Route path='*' element={<Navigate to='/auth' />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
