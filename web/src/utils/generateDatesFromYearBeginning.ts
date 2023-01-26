import dayjs from 'dayjs';

export const generateDatesFromYearBeginning =()=>{
    const firstDayOfTheYear = dayjs().startOf('year'); // return an dayjs Object
    console.log(firstDayOfTheYear, '55555555555555555')
    const currentDate =  new Date();

    const dates = [];
    let dateToBeCompared = firstDayOfTheYear;

    while(dateToBeCompared.isBefore(currentDate)){
        dates.push(dateToBeCompared.toDate())
        dateToBeCompared = dateToBeCompared.add(1, 'day');
    }

    return dates;
}

