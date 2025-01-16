import { Modal, Box } from '@mui/material'

interface MessageModalProps {
    open: boolean
    onClose: () => void
    message: string
    severity: 'success' | 'error'
}

const MessageModal = ({ open, onClose, message, severity }: MessageModalProps) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
                textAlign: 'center'
            }}>
                <h2 id="modal-title" style={{
                    color: severity === 'success' ? '#2e7d32' : '#d32f2f',
                    marginBottom: '16px'
                }}>
                    {severity === 'success' ? 'Success' : 'Error'}
                </h2>
                <p id="modal-description">{message}</p>
                <button
                    onClick={onClose}
                    style={{
                        marginTop: '16px',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        border: 'none',
                        backgroundColor: severity === 'success' ? '#2e7d32' : '#d32f2f',
                        color: 'white',
                        cursor: 'pointer'
                    }}
                >
                    Close
                </button>
            </Box>
        </Modal>
    )
}

export default MessageModal 