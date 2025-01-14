import './Login.scss'
import assets from '../../assets/assets'
import { useForm } from 'react-hook-form'
import { data } from 'react-router-dom'

interface LoginFormInputs {
  username: string
  email: string
  password: string
}

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>()

  const onSubmit = (data: LoginFormInputs) => {
    console.log(data)
  }
  return (
    <div className="login">
      <img src={assets.logo_big} alt="logo" className="login_logo_big" />
      <form className="login_form" onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          className="form_input"
          {...register('username', {
            required: 'Username must be required',
            minLength:{
              value: 6,
              message: 'Username must be at least 6 characters'
            }
          })}
          placeholder='Username'
        />
        {errors.username && <span>{errors.username.message}</span>}
        <input
          type="email"
          className="form_input"
          {...register('email', {
            required: 'Email must be required',
            pattern:{
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Email invalid'
            }
          })}
          placeholder='Email'
        />
        {errors.email && <span>{errors.email.message}</span>}
        <input
          type="text"
          className="form_input"
          {...register('password', {
            required: 'Password must be required',
            minLength:{
              value: 6,
              message: 'Password must be at least 6 characters'
            }
          })}
          placeholder='Password'
        />
        {errors.password && <span>{errors.password.message}</span>}
        <button type="submit">Sign up</button>
        <div className="login_term">
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy</p>
        </div>
        <div className="login_forgot">
          <p className='login_toggle'> Already have an account? <span>Click here</span></p>
        </div>
      </form>
    </div>
  )
}

export default Login
