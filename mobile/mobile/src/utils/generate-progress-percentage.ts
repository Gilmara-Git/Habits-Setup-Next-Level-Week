export const generateProgressPercentage = (total: number, completed: number)=>{
  console.log( total, '/', completed)
    return Math.round((completed/ total) * 100)
  
  }