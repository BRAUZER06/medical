import React from 'react'
import { Button as MUIButton } from '@mui/material'

const Button = ({ children, ...props }) => {
	return (
		<MUIButton variant='contained' {...props}>
			{children}
		</MUIButton>
	)
}

export default Button
