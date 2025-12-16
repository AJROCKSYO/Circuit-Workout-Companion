import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronRight } from 'lucide-react';

const WorkoutTimer = () => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);

  const workoutStructure = [
    {
      section: "Warm-Up",
      rounds: 1,
      exercises: [
        {
          name: "Cycling Machine",
          duration: 240,
          description: "Sit with knee slightly bent at bottom of pedal. Keep chest upright, hands relaxed. Pedal at steady pace until warm."
        },
        {
          name: "Mobility Warm-Up",
          duration: 120,
          description: "Arm circles (10s small, then bigger), shoulder rolls, hip circles, bodyweight squats - slow and controlled."
        }
      ]
    },
    {
      section: "Circuit 1 - Legs + Core",
      rounds: 2,
      exercises: [
        {
          name: "Goblet Squat",
          duration: 60,
          description: "Hold dumbbell vertically at chest. Feet shoulder-width, toes slightly out. Push hips back, lower until thighs parallel. Push through heels to stand. 10 reps."
        },
        {
          name: "Dumbbell Romanian Deadlift",
          duration: 60,
          description: "Hold dumbbells at thighs. Slightly bend knees. Push hips backward, slide dumbbells to mid-shin. Keep back flat, squeeze glutes to return. 10 reps."
        },
        {
          name: "Plank Shoulder Taps",
          duration: 60,
          description: "Plank position, hands under shoulders. Slowly tap opposite shoulder with each hand. Keep hips still, focus on control. 8 taps per side."
        }
      ]
    },
    {
      section: "Circuit 2 - Upper Body Push",
      rounds: 2,
      exercises: [
        {
          name: "Dumbbell Chest Press",
          duration: 60,
          description: "Lie on mat, knees bent. Dumbbells at chest level, elbows on floor. Press straight up until arms extended, lower slowly. 10 reps."
        },
        {
          name: "Dumbbell Shoulder Press",
          duration: 60,
          description: "Dumbbells at shoulder height, palms forward. Brace core, press upward until arms straight. Lower slowly back to shoulders. 10 reps."
        },
        {
          name: "Dumbbell Lateral Raises",
          duration: 60,
          description: "Light dumbbells at sides, slight elbow bend. Raise arms out to shoulder height. Lower slowly. Lift with shoulders, not momentum. 10 reps."
        }
      ]
    },
    {
      section: "Circuit 3 - Upper Body Pull",
      rounds: 2,
      exercises: [
        {
          name: "Bent-Over Dumbbell Rows",
          duration: 60,
          description: "Hinge forward at hips, back flat. Pull dumbbells to hips, squeeze shoulder blades. Lower slowly with control. 10 reps."
        },
        {
          name: "Single-Arm Dumbbell Row",
          duration: 60,
          description: "One knee and hand on bench. Pull dumbbell to waist with free hand, elbow close to body. Lower slowly, then switch arms. 8 reps per arm."
        },
        {
          name: "Dumbbell Hammer Curls",
          duration: 60,
          description: "Palms facing each other, elbows close to sides. Curl dumbbells to shoulder height. Focus on controlling the lowering phase. 10 reps."
        }
      ]
    },
    {
      section: "Cool Down",
      rounds: 1,
      exercises: [
        {
          name: "Cool Down Stretching",
          duration: 360,
          description: "Hamstrings (hinge forward), quads (heel to glutes), chest (hands behind back), shoulders (arm across body), upper back (hug yourself)."
        }
      ]
    }
  ];

  // Flatten structure for navigation
  const flatExercises = [];
  workoutStructure.forEach(section => {
    for (let round = 1; round <= section.rounds; round++) {
      section.exercises.forEach(exercise => {
        flatExercises.push({
          ...exercise,
          section: section.section,
          round: round,
          totalRounds: section.rounds
        });
      });
    }
  });

  const currentExercise = flatExercises[currentExerciseIndex];

  useEffect(() => {
    if (timeRemaining === 0 && currentExerciseIndex === 0) {
      setTimeRemaining(currentExercise.duration);
    }
  }, []);

  useEffect(() => {
    let interval;
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isRunning) {
      if (currentExerciseIndex < flatExercises.length - 1) {
        setCurrentExerciseIndex(prev => prev + 1);
        setTimeRemaining(flatExercises[currentExerciseIndex + 1].duration);
      } else {
        setIsRunning(false);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeRemaining, currentExerciseIndex]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeRemaining(currentExercise.duration);
  };

  const nextExercise = () => {
    if (currentExerciseIndex < flatExercises.length - 1) {
      setIsRunning(false);
      setCurrentExerciseIndex(prev => prev + 1);
      setTimeRemaining(flatExercises[currentExerciseIndex + 1].duration);
    }
  };

  const selectExercise = (index) => {
    setIsRunning(false);
    setCurrentExerciseIndex(index);
    setTimeRemaining(flatExercises[index].duration);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Workout Timer</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Timer Section */}
          <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
            <div className="text-center mb-6">
              <div className="text-8xl font-bold mb-4 font-mono tracking-tight">
                {formatTime(timeRemaining)}
              </div>
              {currentExercise.totalRounds > 1 && (
                <div className="text-xl text-slate-400">
                  {currentExercise.section} - Round {currentExercise.round} of {currentExercise.totalRounds}
                </div>
              )}
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={toggleTimer}
                className="bg-blue-600 hover:bg-blue-700 p-4 rounded-full transition-colors"
              >
                {isRunning ? <Pause size={24} /> : <Play size={24} />}
              </button>
              <button
                onClick={resetTimer}
                className="bg-slate-700 hover:bg-slate-600 p-4 rounded-full transition-colors"
              >
                <RotateCcw size={24} />
              </button>
              <button
                onClick={nextExercise}
                disabled={currentExerciseIndex === flatExercises.length - 1}
                className="bg-slate-700 hover:bg-slate-600 p-4 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          {/* Exercise Info Section */}
          <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
            <h2 className="text-4xl font-bold mb-6">{currentExercise.name}</h2>
            <div className="mb-6 text-lg text-blue-400">
              {currentExercise.section}
            </div>
            <p className="text-slate-300 leading-relaxed text-lg">
              {currentExercise.description}
            </p>
          </div>
        </div>

        {/* Exercise List */}
        <div className="mt-8 bg-slate-800 rounded-2xl p-6 shadow-2xl border border-slate-700">
          <h3 className="text-xl font-bold mb-4">Exercise List</h3>
          <div className="space-y-4">
            {workoutStructure.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h4 className="text-lg font-semibold text-blue-400 mb-2">
                  {section.section} {section.rounds > 1 && `(${section.rounds} rounds)`}
                </h4>
                <div className="space-y-2 ml-4">
                  {Array.from({length: section.rounds}).map((_, roundIdx) => (
                    <div key={roundIdx}>
                      {section.rounds > 1 && (
                        <div className="text-sm text-slate-400 mb-1 mt-2">Round {roundIdx + 1}</div>
                      )}
                      {section.exercises.map((exercise, exIdx) => {
                        const flatIndex = flatExercises.findIndex(
                          e => e.name === exercise.name && 
                               e.section === section.section && 
                               e.round === roundIdx + 1
                        );
                        return (
                          <button
                            key={exIdx}
                            onClick={() => selectExercise(flatIndex)}
                            className={`w-full text-left p-3 rounded-lg transition-colors ${
                              flatIndex === currentExerciseIndex
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{exercise.name}</span>
                              <span className="text-sm opacity-75">{exercise.duration}s</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutTimer;