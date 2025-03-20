import React from 'react'
import styles from './PopularTopics.module.scss'
import BigTitle from '../../../../components/BigTitle/BigTitle'

interface Topic {
	id: number
	title: string
	icon: string 
}

const testIcon1 =
	'https://avatars.mds.yandex.net/get-med/144970/20180305_3_telemed_topic_small_bitter_taste_2.0/orig'
const testIcon2 =
	'https://avatars.mds.yandex.net/get-med/144649/20180305_3_telemed_topic_small_lumbar_region_pain_2.0/orig'
const testIcon3 =
	'https://avatars.mds.yandex.net/get-med/144970/20180305_3_telemed_topic_small_cold_2.0/orig'

const topics: Topic[] = [
	{ id: 1, title: 'Боль в горле', icon: testIcon1 },
	{ id: 2, title: 'Последствия травм', icon: testIcon2 },
	{ id: 3, title: 'Акне (угревая сыпь)', icon: testIcon3 },
	{ id: 4, title: 'Головная боль', icon: testIcon1 },
	{ id: 5, title: 'Простуда', icon: testIcon2 },
	{ id: 6, title: 'Боль в суставах', icon: testIcon3 },
	{ id: 7, title: 'Повреждения связок и суставов после травм', icon: testIcon1 },
	{ id: 8, title: 'Аллергические реакции на лекарства', icon: testIcon2 },
	{ id: 9, title: 'Воспаление горла и его лечение', icon: testIcon3 },
	{ id: 10, title: 'Хроническая усталость и её последствия', icon: testIcon1 },
	{ id: 11, title: 'Проблемы с пищеварением', icon: testIcon2 },
	{
		id: 12,
		title: 'Профилактика сезонных простудных заболеваний',
		icon: testIcon3,
	},
]


export default function PopularTopics() {
	return (
		<div className={styles.popularTopics}>
		
			<BigTitle title='Популярные темы' className={styles.customTitle} />{' '}
			<div className={styles.topicList}>
				{topics.map(topic => (
					<div key={topic.id} className={styles.topicCard}>
						<img src={topic.icon} alt={topic.title} className={styles.icon} />
						<p className={styles.topicTitle}>{topic.title}</p>
					</div>
				))}
			</div>
		</div>
	)
}
