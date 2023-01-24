import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay
} from 'react-native-reanimated';

interface ProgressBarProps {
    progress? : number;
}

export const ProgressBar =({ progress = 0 } : ProgressBarProps )=>{
    const sharedProgress = useSharedValue(progress)
    

    const style = useAnimatedStyle(()=>{
        return { 
            width: `${sharedProgress.value}%`
        }
    });

    useEffect(()=>{
        sharedProgress.value = withDelay(500, withTiming(progress));
    }, [progress])
    
    return (
        <Animated.View className='w-full h-3 rounded-xl bg-zinc-700 mt-4'>
            <View 
            className='h-3 rounded-xl bg-violet-600'
            style={style}
             />
        </Animated.View>
    )
}