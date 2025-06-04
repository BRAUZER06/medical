import React, { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import dayjs from 'dayjs'
import { getAbsoluteUrl } from '../../utils/getAbsoluteUrl'
import { getFileIcon, getFileType } from '../../utils/getFileIcon'

dayjs.locale('ru')

export const ChatMessages = ({ messages, currentUser, scrollRef }) => {
	return (
		<Box
			sx={{
				flexGrow: 1,
				overflowY: 'auto',
				p: 2,
				display: 'flex',
				flexDirection: 'column',
				gap: 1.5,
				backgroundColor: '#f5f5f5',
			}}
		>
			<PhotoProvider>
				{messages.map(msg => {
					const isCurrentUser = msg.sender?.id === currentUser?.id

					return (
						<Box
							key={msg.id || `${msg.sender?.id}-${msg.created_at}`}
							sx={{
								alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
								backgroundColor: isCurrentUser ? '#1976d2' : '#e0e0e0',
								color: isCurrentUser ? 'white' : 'black',
								px: 2,
								py: 1,
								borderRadius: 2,
								maxWidth: '80%',
								whiteSpace: 'pre-wrap',
							}}
						>
							{msg.message_type === 'text' && (
								<Typography variant='body2' sx={{ wordBreak: 'break-word' }}>
									{msg.content}
								</Typography>
							)}

							{msg.attachments?.map(att => {
								const fileExtension = att.name?.split('.').pop()?.toLowerCase()
								const fileType =
									att.type ||
									(fileExtension ? getFileType(fileExtension) : 'file')

								if (fileType === 'image') {
									return (
										<Box key={att.url} sx={{ mt: 1, cursor: 'pointer' }}>
											<PhotoView src={getAbsoluteUrl(att.url)}>
												<img
													src={getAbsoluteUrl(att.url)}
													alt={att.name}
													style={{
														maxWidth: '100%',
														minHeight: '150px',
														objectFit: 'cover',
														borderRadius: '8px',
														backgroundColor: '#f0f0f0',
													}}
													onClick={e => e.stopPropagation()}
												/>
											</PhotoView>
											<a
												href={getAbsoluteUrl(att.url)}
												download
												style={{ color: isCurrentUser ? 'white' : '#1976d2' }}
											>
												Скачать
											</a>
											<Typography variant='caption' display='block'>
												{att.name}
											</Typography>
										</Box>
									)
								}

								return (
									<Box key={att.url} sx={{ mt: 1 }}>
										<a
											href={getAbsoluteUrl(att.url)}
											download
											style={{ display: 'block', textAlign: 'center' }}
										>
											{getFileIcon(fileExtension || '')}
											<Typography variant='caption' display='block'>
												{att.name}
											</Typography>
										</a>
									</Box>
								)
							})}
							<Typography
								variant='caption'
								sx={{
									display: 'block',
									textAlign: isCurrentUser ? 'right' : 'left',
									mt: 0.5,
									opacity: 0.7,
								}}
							>
								{dayjs(msg.created_at).format('HH:mm · DD MMM')}
							</Typography>
						</Box>
					)
				})}
			</PhotoProvider>
			<div ref={scrollRef} />
		</Box>
	)
}
