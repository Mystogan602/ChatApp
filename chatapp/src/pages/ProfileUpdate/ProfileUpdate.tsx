import { useEffect, useState } from 'react'
import { CircularProgress } from '@mui/material'
import assets from '../../assets/assets'
import './ProfileUpdate.scss'
import { useForm } from 'react-hook-form'
import LoadingModal from '../../components/Modals/LoadingModal'
import MessageModal from '../../components/Modals/MessageModal'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../../config/firebase'
import { getDoc, updateDoc } from 'firebase/firestore'
import { doc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { uploadFile } from '../../lib/uploadFile'

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

  const navigate = useNavigate()

  const [avatar, setAvatar] = useState<File | null>(null)
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [uid, setUid] = useState('')
  const [prevImage, setPrevImage] = useState('')

  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  })

  const uploadAvatar = async (file: File | null): Promise<string | null> => {
    if (!file) return null;
    try {
      return await uploadFile(file);
    } catch (error) {
      console.error('Avatar upload error:', error);
      throw new Error('Failed to upload avatar');
    }
  };

  const updateUserProfile = async (data: FormValues, avatarUrl: string | null) => {
    try {
      const docRef = doc(db, 'users', uid);
      await updateDoc(docRef, {
        ...(avatarUrl && { avatar: avatarUrl }),
        name: data.name,
        bio: data.bio
      });
    } catch (error) {
      console.error('Profile update error:', error);
      throw new Error('Failed to update profile data');
    }
  };

  const profileUpdate = async (data: FormValues) => {
    if (!prevImage && !avatar) {
      throw new Error('Please upload an avatar');
    }

    // Upload new avatar if exists
    const newAvatarUrl = await uploadAvatar(avatar);
    const finalAvatarUrl = newAvatarUrl || prevImage;

    // Update profile with new data
    await updateUserProfile(data, finalAvatarUrl);

    // Update local state
    if (newAvatarUrl) {
      setPrevImage(newAvatarUrl);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid)
        const docRef = doc(db, 'users', user.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.data()?.name) {
          setName(docSnap.data()?.name)
        }
        if (docSnap.data()?.bio) {
          setBio(docSnap.data()?.bio)
        }
        if (docSnap.data()?.avatar) {
          setPrevImage(docSnap.data()?.avatar)
        }
      } else {
        navigate('/')
      }
    })
  }, [])

  const handleCloseModal = () => {
    setModal({ ...modal, open: false })
  }

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      await profileUpdate(data);
      setModal({
        open: true,
        message: 'Profile updated successfully!',
        severity: 'success'
      });
    } catch (error) {
      setModal({
        open: true,
        message: error instanceof Error ? error.message : 'An error occurred',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

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
            {...register('name', {
              required: 'Name is required',
              onChange: (e) => setName(e.target.value)
            })}
            value={name}
          />
          {errors.name && <span className="error">{errors.name.message}</span>}

          <textarea
            placeholder='Bio'
            {...register('bio', {
              required: 'Bio is required',
              onChange: (e) => setBio(e.target.value)
            })}
            value={bio}
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
