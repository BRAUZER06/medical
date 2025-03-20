import React from 'react'
import styles from './BigTitle.module.scss'

interface BigTitleProps {
	title: string 
	className?: string 
}

const BigTitle: React.FC<BigTitleProps> = ({ title, className = '' }) => {
	return <h2 className={`${styles.title} ${className}`}>{title}</h2>
}

export default BigTitle
