import './Login.scss'
import assets from '../../assets/assets'
import { useForm } from 'react-hook-form'
import { useSpring, animated } from '@react-spring/web'
import { useState } from 'react'
import { signIn, signUp } from '../../config/firebase'
import LoadingModal from '../../components/Modals/LoadingModal'
import MessageModal from '../../components/Modals/MessageModal'

interface LoginFormInputs {
  username: string
  email: string
  password: string
  terms: boolean
}

const Login = () => {
  const [currentPage, setCurrentPage] = useState('Sign up')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [terms, setTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  })

  const handleCloseModal = () => {
    setModal({ ...modal, open: false })
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>()

  const [springs, api] = useSpring(() => ({
    from: { scale: 1 },
  }))

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      setLoading(true)
      if (currentPage === 'Sign up') {
        await signUp(data.username, data.email, data.password)
        setModal({
          open: true,
          message: 'Sign up successful',
          severity: 'success'
        })
      } else if (currentPage === 'Login') {
        await signIn(data.email, data.password)
        setModal({
          open: true,
          message: 'Login successful',
          severity: 'success'
        })
      }
    } catch (error) {
      setModal({
        open: true,
        message: error instanceof Error ? error.message.split('/')[1].split('-').join(' ').split(').').join('')   : 'An error occurred',
        severity: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login">
      <img src={assets.logo_big} alt="logo" className="login_logo_big" />
      <form className="login_form" onSubmit={handleSubmit(onSubmit)}>
        <h2>{currentPage}</h2>

        {currentPage === 'Sign up' && (
          <>
            <input
              type="text"
              className={`form_input ${errors.username ? 'form_input--error' : ''}`}
              {...register('username', {
                required: 'Username must be required',
                minLength: {
                  value: 6,
                  message: 'Username must be at least 6 characters'
                },
                onChange: (e) => setUsername(e.target.value)
              })}
              placeholder='Username'
              value={username}
            />
            {errors.username && <span className="error-message">{errors.username.message}</span>}
          </>
        )}

        <input
          type="email"
          className={`form_input ${errors.email ? 'form_input--error' : ''}`}
          {...register('email', {
            required: 'Email must be required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Email invalid'
            },
            onChange: (e) => setEmail(e.target.value)
          })}
          placeholder='Email'
          value={email}
        />
        {errors.email && <span className="error-message">{errors.email.message}</span>}

        {currentPage !== 'Forgot password' && (
          <>
            <input
              type="password"
              className={`form_input ${errors.password ? 'form_input--error' : ''}`}
              {...register('password', {
                required: 'Password must be required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                },
                onChange: (e) => setPassword(e.target.value)
              })}
              placeholder='Password'
              value={password}
            />
            {errors.password && <span className="error-message">{errors.password.message}</span>}
          </>
        )}

        <div className="login_term">
          {currentPage === 'Sign up' && (
            <>
              <input
                type="checkbox"
                {...register('terms', {
                  required: 'You must accept the terms and conditions'
                })}
                onChange={() => setTerms(!terms)}
                checked={terms}
              />
              <p>Agree to the terms of use & privacy policy</p>
            </>
          )}
        </div>
        {errors.terms && <span className="error-message">{errors.terms.message}</span>}

        <animated.button
          type="submit"
          style={{
            ...springs,
            transform: springs.scale.to(s => `scale(${s})`)
          }}
          onMouseEnter={() => api.start({ scale: 1.05 })}
          onMouseLeave={() => api.start({ scale: 1 })}
        >
          {currentPage === 'Sign up' ? 'Sign up' : currentPage === 'Login' ? 'Login now' : 'Reset password'}
        </animated.button>

        <div className="login_forgot">
          {currentPage === 'Sign up' && (
            <p className='login_toggle'> Already have an account? <span onClick={() => setCurrentPage('Login')}>Click here</span></p>
          )}
          {currentPage === 'Login' && (
            <>
              <p className='login_toggle'> Don't have an account? <span onClick={() => setCurrentPage('Sign up')}>Sign up</span></p>
              <p className='login_toggle'> Forgot password? <span onClick={() => setCurrentPage('Forgot password')}>Click here</span></p>
            </>
          )}
          {currentPage === 'Forgot password' && (
            <p className='login_toggle'> Back to <span onClick={() => setCurrentPage('Login')}>Login</span></p>
          )}

        </div>

        <MessageModal
          open={modal.open}
          onClose={handleCloseModal}
          message={modal.message}
          severity={modal.severity}
        />

        <LoadingModal open={loading} />
      </form>
    </div>
  )
}

export default Login
