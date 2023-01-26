import * as Checkbox from '@radix-ui/react-checkbox'
import { Check } from "phosphor-react";
import { useEffect, useState } from 'react'; 
import { api } from '../lib/axios';
import dayjs from 'dayjs';
import clsx from 'clsx';

interface HabitsListProps {
    date: Date
    onHandleCompleted: (amountCompleted : number )=> void
}

type HabitsInfo  = {
    possibleHabits: Array<{
        id: string,
        title: string,
        created_at: string
    }>,
    completedHabits: string[]
}

export const HabitsList =({date, onHandleCompleted}: HabitsListProps)=>{
    const [ habitsInfo, setHabitsInfo ] = useState<HabitsInfo>();
  
    useEffect(()=>{
        api.get('day', {
            params: { 
                date: date.toISOString()
            }
        }).then(response => setHabitsInfo(response.data)
        )
    }, [])

    const isDateInThePast = dayjs(date).endOf('day').isBefore(new Date) // retorna booleano
  
    const toggleHabitHandle = async(habitId : string)=>{

        try{
            await api.patch(`/habits/${habitId}/toggle`)
            // verificar se o habito ha foi ou nao marcado por completo
            const isHabitAlreadyCompleted = habitsInfo?.completedHabits.includes(habitId);
            
            let updatedCompletedHabits :string[] = [];

            if(isHabitAlreadyCompleted){
                updatedCompletedHabits = habitsInfo!.completedHabits.filter(id => id !== habitId);
                
            }else {
                updatedCompletedHabits = [...habitsInfo!.completedHabits, habitId]
                
            }

            setHabitsInfo({ 
                possibleHabits: habitsInfo!.possibleHabits,
                completedHabits: updatedCompletedHabits
            })

            onHandleCompleted(updatedCompletedHabits.length)

        }catch(e){
            console.log(e)
        }



  }



    return ( <div className='mt-6 flex flex-col gap-3'>
        {
            habitsInfo?.possibleHabits.map(habit=>{
                return   (
                <Checkbox.Root
                key={habit.id}
                onCheckedChange={()=>toggleHabitHandle(habit.id)}
                disabled={isDateInThePast}
                defaultChecked={habitsInfo.completedHabits.includes(habit.id)}
                className="flex items-center gap-3 group focus:outline-none disabled:cursor-not-allowed"
            >
                <div 
                className='h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors group-focus:ring-2 group-focus:violet-600 group-focus:ring-offset-2 group-focus:ring-offset-background'>
                <Checkbox.Indicator>
                    <Check size={20} className='text-white'/>
                </Checkbox.Indicator>
                    
                </div>
        
                <span className="font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400">
                    {habit.title}
                </span>
            </Checkbox.Root>)
                
            })
        }
  
  </div>)
}