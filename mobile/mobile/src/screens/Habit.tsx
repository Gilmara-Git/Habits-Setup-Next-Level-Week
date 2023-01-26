import { View, ScrollView, Text , Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import { BackButton } from "../components/BackButton";
import { ProgressBar } from "../components/ProgressBar";
import { Loading } from '../components/Loading';
import dayjs from "dayjs";
import { CheckBox } from "../components/CheckBox";
import {useState, useEffect } from 'react';
import { api } from '../lib/axios';
import { generateProgressPercentage } from '../utils/generate-progress-percentage';
import { HabitsEmpty } from '../components/HabitsEmpty';
import clsx from 'clsx';

interface HabitProps {
  date: string;
}

interface DayInfoProps {
  completedHabits: string[];
  possibleHabits: {
    id: string;
    title: string;
  }[];
}

export const Habit = () => {
  const route = useRoute();
  const { date } = route.params as HabitProps;

  const parsedDate = dayjs(date); //  convertendo a data que chega como string no parametro da rota
  //https://day.js.org/docs/en/display/format
  const dayOfWeek = parsedDate.format("dddd"); // formatando para o dia da semana escrito por extenso
  const dayAndMonth = parsedDate.format("DD/MM");
  const isDateInPast = parsedDate.endOf('day').isBefore(new Date());
  
  const [loading, setLoading] = useState(true);
  const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null);
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);

  const habitsProgress = dayInfo?.possibleHabits?.length
  ? generateProgressPercentage(
      dayInfo.possibleHabits.length,
      completedHabits.length,
    )
  : 0;




  const fetchHabits = async ()=> {
    try {
      setLoading(true);

      const response = await api.get('/day', { params: { date } });  
      setDayInfo(response.data);
      setCompletedHabits(response.data.completedHabits);
    } catch (error) {

      console.log(error);
      Alert.alert('It was not possible to load the habits information')

    } finally {
      setLoading(false);
    }
  }

   const handleToggleHabits = async (habitId: string)=> {
    try {
      await api.patch(`/habits/${habitId}/toggle`);

      if (completedHabits.includes(habitId)) {
        setCompletedHabits((prevState) =>
          prevState.filter((habit) => habit !== habitId),
        );
      } else {
        setCompletedHabits((prevState) => [...prevState, habitId]);
      }
    } catch (error) {
      console.log(error);
     Alert.alert('It was not possible to update the habit')
      return;
    }
  }

  useEffect(()=>{
    fetchHabits()
  }, [])


  if (loading) {
    return (<Loading />);
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />

        <Text className="mt-6 text-zinc-400 font-semibold lowercase">
          {dayOfWeek}
        </Text>

        <Text className="text-white font-extrabold text-3xl">
          {dayAndMonth}
        </Text>

        <ProgressBar progress={habitsProgress} />

        <View className={clsx('mt-6', { ["opacity-50"]:isDateInPast })}>
     
          {
              dayInfo?.possibleHabits 
              ?
              dayInfo?.possibleHabits.map(habit => (
              <CheckBox
                key={habit.id}
                disabled={isDateInPast }
                onPress={()=>handleToggleHabits(habit.id)}
                title={habit.title}
                checked={completedHabits.includes(habit.id)} /> 
                ))
              
              :
              <HabitsEmpty/>
          }
        </View>

        {isDateInPast && (
          <Text className="text-white mt-10 text-center">
            You can not edit any past habits.
          </Text>
        )}
      </ScrollView>
    </View>
  );
};
