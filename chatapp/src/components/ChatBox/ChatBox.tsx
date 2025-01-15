import assets from '../../assets/assets'
import './ChatBox.scss'

const ChatBox = () => {
  return (
    <div className="cb">
      <div className="cb-user">
        <img src={assets.profile_img} alt="" />
        <p>John Doe <img className="green-dot" src={assets.green_dot} alt="" /></p>
        <img src={assets.help_icon} alt="" />
      </div>

      <div className="chat-msg">
        <div className="s-msg">
          <img className="msg-img" src={assets.pic1} alt="" />
          <div className="msg-time">
            <img src={assets.profile_img} alt="" />
            <p className="time">12:00</p>
          </div>
        </div>
        <div className="s-msg">
          <p className="msg">Hello how are you? Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
          <div className="msg-time">
            <img src={assets.profile_img} alt="" />
            <p className="time">12:00</p>
          </div>
        </div>
        <div className="r-msg">
          <p className="msg">Hello how are you?</p>
          <div className="msg-time">
            <img src={assets.profile_img} alt="" />
            <p className="time">12:00</p>
          </div>
        </div>
      </div>

      <div className="cb-chat">
        <input type="text" placeholder="Type a message" />
        <input type="file" id="file" accept="image/*" hidden />
        <label htmlFor="file">
          <img src={assets.gallery_icon} alt="" />
        </label>
        <img src={assets.send_button} alt="" />
      </div>
    </div>
  )
}

export default ChatBox
