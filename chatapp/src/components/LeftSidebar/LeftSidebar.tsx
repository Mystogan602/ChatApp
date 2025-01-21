import './LeftSidebar.scss'
import assets from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import { db } from '../../config/firebase'
import { arrayUnion, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import { collection } from 'firebase/firestore'
import { loadUserData, useChatListener } from '../../store/appSlice'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { useEffect, useState } from 'react'
import { auth } from '../../config/firebase'

interface UserData {
    id: string;
    username: string;
    avatar: string;
    // thêm các trường khác nếu cần
}

const LeftSidebar = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [userData, setUserData] = useState<UserData | null>(null)
    const [user, setUser] = useState<UserData | null>(null)
    const [showSearch, setShowSearch] = useState(false)

    // Lấy userData từ Redux store
    const userDataFromRedux = useAppSelector((state) => state.app.userData)

    // Sử dụng custom hook để lắng nghe chat data
    useChatListener(userDataFromRedux)

    // Lấy chatData từ Redux store
    const chatData = useAppSelector((state) => state.app.chatData)

    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                const currentUser = auth.currentUser
                if (currentUser) {
                    const data = await dispatch(loadUserData(currentUser.uid))
                    setUserData((data.payload as any).userData)
                }
            } catch (error) {
                console.log('Error loading user data:', error)
            }
        }

        getCurrentUser()
    }, [dispatch])

    const inputHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const inputValue = e.target.value
            if (inputValue) {
                setShowSearch(true)
                const usersRef = collection(db, 'users')
                const q = query(usersRef, where('username', '>=', inputValue), where('username', '<=', inputValue + '\uf8ff'))
                const snapshot = await getDocs(q)
                if (snapshot.docs.length > 0) {
                    const docData = snapshot.docs[0].data() as UserData;
                    if (docData.id !== userData?.id) {
                        let userExist = false;
                        
                        chatData.map((user: any) => {
                            console.log(user.rId, docData.id);
                            if (user.rId === docData.id) {
                                userExist = true;
                            }
                        })
                        if (!userExist) {
                            setUser(docData)
                        }
                    }
                } else {
                    setUser(null)
                }
            }
            else {
                setShowSearch(false)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleAddFriend = async () => {
        try {
            // console.log(user?.id, userData?.id)
            if (!user?.id || !userData?.id) return;

            const messagesRef = collection(db, "messages");
            const newMessageRef = doc(messagesRef)
            await setDoc(newMessageRef, {
                createdAt: Date.now(),
                messages: []
            })

            const chatsRef = collection(db, "userChats");
            const chatData = {
                messageId: newMessageRef.id,
                lastMessage: '',
                rId: userData.id,
                updatedAt: Date.now(),
                messageSeen: true
            }

            await updateDoc(doc(chatsRef, user.id), {
                chatsData: arrayUnion(chatData)
            })

            await updateDoc(doc(chatsRef, userData.id), {
                chatsData: arrayUnion({ ...chatData, rId: user.id })
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="ls">
            <div className="ls-top">
                <div className="ls-nav">
                    <img className="logo" src={assets.logo} alt="" />
                    <div className="menu">
                        <img src={assets.menu_icon} alt="" />
                        <div className="sub-menu">
                            <p onClick={() => navigate('/profile-update')}>Edit Profile</p>
                            <hr />
                            <p>Logout</p>
                        </div>
                    </div>
                </div>
                <div className="ls-search">
                    <img src={assets.search_icon} alt="" />
                    <input type="text" placeholder="Search here..." onChange={inputHandler} />
                </div>
            </div>
            <div className="ls-list">
                {showSearch && user ? (
                    <div onClick={handleAddFriend} className="friends add-friend">
                        <img src={user.avatar} alt="" />
                        <p>{user.username}</p>
                    </div>
                ) : (
                    Array.from({ length: 10 }).map((_, index) => (
                        <div key={index} className="friends">
                            <img src={assets.profile_img} alt="" />
                            <div className="friends-info">
                                <h3>John Doe</h3>
                                <p>Hello</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default LeftSidebar
