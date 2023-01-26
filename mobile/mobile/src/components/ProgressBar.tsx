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
  
  
  const style = useAnimatedStyle(() => {
    return {
      width: `${sharedProgress.value}%`,
    };
  });
  
        console.log(progress, 'progress sendo passado para o progress bar')
      // console.log(style)
    
      // STYLE is showing undefined, so used the variable `${progress} to style the progress bar
      // instead of using  
      //<View className="w-full h-3 rounded-xl bg-zinc-700 mt-4">
    //   <Animated.View className="h-3 rounded-xl bg-violet-600" style={style} />
    //   </View>


    useEffect(()=>{
        sharedProgress.value = withDelay(500, withTiming(progress));
    }, [progress])
    
    return (
        <Animated.View className='w-full h-3 rounded-xl bg-zinc-700 mt-4'>
            <View 
            className='h-3 rounded-xl bg-violet-600'
            style={{ width: `${progress}%`}}
             />
        </Animated.View>
    )
}