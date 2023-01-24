import { prisma } from "./lib/prisma";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import dayjs from "dayjs";

export const appRoutes = async (app: FastifyInstance) => {
  app.post("/habits", async (request) => {
    // request.body, request.query, request.params
    console.log(request.body, 'request.body')
    const createHabitBody = z.object({
      title: z.string(),
      weekDays: z.array(
        z.number().min(0).max(6)),
      //[0,1,2,3,4,5,6] Sunday to Saturday
    });

    const { title, weekDays } = createHabitBody.parse(request.body);
    const today = dayjs().startOf("day").toDate();
    // startOf() transforma a hora , minutes, em 00:00:00
    //toDate() metodo do js para transformar em date

    try {
      await prisma.habit.create({
        data: {
          title,
          created_at: today,
          weekDays: {
            create: weekDays.map((weekDay) => {
              return {
                week_day: weekDay,
              };
            }),
          },
        },
      });
    } catch (e) {
      console.error(e);
    }
  });

  app.get("/day", async (request) => {
    const getDayParams = z.object({
      date: z.coerce.date(),
      //localhost://3333/day?date=2023-01-18T05:00:00.000z
      // fronted esta enviando uma string e queremos que converta-la num date (coerse faz isso)
    });

    const { date } = getDayParams.parse(request.query);
    const parsedDate = dayjs(date).startOf("day");
    const weekDay = parsedDate.get("day");

    //todos habitos possiveis ate a data enviada pelo frontend
    //lte : less than or equal
    // podemos fazer where encadeado que o prisma fara o JOIN automaticamente
    try {
      const possibleHabits = await prisma.habit.findMany({
        where: {
          created_at: {
            lte: date,
          },
          weekDays: {
            some: {
              week_day: weekDay,
            },
          },
        },
      });

      // habitos que ja foram completados
      const day = await prisma.day.findUnique({
        where: {
          date: parsedDate.toDate(),
        },
        include: {
          dayHabits: true,
        },
      });

      const completedHabits = day?.dayHabits.map((dayHabit) => {
        return dayHabit.habit_id;
      })??[]

      return {
        possibleHabits,
        completedHabits,
      };
    } catch (e) {
      console.error(e);
    }
  });

  // toggle completou ou nao o habito na data especifica
  app.patch('/habits/:id/toggle', async (request)=>{
    const toggleHabitParams = z.object({
      id: z.string().uuid(),  
    })


    const { id } = toggleHabitParams.parse(request.params)
    const today = dayjs().startOf('day').toDate()
    try{
      let day = await prisma.day.findUnique({
        where:{
          date: today
        }
      })

      if(!day){
        day = await prisma.day.create({
          data:{
            date: today
          }
        })
      }
      
      // verificando se o usuario ja havia marcado o habito por complete neste dia
      const dayHabitComplete  = await prisma.dayHabit.findUnique({
        where:{
          day_id_habit_id: {
            day_id: day.id,
            habit_id: id
          }
        }
      })

      if(dayHabitComplete){
        // remover a marcacao
        await prisma.dayHabit.delete({
          where:{
            id: dayHabitComplete.id
          }
        })
      }else{
        //adicionar a marcacao
        // completar habito
      await prisma.dayHabit.create({
        data:{
          day_id: day.id,
          habit_id: id 

        }
      })

      }

      

    }catch(e){
      console.error(e)
    }
  })

  app.get('/summary', async()=>{
    // Codigo RAW
    //retornar uma lista de objetos com dados especificos[]
    const summary = await prisma.$queryRaw`
    SELECT 
    D.id, 
    D.date,
    (
      SELECT 
        cast(count(*) as float)
      FROM day_habits DH 
      WHERE DH.day_id = D.id
     ) as  completed,
    
     (
      SELECT
      cast(count(*) as float)
      FROM habit_week_days HWD
      JOIN habits H
      on H.id = HWD.habit_id
      WHERE
      HWD.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int)
      AND H.created_at <= D.date
       ) as amount

    FROM days D`

  return summary;
  })

};
