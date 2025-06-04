
import { Autocomplete, Chip, TextField } from '@mui/material'
import { SPECIALIZATION_OPTIONS } from '../../api/profile'

interface SpecializationsSelectProps {
	value: string[]
	onChange: (value: string[]) => void
}

export const SpecializationsSelect = ({
	value,
	onChange,
}: SpecializationsSelectProps) => {
	return (
		<Autocomplete
			multiple
			options={SPECIALIZATION_OPTIONS}
			getOptionLabel={option => option.label}
			value={SPECIALIZATION_OPTIONS.filter(opt => value.includes(opt.value))}
			onChange={(_, newValue) => {
				onChange(newValue.map(item => item.value))
			}}
			renderInput={params => (
				<TextField
					{...params}
					label='Специализации'
					placeholder='Выберите специализации...'
				/>
			)}
			renderTags={(value, getTagProps) =>
				value.map((option, index) => (
					<Chip
						label={option.label}
						{...getTagProps({ index })}
						key={option.value}
					/>
				))
			}
			sx={{ mt: 1 }}
		/>
	)
}
