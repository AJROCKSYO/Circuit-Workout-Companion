import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, Check } from 'lucide-react';

const WorkoutTimer = () => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const workoutStructure = [
    {
      section: "Warm-Up",
      rounds: 1,
      exercises: [
        {
          name: "Cycling Machine",
          type: "timed",
          duration: 240,
          description: "Sit with knee slightly bent at bottom of pedal. Keep chest upright, hands relaxed. Pedal at steady pace until warm."
        },
        {
          name: "Mobility Warm-Up",
          type: "timed",
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
          type: "reps",
          reps: 10,
          description: "Hold one dumbbell vertically against your chest with both hands. Stand with feet shoulder-width apart, toes slightly out. Push hips back and bend knees. Lower until thighs parallel to floor. Keep chest up, back straight. Push through heels to stand."
        },
        {
          name: "Dumbbell Romanian Deadlift",
          type: "reps",
          reps: 10,
          description: "Hold two dumbbells in front of thighs, palms facing body. Slightly bend knees and keep them there. Push hips backward, not down. Let dumbbells slide to mid-shin. Keep back flat, chest slightly forward. Squeeze glutes and push hips forward to return."
        },
        {
          name: "Plank Shoulder Taps",
          type: "reps",
          reps: "8 per side",
          description: "Start in plank position on hands. Hands under shoulders, body in straight line. Slowly lift right hand and tap left shoulder. Place hand back, then switch sides. Keep hips still. Move slowly, focus on control."
        }
      ]
    },
    {
      type: "rest",
      name: "Rest Between Circuits",
      duration: 60
    },
    {
      section: "Circuit 2 - Upper Body Push",
      rounds: 2,
      exercises: [
        {
          name: "Dumbbell Chest Press",
          type: "reps",
          reps: 10,
          description: "Lie on back on mat with knees bent. Hold dumbbells at chest level, elbows on floor. Palms facing forward or slightly inward. Press dumbbells straight upward until arms extended. Lower slowly until elbows touch floor."
        },
        {
          name: "Dumbbell Shoulder Press",
          type: "reps",
          reps: 10,
          description: "Sit or stand with dumbbells at shoulder height. Palms facing forward. Brace core, keep ribs down. Press dumbbells upward until arms straight. Lower slowly back to shoulder height. Avoid leaning backward or locking elbows aggressively."
        },
        {
          name: "Dumbbell Lateral Raises",
          type: "reps",
          reps: 10,
          description: "Hold light dumbbells at sides. Slight bend in elbows. Raise arms out to sides until shoulder height. Lower slowly. Lift with shoulders, not momentum."
        }
      ]
    },
    {
      type: "rest",
      name: "Rest Between Circuits",
      duration: 60
    },
    {
      section: "Circuit 3 - Upper Body Pull",
      rounds: 2,
      exercises: [
        {
          name: "Bent-Over Dumbbell Rows",
          type: "reps",
          reps: 10,
          description: "Hold dumbbells with palms facing inward. Hinge forward at hips, chest angled toward floor. Keep back flat and neck neutral. Pull dumbbells toward hips. Squeeze shoulder blades together at top. Lower slowly."
        },
        {
          name: "Single-Arm Dumbbell Row",
          type: "reps",
          reps: "8 per arm",
          description: "Place one knee and one hand on bench or thigh. Other foot flat on floor. Hold dumbbell with free hand. Pull dumbbell toward waist. Keep elbow close to body. Lower slowly and switch arms."
        },
        {
          name: "Dumbbell Hammer Curls",
          type: "reps",
          reps: 10,
          description: "Hold dumbbells with palms facing each other. Keep elbows close to sides. Curl dumbbells upward to shoulder height. Lower slowly. Focus on controlling the lowering phase."
        }
      ]
    },
    {
      section: "Cool Down",
      rounds: 1,
      exercises: [
        {
          name: "Cool Down Stretching",
          type: "timed",
          duration: 360,
          description: "Hamstrings (hinge forward), quads (heel to glutes), chest (hands behind back), shoulders (arm across body), upper back (hug yourself). Hold each stretch comfortably."
        }
      ]
    }
  ];

  // Flatten structure for navigation
  const flatExercises = [];
  workoutStructure.forEach(section => {
    if (section.type === "rest") {
      flatExercises.push({
        ...section,
        type: "timed"
      });
    } else {
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
    }
  });

  const currentExercise = flatExercises[currentExerciseIndex];

  useEffect(() => {
    if (timeRemaining === 0 && currentExerciseIndex === 0) {
      if (currentExercise.type === "timed") {
        setTimeRemaining(currentExercise.duration);
      }
    }
  }, []);

  useEffect(() => {
    let interval;
    if (isRunning && timeRemaining > 0 && currentExercise.type === "timed") {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isRunning && currentExercise.type === "timed") {
      if (currentExerciseIndex < flatExercises.length - 1) {
        const nextExercise = flatExercises[currentExerciseIndex + 1];
        setCurrentExerciseIndex(prev => prev + 1);
        if (nextExercise.type === "timed") {
          setTimeRemaining(nextExercise.duration);
        } else {
          setIsRunning(false);
        }
      } else {
        setIsRunning(false);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeRemaining, currentExerciseIndex, currentExercise]);

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
    if (currentExercise.type === "timed") {
      setTimeRemaining(currentExercise.duration);
    }
  };

  const completeExercise = () => {
    if (currentExerciseIndex < flatExercises.length - 1) {
      setIsRunning(false);
      const nextExercise = flatExercises[currentExerciseIndex + 1];
      setCurrentExerciseIndex(prev => prev + 1);
      if (nextExercise.type === "timed") {
        setTimeRemaining(nextExercise.duration);
      }
    }
  };

  const selectExercise = (index) => {
    setIsRunning(false);
    setCurrentExerciseIndex(index);
    if (flatExercises[index].type === "timed") {
      setTimeRemaining(flatExercises[index].duration);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Workout Timer</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Timer/Reps Section */}
          <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
            <div className="text-center mb-6">
              {currentExercise.type === "timed" ? (
                <>
                  <div className="text-8xl font-bold mb-4 font-mono tracking-tight">
                    {formatTime(timeRemaining)}
                  </div>
                  {currentExercise.totalRounds > 1 && (
                    <div className="text-xl text-slate-400">
                      {currentExercise.section} - Round {currentExercise.round} of {currentExercise.totalRounds}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="text-7xl font-bold mb-4 text-blue-400">
                    {currentExercise.reps}
                  </div>
                  <div className="text-3xl font-semibold mb-4">REPS</div>
                  {currentExercise.totalRounds > 1 && (
                    <div className="text-xl text-slate-400">
                      {currentExercise.section} - Round {currentExercise.round} of {currentExercise.totalRounds}
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex justify-center gap-4">
              {currentExercise.type === "timed" ? (
                <>
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
                </>
              ) : (
                <button
                  onClick={completeExercise}
                  disabled={currentExerciseIndex === flatExercises.length - 1}
                  className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Check size={24} />
                  <span className="font-semibold">Complete</span>
                </button>
              )}
              <button
                onClick={completeExercise}
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
            {currentExercise.section && (
              <div className="mb-6 text-lg text-blue-400">
                {currentExercise.section}
              </div>
            )}
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
                {section.type === "rest" ? (
                  <button
                    onClick={() => selectExercise(flatExercises.findIndex(e => e.name === section.name))}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      flatExercises.findIndex(e => e.name === section.name) === currentExerciseIndex
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{section.name}</span>
                      <span className="text-sm opacity-75">{section.duration}s</span>
                    </div>
                  </button>
                ) : (
                  <>
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
                                  <span className="text-sm opacity-75">
                                    {exercise.type === "timed" ? `${exercise.duration}s` : `${exercise.reps} reps`}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutTimer;