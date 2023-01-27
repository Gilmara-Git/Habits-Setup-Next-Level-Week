import dayjs from 'dayjs';

export const generateDatesFromYearBeginning =()=>{
    const firstDayOfTheYear = dayjs().startOf('year'); // return an dayjs Object
  
    const currentDate =  new Date();

    const dates = [];
    let dateToBeCompared = firstDayOfTheYear;

    while(dateToBeCompared.isBefore(currentDate)){
        dates.push(dateToBeCompared.toDate())
        dateToBeCompared = dateToBeCompared.add(1, 'day');
    }

    return dates;
}

