import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import { generateDatesFromYearBeginning } from "../utils/generateDatesFromYearBeginning";
import { HabitDay } from "./HabitDay";

const weekdays = ["S", "M", "T", "W", "T", "F", "S"];
const summaryDates = generateDatesFromYearBeginning();
const minimumSummaryDates = 18 * 7 // 18 weeks as a minimum to be shown on the screen
const amountOfDatesToBeFilled = minimumSummaryDates - summaryDates.length;


type SummaryProps = {
  id: string;
  date: string;
  completed: number;
  amount: number
}[]

export const SummaryTable = () => {
  const [ summary, setSummary ] = useState<SummaryProps>([]);


useEffect(()=>{
  api.get('summary')
  .then(response=>setSummary(response.data))
}, [])

  return (
    <div className="w-full flex">
      <div className="grid grid-rows-7 grid-flow-row gap-3">
        {weekdays.map((weekday, index) => {
          return (
            <div
              key={`${weekday}-${index}`}
              className="text-zinc-400 text-xl h-10 w-10 flex items-center justify-center font-bold"
            >
              {weekday}
            </div>
          );
        })}
      </div>

      <div className="grid grid-rows-7 grid-flow-col gap-3">
        { summary.length > 0 && summaryDates.map(summaryDate =>{
       
          const daysInSummary = summary.find(day=> {
            return dayjs(summaryDate).isSame(day.date, 'day')
          })
          return (
          <HabitDay 
            key={summaryDate.toString()}
            date={summaryDate}
            amount={daysInSummary?.amount} 
            defaultCompleted={daysInSummary?.completed} 
          />)
        })}

        { 
        
        amountOfDatesToBeFilled > 0 && Array.from({length: amountOfDatesToBeFilled})
        .map((_, index)=>{
          return <div 
          key={index} 
          className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded lg opacity-40 cursor-not-allowed">
            
          </div>
        })
        
        }
      </div>
    </div>
  );
};
