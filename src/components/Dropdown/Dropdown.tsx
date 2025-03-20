import React from 'react'
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material'

const Dropdown = ({ label, options, value, onChange }) => {
	return (
		<FormControl fullWidth>
			<InputLabel>{label}</InputLabel>
			<Select value={value} onChange={onChange} label={label}>
				{options.map((option, index) => (
					<MenuItem key={index} value={option.value}>
						{option.label}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	)
}

export default Dropdown
