import { Modal, Box, CircularProgress } from '@mui/material'

interface LoadingModalProps {
    open: boolean
}

const LoadingModal = ({ open }: LoadingModalProps) => {
    return (
        <Modal
            open={open}
            aria-labelledby="loading-modal"
            closeAfterTransition
            disableAutoFocus
            disableEscapeKeyDown
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2
            }}>
                <CircularProgress size={40} />
                <p>Loading...</p>
            </Box>
        </Modal>
    )
}

export default LoadingModal 