import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_KEY,
});

/**
 * Calcula la edad a partir de la fecha de nacimiento
 */
const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

/**
 * Genera una rutina personalizada usando IA basándose en el perfil del usuario
 * @param {Object} userProfile - Perfil del usuario (weight, height, date_of_birth, gender, goal)
 * @param {Array} exercises - Lista de ejercicios disponibles
 * @returns {Object} - Rutina generada por la IA
 */
export const generateRoutineWithAI = async (userProfile, exercises) => {
  const age = calculateAge(userProfile.date_of_birth);
  
  const exerciseList = exercises.map((ex) => ({
    id: ex.id,
    name: ex.name,
    muscle_group_id: ex.muscle_group_id,
  }));

  const prompt = `Eres un entrenador personal profesional. Genera una rutina de ejercicios personalizada basándote en el siguiente perfil de usuario:

- Peso: ${userProfile.weight || "No especificado"} kg
- Altura: ${userProfile.height || "No especificado"} cm
- Edad: ${age || "No especificado"} años
- Género: ${userProfile.gender || "No especificado"}
- Objetivo: ${userProfile.goal || "General fitness"}

Ejercicios disponibles:
${JSON.stringify(exerciseList, null, 2)}

Genera una rutina semanal completa. Para cada ejercicio incluye: sets, reps, rest_time (en segundos), y notes opcionales.

IMPORTANTE: Responde ÚNICAMENTE con un JSON válido con la siguiente estructura exacta, sin texto adicional:
{
  "name": "Nombre de la rutina",
  "description": "Descripción breve de la rutina",
  "estimated_duration": 60,
  "level": "principiante|intermedio|avanzado",
  "goal": "objetivo de la rutina",
  "days": [1, 2, 3],
  "exercises": [
    {
      "exercise_id": "uuid del ejercicio de la lista",
      "order_position": 1,
      "sets": 3,
      "reps": 12,
      "rest_time": 60,
      "notes": "Nota opcional"
    }
  ]
}

Los días son: 1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves, 5=Viernes, 6=Sábado, 7=Domingo.
SOLO usa exercise_id de los ejercicios proporcionados en la lista.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0]?.message?.content;
    
    if (!responseText) {
      throw new Error("No se recibió respuesta de la IA");
    }

    // Extraer JSON de la respuesta
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("La respuesta de la IA no contiene un JSON válido");
    }

    const routineData = JSON.parse(jsonMatch[0]);
    
    // Validar que los exercise_id existan en la lista de ejercicios
    const validExerciseIds = new Set(exercises.map((ex) => ex.id));
    routineData.exercises = routineData.exercises.filter((ex) =>
      validExerciseIds.has(ex.exercise_id)
    );

    if (routineData.exercises.length === 0) {
      throw new Error("La IA no generó ejercicios válidos");
    }

    return routineData;
  } catch (error) {
    console.error("Error al generar rutina con IA:", error);
    throw new Error(`Error al generar rutina con IA: ${error.message}`);
  }
};
