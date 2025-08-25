import React, { useCallback, useEffect, useState } from 'react';
import { Agenda } from 'react-native-calendars';
import moment from 'moment/moment';
import ScheduleAgendaCard from './ScheduleAgendaCard';
import DayAgenda from './DayAgenda';
import EmptyAgendaCard from './EmptyAgendaCard';
import { LocaleConfig } from 'react-native-calendars';

LocaleConfig.locales['id'] = {
	monthNames: [
		'Januari',
		'Februari',
		'Maret',
		'April',
		'Mei',
		'Juni',
		'Juli',
		'Agustus',
		'September',
		'Oktober',
		'Novermber',
		'Desember',
	],
	monthNamesShort: [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'Mei',
		'Jun',
		'Jul',
		'Agu',
		'Sep',
		'Okt',
		'Nov',
		'Déc',
	],
	dayNames: [
		'Minggu',
		'Senin',
		'Selasa',
		'Rabu',
		'Kamis',
		'Jumat',
		'Sabtu',
	],
	dayNamesShort: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
	today: "Hari Ini",
};
LocaleConfig.defaultLocale = 'id';

const CalendarAgenda = ({ items, markedDate, isRefreshing, loadItems }) => {

	const [currentDate, setCurrentDate] = useState(
		{
			year: moment(new Date()).format("YYYY"),
			month: moment(new Date()).format("M"),
			day: moment(new Date()).format("D"),
			timestamp: moment(new Date()).format("X"),
			dateString: moment(new Date()).format("YYYY-MM-DD")
		}
	)

	const onRefresh = useCallback(() => {
		loadItems(currentDate)
	}, [currentDate])

	const renderItem = (item) => <ScheduleAgendaCard item={item} />

	const renderEmptyDate = (_, index) => <EmptyAgendaCard key={`empty-${index}`} />

	const renderDay = (date, item) => <DayAgenda item={item} date={date} />

	return (
		<Agenda
			items={items}
			loadItemsForMonth={(data) => {loadItems(data)}}
			renderItem={renderItem}
			renderEmptyDate={renderEmptyDate}
			renderDay={renderDay}
			refreshing={isRefreshing}
			selected={currentDate.dateString}
			initialNumToRender={10}
			markedDates={markedDate}
			showClosingKnob
			onDayPress={day => {
				const data = day
				setCurrentDate(data)
			}}
			firstDay={1}
			onRefresh={onRefresh}
			hideExtraDays
			theme={{
				indicatorColor: "#D8261D",
				monthTextColor: "black",
				agendaKnobColor: "#D8261D"
			}}
		/>
	);
};

export default CalendarAgenda;