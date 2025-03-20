import React, { useState } from 'react'
import { Tabs, Tab } from '@mui/material'

const CustomTabs = ({ tabs }) => {
	const [value, setValue] = useState(0)

	const handleChange = (event, newValue) => {
		setValue(newValue)
	}

	return (
		<Tabs value={value} onChange={handleChange}>
			{tabs.map((tab, index) => (
				<Tab key={index} label={tab.label} />
			))}
		</Tabs>
	)
}

export default CustomTabs
