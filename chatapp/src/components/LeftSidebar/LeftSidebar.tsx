import './LeftSidebar.scss'
import assets from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
const LeftSidebar = () => {
    const navigate = useNavigate()
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
                    <input type="text" placeholder="Search here..." />
                </div>
            </div>
            <div className="ls-list">
                {Array.from({ length: 10 }).map((_, index) => (
                    <div key={index} className="friends">
                        <img src={assets.profile_img} alt="" />
                        <div className="friends-info">
                            <h3>John Doe</h3>
                            <p>Hello</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default LeftSidebar
