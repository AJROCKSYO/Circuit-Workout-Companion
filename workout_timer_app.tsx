import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Check } from 'lucide-react';

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
    if (currentExercise.type === "timed") {
      setTimeRemaining(currentExercise.duration);
    }
  }, [currentExerciseIndex]);

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

  // Calculate progress
  const progress = ((currentExerciseIndex + 1) / flatExercises.length) * 100;

  // Get timeline items (current, previous 2, next 2)
  const getTimelineItems = () => {
    const items = [];
    for (let i = Math.max(0, currentExerciseIndex - 1); i <= Math.min(flatExercises.length - 1, currentExerciseIndex + 2); i++) {
      const ex = flatExercises[i];
      items.push({
        index: i,
        name: ex.name,
        round: ex.totalRounds > 1 ? `R${ex.round}` : null,
        isCurrent: i === currentExerciseIndex
      });
    }
    return items;
  };

  const timelineItems = getTimelineItems();

  return (
    <div className="h-screen flex flex-col bg-[#0f172a] text-white overflow-hidden">
      {/* Header */}
      <header className="h-12 flex items-center px-6 border-b border-gray-700 bg-[#0B1120]">
        <h1 className="text-lg font-medium tracking-wide">Workout Guide Dashboard</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel - Timer/Reps Display */}
        <section className="w-1/2 flex flex-col items-center p-8 relative bg-[#0B1120]">
          {/* Blue accent bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-blue-600"></div>

          {/* Timer/Reps Display */}
          <div className="flex-1 flex items-center justify-center w-full">
            {currentExercise.type === "timed" ? (
              <h2 className="text-9xl font-black tracking-tight text-white">
                {formatTime(timeRemaining)}
              </h2>
            ) : (
              <h2 className="text-9xl font-black tracking-tight text-white">
                {currentExercise.reps} <span className="text-5xl">Reps</span>
              </h2>
            )}
          </div>

          {/* Controls */}
          <div className="bg-white rounded-full p-2 flex items-center justify-between w-full max-w-md shadow-lg mb-10">
            {currentExercise.type === "timed" ? (
              <>
                <button
                  onClick={toggleTimer}
                  className="flex-1 flex flex-col items-center justify-center py-2 px-4 hover:bg-gray-100 rounded-l-full transition-colors border-r border-gray-200"
                >
                  {isRunning ? (
                    <Pause className="w-6 h-6 mb-1 text-blue-600" />
                  ) : (
                    <Play className="w-6 h-6 mb-1 text-blue-600" />
                  )}
                  <span className="text-xs font-semibold text-blue-900">
                    {isRunning ? 'Pause' : 'Play'}
                  </span>
                </button>
                <button
                  onClick={resetTimer}
                  className="flex-1 flex flex-col items-center justify-center py-2 px-4 hover:bg-gray-100 transition-colors border-r border-gray-200"
                >
                  <RotateCcw className="w-6 h-6 mb-1 text-blue-600" />
                  <span className="text-xs font-semibold text-blue-900">Reset</span>
                </button>
              </>
            ) : null}
            <button
              onClick={completeExercise}
              disabled={currentExerciseIndex === flatExercises.length - 1}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-4 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${currentExercise.type === "timed" ? 'rounded-r-full' : 'rounded-full'}`}
            >
              <Check className="w-6 h-6 mb-1 text-blue-600" />
              <span className="text-xs font-semibold text-blue-900">Complete</span>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md h-4 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </section>

        {/* Right Panel - Instructions */}
        <section className="w-1/2 bg-[#f0f2f5] text-gray-900 p-12 flex flex-col justify-center">
          <h2 className="text-7xl font-extrabold mb-8 text-[#101726]">
            {currentExercise.name}
          </h2>
          {currentExercise.section && (
            <p className="text-xl text-gray-600 mb-8">{currentExercise.section}</p>
          )}
          <div className="pr-8 max-h-[60vh] overflow-y-auto">
            <p className="text-2xl font-medium leading-relaxed text-gray-800">
              {currentExercise.description}
            </p>
          </div>
        </section>
      </main>

      {/* Footer Timeline Navigation */}
      <nav className="h-20 bg-white border-t border-gray-300 flex items-center p-2">
        <ul className="flex w-full h-full items-stretch px-2 text-sm font-medium">
          {timelineItems.map((item, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === timelineItems.length - 1;
            const isCurrent = item.isCurrent;
            
            let clipPath;
            if (isFirst && isLast) {
              clipPath = 'none';
            } else if (isFirst) {
              clipPath = 'polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)';
            } else if (isLast) {
              clipPath = 'polygon(20px 0, 100% 0, 100% 100%, 20px 100%)';
            } else {
              clipPath = 'polygon(20px 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 20px 100%)';
            }

            return (
              <li
                key={item.index}
                onClick={() => selectExercise(item.index)}
                className={`flex-1 flex items-center justify-center text-center relative cursor-pointer transition-all ${
                  isCurrent
                    ? 'bg-blue-600 text-white z-20 shadow-md'
                    : 'bg-gray-300 text-gray-700 z-10 hover:bg-gray-400'
                } ${!isFirst ? '-ml-5 pl-8' : 'pl-4'} ${!isLast ? 'pr-2' : 'pr-4'}`}
                style={{ clipPath }}
              >
                <span>
                  {item.name} {item.round && `(${item.round})`}
                </span>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default WorkoutTimer;