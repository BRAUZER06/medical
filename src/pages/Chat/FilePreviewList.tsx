import { Box, Typography, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { getFileIcon } from '../../utils/getFileIcon'

export const FilePreviewList = ({ files, onRemove }: any) => {
	return (
		<Box
			sx={{
				p: 1,
				borderTop: '1px solid #eee',
				backgroundColor: '#f9f9f9',
				display: 'flex',
				flexWrap: 'wrap',
				gap: 1,
				overflowX: 'auto',
				height: '200px',
			}}
		>
			{files.map((file: File, index: number) => (
				<Box
					key={index}
					sx={{
						position: 'relative',
						minWidth: 100,
						p: 1,
						border: '1px solid #ddd',
						borderRadius: 1,
						backgroundColor: 'white',
						maxWidth: '80px',
					}}
				>
					{file.type.startsWith('image/') ? (
						<img
							src={URL.createObjectURL(file)}
							alt={file.name}
							style={{
								width: '100%',
								height: 60,
								objectFit: 'cover',
								borderRadius: 4,
							}}
						/>
					) : (
						<Box sx={{ textAlign: 'center' }}>
							{getFileIcon(file.name.split('.').pop() || '')}
						</Box>
					)}
					<Typography variant='caption' sx={{ mt: 0.5 }}>
						{file.name}
					</Typography>
					<IconButton
						size='small'
						sx={{
							position: 'absolute',
							top: -8,
							right: -8,
							backgroundColor: 'white',
							boxShadow: 1,
							'&:hover': { backgroundColor: '#f5f5f5' },
						}}
						onClick={() => onRemove(index)}
					>
						<CloseIcon fontSize='small' />
					</IconButton>
				</Box>
			))}
		</Box>
	)
}
