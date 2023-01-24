import { View, ActivityIndicator, StyleSheet } from 'react-native';

export const Loading =()=>{
    return (
            <View style={styles.container}>
            <ActivityIndicator color='#7C3AED' size="large" />
            </View>
            )
    
};

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#09090A',
        justifyContent: 'center',
        alignItems: 'center'
        
    }
})

export default Loading;
