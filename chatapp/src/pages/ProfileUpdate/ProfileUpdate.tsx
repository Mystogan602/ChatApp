import { useState } from 'react'
import { Snackbar, Alert, CircularProgress } from '@mui/material'
import assets from '../../assets/assets'
import './ProfileUpdate.scss'
import { useForm } from 'react-hook-form'

type FormValues = {
  name: string
  bio: string
  avatar: FileList
}

const ProfileUpdate = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>()

  const [avatar, setAvatar] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  })

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true)
      // Xử lý logic update
      setSnackbar({
        open: true,
        message: 'Profile updated successfully!',
        severity: 'success'
      })
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update profile',
        severity: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='profile'>
      <div className='profile-container'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h3>Profile Details</h3>
          <label htmlFor="avatar">
            <input
              type="file"
              id="avatar"
              accept="image/*"
              hidden
              {...register('avatar', {
                required: 'Avatar is required',
                onChange: (e) => setAvatar(e.target.files?.[0])
              })}
            />
            <img src={avatar ? URL.createObjectURL(avatar) : assets.avatar_icon} alt="avatar" />
            Upload Avatar
          </label>
          {errors.avatar && <span className="error">{errors.avatar.message}</span>}

          <input
            type="text"
            placeholder='Name'
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && <span className="error">{errors.name.message}</span>}

          <textarea
            placeholder='Bio'
            {...register('bio', { required: 'Bio is required' })}
          />
          {errors.bio && <span className="error">{errors.bio.message}</span>}

          <button type='submit' disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Update'}
          </button>
        </form>
        <img className='profile-pic' src={avatar ? URL.createObjectURL(avatar) : assets.avatar_icon} alt="logo" />
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          severity={snackbar.severity}
          onClose={handleCloseSnackbar}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default ProfileUpdate
