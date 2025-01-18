import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login/Login'
import Chat from './pages/Chat/Chat'
import ProfileUpdate from './pages/ProfileUpdate/ProfileUpdate'
import { useEffect } from 'react'
import { auth } from './config/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from './hooks/redux'
import { loadUserData } from './store/appSlice'

const App = () => {

  const navigate = useNavigate()
  const dispatch = useAppDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        navigate('/chat')
        const userData = await dispatch(loadUserData(user.uid))
        console.log(userData)
        if (loadUserData.fulfilled.match(userData)) {
          navigate(userData.payload.redirect);
        }
      } else {
        navigate('/')
      }
    })
  }, [])

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile-update" element={<ProfileUpdate />} />
      </Routes>
    </>
  )
}

export default App
