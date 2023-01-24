import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useState } from "react";
import { BackButton } from "../components/BackButton";
import { CheckBox } from "../components/CheckBox";
import { Feather } from "@expo/vector-icons";
import colors from "tailwindcss/colors";
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

export const New = () => {
  const [weekdays, setWeekDays] = useState<number[]>([]);
  const [title, setTitle] = useState("");

  const handleToggleWeekDay = (weekdayIndex: number) => {
    if (weekdays.includes(weekdayIndex)) {
      // desmarcar
      setWeekDays((prevState) =>
        prevState.filter((weekday) => weekday !== weekdayIndex)
      );
    } else {
      // marcar
      setWeekDays((prevState) => [...prevState, weekdayIndex]);
    }
  };

  const handleCreateNewHabit = async () => {
    try {
      if (!title.trim() || weekdays.length === 0) {
        return Alert.alert(
          "Novo hábito",
          "Informe o nome do hábito e escolha o período."
        );
      }

      await api.post("/habits", { title, weekdays });

      setTitle("");
      setWeekDays([]);

      Alert.alert("Novo hábito", "Hábito criado com sucesso!");
    } catch (error) {
      console.log(error);
      Alert.alert("Ops", "Não foi possível criar um novo hábito.");
    }
  };

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />
        <Text className="mt-6 text-white text-3xl font-extrabold">
          Create a habit
        </Text>

        <Text className="mt-6 text-white text-base font-semibold">
          What would you compromise ?
        </Text>

        <TextInput
          className="h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600"
          placeholder="ex: Drink a gallon of water, Sleep well, jog"
          placeholderTextColor={colors.zinc[400]}
          onChangeText={setTitle}
          value={title}
        />

        <Text className="font-semibold mt-4 mb-3 text-white text-base">
          How often ?
        </Text>

        {availableWeekDays.map((weekday, index) => {
          return (
            <CheckBox
              onPress={() => handleToggleWeekDay(index)}
              key={weekday}
              title={weekday}
              checked={weekdays.includes(index)}
            />
          );
        })}

        <TouchableOpacity
          activeOpacity={0.7}
          className="w-full h-14 flex-row items-center bg-green-600 rounded-md mt-6 justify-center"
          onPress={handleCreateNewHabit}
        >
          <Feather name="check" size={20} color={colors.white} />
          <Text className="font-semibold text-base text-white ml-2">
            Confirm
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
