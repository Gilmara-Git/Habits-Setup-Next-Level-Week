import { Check } from "phosphor-react";
import * as Checkbox from "@radix-ui/react-checkbox";
import { FormEvent, useState } from 'react';
import { api } from "../lib/axios";

const availableWeekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const NewHabitForm = () => {

const [title, setTitle] = useState('');
const [ weekdays, setWeekdays] = useState<number[]>([]);

const  createNewHabit = async (event: FormEvent)=> {
  event.preventDefault()

  if (!title || weekdays.length === 0) {
    return
  }
  await api.post('habits', {
    title,
    weekdays
  })

  setTitle('')
  setWeekdays([])

  alert('Hábito criado com sucesso!')
}


const toggleWeekdayHandler =(weekday: number)=>{
    if(weekdays.includes(weekday)){ 
    // retirar
    setWeekdays((prevState)=>prevState.filter((item)=> item !== weekday ))
  }else{
    //adiconar
    setWeekdays((prevState)=> [...prevState, weekday])

  }
}

// const createNewHabit = async (event : FormEvent)=>{ 
//     event.preventDefault();
//     if(!title || weekdays.length === 0 ){
//       return
//     }
    
//     try{
//       await  api.post('habits', { 
//          title,
//          weekdays
//        })
   
//        alert('Habito criado com sucesso')

//     }catch(e){ console.error(e)}
// }

  return (
    <form 
        onSubmit={createNewHabit}
        className="w-full flex flex-col mt-6">
      <label htmlFor="title" className="font-semibold leading-tight">
        What new habit would be your commitment ?
      </label>

      <input
        className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:violet-600 focus:ring-offset-2 focus:ring-offset-zinc-900"
        id="title"
        type="text"
        placeholder="ex: Exercise, sleep well, study, meditate, jog"
        autoFocus
        onChange={(event)=>setTitle(event.target.value)}
        value={title}
      />

      <label htmlFor="title" className="font-semibold leading-tight mt-4">
        How often ?
      </label>

      <div className="flex flex-col gap-2 mt-3 ">
        {availableWeekDays.map((weekday, index) => {
          return (
            <Checkbox.Root 
            checked={weekdays.includes(index)}
            onCheckedChange={()=>toggleWeekdayHandler(index)}
            className="flex items-center gap-3 group focus:outline-none">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors group-focus:ring-2 group-focus:violet-600 group-focus:ring-offset-2 group-focus:ring-offset-background">
                <Checkbox.Indicator>
                  <Check size={20} className="text-white" />
                </Checkbox.Indicator>
              </div>

              <span className="text-white leading-tight">{weekday}</span>
            </Checkbox.Root>
          );
        })}
      </div>

      <button
        type="submit"
        className="mt-6 rounded-lg p-4 flex items-center gap-3 font-semibold bg-green-600 justify-center hover:bg-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-zinc-900"
      >
        <Check size={20} weight="bold" />
        Confirm
      </button>
    </form>
  );
};
