import { View, TouchableOpacity, Text } from "react-native";
import Logo from "../assets/logo.svg"; // usando o svg como componente
import colors from 'tailwindcss/colors';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';



export const Header = () => {

  const  { navigate } = useNavigation();
  const navigationHandler =()=>{
    navigate('new')
  }

  return (
    <View className='w-full flex-row items-center justify-between'>
      <Logo /> 
      <TouchableOpacity
      onPress={navigationHandler}
        activeOpacity={0.6}
        className='flex-row items-center border border-violet-500 rounded-lg h-11 px-4' 
        >
            <Feather name="plus" size={20} color={colors.violet[500]} />
        <Text className="text-white ml-3 font-semibold text-base">New</Text>
      </TouchableOpacity>
    </View>
  );
};
