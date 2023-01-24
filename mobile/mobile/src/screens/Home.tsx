import { Loading } from '../components/Loading';
import { View, Text, ScrollView, Alert  } from "react-native";
import { HabitDay } from "../components/HabitDay";
import { Header } from "../components/Header";
import { DAY_SIZE } from '../components/HabitDay';
import { generateDatesFromYearBeginning } from '../utils/generateDatesFromYearBeginning';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { api } from '../lib/axios';
import { useState , useCallback} from 'react';
import dayjs from 'dayjs';


const summaryDates = generateDatesFromYearBeginning();
const minimumSummaryDates = 18 * 5 // 18 weeks as a minimum to be shown on the screen
const amountOfDatesToBeFilled = minimumSummaryDates - summaryDates.length;

type SummaryProps = Array<{
  id:string;
  date: string;
  amount: number;
  completed: number;
}>


const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

export const Home = () => {
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<SummaryProps | null>(null)

  const  { navigate }  = useNavigation();


 const fetchData = async ()=>  {
    try {
      setLoading(true)
      const response = await api.get('/summary');
      setSummary(response.data)
    
     
    } catch (error) {
      Alert.alert('It was not possible to load habits')
  
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(useCallback(()=>{
    fetchData();
  }, []));
 
if(loading){
  return <Loading/>
}

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <Header />
      
      <View className="flex-row mt-6 mb-2">
      {weekDays.map((weekday, index) => {
        return (
          <Text
            className="text-zinc-400 text-xl font-bold text-center mx-1"
            key={`${weekday}-${index}`}
            style={{width: DAY_SIZE}}
          >
            {weekday}
          </Text>
        );
      })}
     
      </View>

    <ScrollView contentContainerStyle={{ paddingBottom: 100}}
    showsVerticalScrollIndicator={false}
    >
      { summary && 
            
            <View className='flex-row flex-wrap'>
            {summaryDates.map((date)=>{
              const dayWithHabits = summary?.find(day=>{ 
                return dayjs(date).isSame(day.date, 'day')});

              return (
              <HabitDay 
              key={date.toISOString()} 
              date={date}
              amountOfHabits={dayWithHabits?.amount}
              amountCompleted={dayWithHabits?.completed}
              onPress={()=>navigate('habit', {date: date.toISOString() } )}
              />)
            })}

                
          { amountOfDatesToBeFilled > 0 && Array.from({length: amountOfDatesToBeFilled})
                .map((_, index) => {
                  return <View key={index} className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                  style={{ width:DAY_SIZE, height: DAY_SIZE }}  />
                })
                }

        </View>
      
      }
      </ScrollView>
    </View>
  );
};
