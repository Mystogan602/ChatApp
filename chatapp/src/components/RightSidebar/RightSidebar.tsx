import assets from '../../assets/assets'
import './RightSidebar.scss'

const RightSidebar = () => {
  return (
    <div className="rs">
      <div className="rs-profile">
        <img src={assets.profile_img} alt="" />
        <h3>John Doe <img className="green-dot" src={assets.green_dot} alt="" /></h3>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
      </div>
      <hr />
      <div className="rs-media">
        <p>Media</p>
        <div className="rs-media-img">
            <img src={assets.pic1} alt="" />
            <img src={assets.pic2} alt="" />
            <img src={assets.pic3} alt="" />
        </div>
      </div>
      <button>Logout</button>
    </div>
  )
}

export default RightSidebar
