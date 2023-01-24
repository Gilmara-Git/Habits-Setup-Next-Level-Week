import { useNavigation } from '@react-navigation/native';
import { Text } from 'react-native';

export const HabitsEmpty=()=> {
  const { navigate } = useNavigation();

  return (
    <Text className="text-zinc-400 text-base">
      You are not monitoring any habit yet{' '} 
    
      <Text
        className="text-violet-400 text-base underline active:text-violet-500"
        onPress={() => navigate('new')}
      >
        Register one.
      </Text>
    </Text>
  );
}