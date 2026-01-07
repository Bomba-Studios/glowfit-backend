import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
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
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
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

  // Formatear los días de entrenamiento del usuario
  const dayNames = {
    1: "Lunes",
    2: "Martes",
    3: "Miércoles",
    4: "Jueves",
    5: "Viernes",
    6: "Sábado",
    7: "Domingo",
  };

  const trainingDays =
    userProfile.user_training_days?.map((td) => td.day_id) || [];
  const trainingDaysFormatted =
    trainingDays.length > 0
      ? trainingDays.map((dayId) => `${dayId} (${dayNames[dayId]})`).join(", ")
      : "No especificado";

  const prompt = `Eres un entrenador personal profesional certificado con experiencia en periodización del entrenamiento. Genera un plan de entrenamiento completo y personalizado basándote en el siguiente perfil de usuario:

PERFIL DEL USUARIO:
- Peso: ${userProfile.weight || "No especificado"} kg
- Altura: ${userProfile.height || "No especificado"} cm
- Edad: ${age || "No especificado"} años
- Género: ${userProfile.gender || "No especificado"}
- Objetivo: ${userProfile.goal || "General fitness"}
- Tiene discapacidad: ${
    userProfile.has_disability === true
      ? "Sí"
      : userProfile.has_disability === false
      ? "No"
      : "No especificado"
  }
- Descripción de discapacidad: ${
    userProfile.disability_description || "No especificado"
  }
- Días disponibles para entrenar: ${trainingDaysFormatted}

INSTRUCCIONES IMPORTANTES:

1. SEGURIDAD Y ADAPTACIONES:
   - Si el usuario tiene alguna discapacidad, adapta TODOS los ejercicios para que sean seguros y apropiados según la descripción proporcionada
   - Evita ejercicios que puedan ser contraproducentes o peligrosos para su condición
   - Sugiere modificaciones o ejercicios alternativos cuando sea necesario

2. ESTRUCTURA DEL PLAN:
   ${
     trainingDays.length > 0
       ? `- Debes crear UNA RUTINA DIFERENTE para CADA UNO de los siguientes días: ${trainingDaysFormatted}
   - Cada rutina debe enfocarse en grupos musculares diferentes para permitir recuperación adecuada
   - Distribuye los grupos musculares de forma balanceada a lo largo de la semana
   - Por ejemplo: Si hay 3 días (Lunes, Miércoles, Viernes), podrías hacer:
     * Lunes: Pecho, hombros y tríceps
     * Miércoles: Piernas y abdomen
     * Viernes: Espalda, bíceps y core`
       : "- Genera rutinas para los días que consideres apropiados según el objetivo del usuario"
   }

3. EJERCICIOS DISPONIBLES:
${JSON.stringify(exerciseList, null, 2)}

4. PERSONALIZACIÓN POR DÍA:
   - Cada rutina debe tener entre 6-10 ejercicios adaptados al nivel del usuario
   - Varía la intensidad, volumen y ejercicios según el día de la semana
   - Considera el principio de especificidad según el objetivo del usuario (${
     userProfile.goal || "General fitness"
   })
   - Ajusta series, repeticiones y tiempos de descanso según:
     * Edad del usuario: ${age || "No especificado"} años
     * Nivel estimado: Considera el perfil completo
     * Objetivo: ${userProfile.goal || "General fitness"}

5. PARÁMETROS DE ENTRENAMIENTO:
   - Sets: 2-5 series según el nivel (principiante: 2-3, intermedio: 3-4, avanzado: 4-5)
   - Reps: Varía según objetivo (fuerza: 4-6, hipertrofia: 8-12, resistencia: 15-20)
   - Rest_time: Ajusta según tipo de ejercicio (compuestos: 90-180 seg, aislamiento: 45-90 seg)
   - Estimated_duration: Calcula tiempo real (ejercicios + descansos + calentamiento)

IMPORTANTE: Responde ÚNICAMENTE con un JSON válido con la siguiente estructura exacta, sin texto adicional antes o después:
{
  "routines": [
    {
      "name": "Nombre descriptivo de la rutina para este día (ej: 'Rutina Lunes - Pecho y Tríceps')",
      "description": "Descripción breve y motivadora de la rutina del día, mencionando grupos musculares trabajados",
      "estimated_duration": 60,
      "level": "principiante|intermedio|avanzado",
      "goal": "${userProfile.goal || "General fitness"}",
      "day": 1,
      "exercises": [
        {
          "exercise_id": "uuid del ejercicio de la lista",
          "order_position": 1,
          "sets": 3,
          "reps": 12,
          "rest_time": 60,
          "notes": "Nota con consejos de ejecución, adaptaciones o motivación"
        }
      ]
    }
  ]
}

RECORDATORIO FINAL:
- Los días son: 1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves, 5=Viernes, 6=Sábado, 7=Domingo
- Cada objeto en el array "routines" debe tener un "day" ÚNICO (no repetir días)
- SOLO usa exercise_id que existan en la lista de ejercicios proporcionada
- Genera exactamente ${
    trainingDays.length || 3
  } rutina(s), una para cada día disponible del usuario
- Asegúrate de que cada rutina sea DIFERENTE y complementaria con las demás
- El JSON debe ser válido y parseable`;

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

    const aiResponse = JSON.parse(jsonMatch[0]);

    // Validar que la respuesta contenga el array de rutinas
    if (!aiResponse.routines || !Array.isArray(aiResponse.routines)) {
      throw new Error(
        "La respuesta de la IA no contiene un array de rutinas válido"
      );
    }

    if (aiResponse.routines.length === 0) {
      throw new Error("La IA no generó ninguna rutina");
    }

    // Validar que los exercise_id existan en la lista de ejercicios para cada rutina
    const validExerciseIds = new Set(exercises.map((ex) => ex.id));

    aiResponse.routines = aiResponse.routines.map((routine) => {
      // Filtrar ejercicios válidos
      routine.exercises = routine.exercises.filter((ex) =>
        validExerciseIds.has(ex.exercise_id)
      );
      return routine;
    });

    // Eliminar rutinas sin ejercicios válidos
    aiResponse.routines = aiResponse.routines.filter(
      (routine) => routine.exercises.length > 0
    );

    if (aiResponse.routines.length === 0) {
      throw new Error("La IA no generó ejercicios válidos en ninguna rutina");
    }

    return aiResponse;
  } catch (error) {
    console.error("Error al generar rutina con IA:", error);
    throw new Error(`Error al generar rutina con IA: ${error.message}`);
  }
};
