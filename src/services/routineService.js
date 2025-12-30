import * as routineRepository from "../repositories/routineRepository.js";
import * as userRepository from "../repositories/userRepository.js";
import * as muscleGroupRepository from "../repositories/muscleGroupRepository.js";
import * as exerciseRepository from "../repositories/exerciseRepository.js";
import { Groq } from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const createRoutine = async (data) => {
  // Aquí se pueden agregar validaciones adicionales si es necesario
  if (!data.name || !data.user_id) {
    throw new Error("El nombre y el ID de usuario son obligatorios");
  }

  return await routineRepository.createRoutine(data);
};

export const getRoutinesByUserId = async (userId) => {
  if (!userId) {
    throw new Error("El ID de usuario es obligatorio");
  }
  return await routineRepository.getRoutinesByUserId(userId);
};

export const generateRoutineAI = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  // Calculate age if not present (though prompt used age)
  const calculateAge = (dob) => {
    if (!dob) return "Desconocida";
    const diff = Date.now() - new Date(dob).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  };
  const userAge = user.date_of_birth
    ? calculateAge(user.date_of_birth)
    : user.age || "Desconocida";

  const prompt = `
    Genera una rutina de ejercicios detallada y personalizada para un usuario con:
    - Peso: ${user.weight || "No especificado"} kg
    - Altura: ${user.height || "No especificado"} cm
    - Edad: ${userAge}
    - Género: ${user.gender || "No especificado"}
    
    Requisitos:
    1. Responde ÚNICAMENTE con un JSON válido.
    2. Los ejercicios deben existir en la API de ExerciseDB (nombres en inglés o español estándar).
    3. Incluye el campo "gif_url" para cada ejercicio si es conocido (simulado o URL real de ExerciseDB).
    4. Estructura del JSON:
    {
      "name": "Nombre de la rutina",
      "description": "Breve descripción",
      "estimated_duration": 60, // minutos
      "level": "Intermedio",
      "goal": "Hipertrofia",
      "days": [
        {
          "day_number": 1, 
          "exercises": [
            {
              "name": "Bench Press",
              "muscle_group": "chest", 
              "description": "Press de banca con barra",
              "gif_url": "https://v2.exercisedb.io/image/...", // URL válida o simulada
              "sets": 4,
              "reps": 10,
              "rest_time": 90, 
              "weight_suggestion": "70% RM",
              "notes": "Mantener espalda pegada"
            }
          ]
        }
      ]
    }
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Eres un entrenador personal experto. Generas rutinas en formato JSON estricto.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "moonshotai/kimi-k2-instruct-0905",
      temperature: 0.5,
      max_completion_tokens: 4096,
      top_p: 1,
      stream: false,
      stop: null,
      response_format: { type: "json_object" },
    });

    const content = chatCompletion.choices[0]?.message?.content;
    if (!content) throw new Error("La IA no generó contenido.");

    let generatedRoutine;
    try {
      generatedRoutine = JSON.parse(content);
    } catch (e) {
      const jsonMatch =
        content.match(/```json\n([\s\S]*?)\n```/) || content.match(/{[\s\S]*}/);
      if (jsonMatch) {
        generatedRoutine = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } else {
        throw new Error("Formato de respuesta inválido");
      }
    }

    const processedDays = [];

    for (const day of generatedRoutine.days) {
      const processedExercises = [];

      for (const ex of day.exercises) {
        let muscleGroup = await muscleGroupRepository.findByName(
          ex.muscle_group
        );
        if (!muscleGroup) {
          muscleGroup = await muscleGroupRepository.create({
            name: ex.muscle_group,
            description: `Grupo muscular ${ex.muscle_group}`,
          });
        }

        let exercise = await exerciseRepository.findByName(ex.name);
        if (!exercise) {
          exercise = await exerciseRepository.create({
            name: ex.name,
            description: ex.description,
            muscle_group_id: muscleGroup.id,
            gif_url: ex.gif_url || null, // Guardar el GIF si viene
          });
        }

        processedExercises.push({
          exercise_id: exercise.id,
          order_position: processedExercises.length + 1,
          sets: ex.sets,
          reps: ex.reps,
          weight: 0,
          rest_time: ex.rest_time,
          notes: ex.notes,
        });
      }
      processedDays.push({
        day_number: day.day_number,
        exercises: processedExercises,
      });
    }

    const routineData = {
      name: generatedRoutine.name,
      description: generatedRoutine.description,
      user_id: userId,
      estimated_duration: generatedRoutine.estimated_duration,
      level: generatedRoutine.level,
      goal: generatedRoutine.goal,
      is_active: true,
      days: processedDays.map((d) => d.day_number),
      exercises: processedDays.flatMap((d) => d.exercises),
    };

    return await routineRepository.createRoutine(routineData);
  } catch (error) {
    console.error("Error generating routine with AI:", error);
    throw new Error("Error al generar la rutina con IA: " + error.message);
  }
};
