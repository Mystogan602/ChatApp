import { useState } from 'react'
import { CircularProgress } from '@mui/material'
import assets from '../../assets/assets'
import './ProfileUpdate.scss'
import { useForm } from 'react-hook-form'
import LoadingModal from '../../components/Modals/LoadingModal'
import MessageModal from '../../components/Modals/MessageModal'

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
  const [modal, setModal] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  })

  const handleCloseModal = () => {
    setModal({ ...modal, open: false })
  }

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true)
      // Xử lý logic update
      setModal({
        open: true,
        message: 'Profile updated successfully!',
        severity: 'success'
      })
    } catch (error) {
      setModal({
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

      <MessageModal
        open={modal.open}
        onClose={handleCloseModal}
        message={modal.message}
        severity={modal.severity}
      />

      <LoadingModal open={loading} />
    </div>
  )
}

export default ProfileUpdate
