import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronRight } from 'lucide-react';

const WorkoutTimer = () => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);

  const exercises = [
    {
      name: "Cycling Machine",
      duration: 240,
      sets: 1,
      description: "Sit with knee slightly bent at bottom of pedal. Keep chest upright, hands relaxed. Pedal at steady pace until warm."
    },
    {
      name: "Mobility Warm-Up",
      duration: 120,
      sets: 1,
      description: "Arm circles (10s small, then bigger), shoulder rolls, hip circles, bodyweight squats - slow and controlled."
    },
    {
      name: "Goblet Squat",
      duration: 60,
      sets: 2,
      description: "Hold dumbbell vertically at chest. Feet shoulder-width, toes slightly out. Push hips back, lower until thighs parallel. Push through heels to stand."
    },
    {
      name: "Dumbbell Romanian Deadlift",
      duration: 60,
      sets: 2,
      description: "Hold dumbbells at thighs. Slightly bend knees. Push hips backward, slide dumbbells to mid-shin. Keep back flat, squeeze glutes to return."
    },
    {
      name: "Plank Shoulder Taps",
      duration: 60,
      sets: 2,
      description: "Plank position, hands under shoulders. Slowly tap opposite shoulder with each hand. Keep hips still, focus on control."
    },
    {
      name: "Dumbbell Chest Press",
      duration: 60,
      sets: 2,
      description: "Lie on mat, knees bent. Dumbbells at chest level, elbows on floor. Press straight up until arms extended, lower slowly."
    },
    {
      name: "Dumbbell Shoulder Press",
      duration: 60,
      sets: 2,
      description: "Dumbbells at shoulder height, palms forward. Brace core, press upward until arms straight. Lower slowly back to shoulders."
    },
    {
      name: "Dumbbell Lateral Raises",
      duration: 60,
      sets: 2,
      description: "Light dumbbells at sides, slight elbow bend. Raise arms out to shoulder height. Lower slowly. Lift with shoulders, not momentum."
    },
    {
      name: "Bent-Over Dumbbell Rows",
      duration: 60,
      sets: 2,
      description: "Hinge forward at hips, back flat. Pull dumbbells to hips, squeeze shoulder blades. Lower slowly with control."
    },
    {
      name: "Single-Arm Dumbbell Row",
      duration: 60,
      sets: 2,
      description: "One knee and hand on bench. Pull dumbbell to waist with free hand, elbow close to body. Lower slowly, then switch arms."
    },
    {
      name: "Dumbbell Hammer Curls",
      duration: 60,
      sets: 2,
      description: "Palms facing each other, elbows close to sides. Curl dumbbells to shoulder height. Focus on controlling the lowering phase."
    },
    {
      name: "Cool Down Stretching",
      duration: 360,
      sets: 1,
      description: "Hamstrings (hinge forward), quads (heel to glutes), chest (hands behind back), shoulders (arm across body), upper back (hug yourself)."
    }
  ];

  const currentExercise = exercises[currentExerciseIndex];

  useEffect(() => {
    if (timeRemaining === 0 && currentExerciseIndex === 0 && currentSet === 1) {
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
      if (currentSet < currentExercise.sets) {
        setCurrentSet(prev => prev + 1);
        setTimeRemaining(currentExercise.duration);
      } else if (currentExerciseIndex < exercises.length - 1) {
        setCurrentExerciseIndex(prev => prev + 1);
        setCurrentSet(1);
        setTimeRemaining(exercises[currentExerciseIndex + 1].duration);
      } else {
        setIsRunning(false);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeRemaining, currentExerciseIndex, currentSet, currentExercise]);

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
    if (currentExerciseIndex < exercises.length - 1) {
      setIsRunning(false);
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentSet(1);
      setTimeRemaining(exercises[currentExerciseIndex + 1].duration);
    }
  };

  const selectExercise = (index) => {
    setIsRunning(false);
    setCurrentExerciseIndex(index);
    setCurrentSet(1);
    setTimeRemaining(exercises[index].duration);
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
              {currentExercise.sets > 1 && (
                <div className="text-xl text-slate-400">
                  Set {currentSet} of {currentExercise.sets}
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
                disabled={currentExerciseIndex === exercises.length - 1}
                className="bg-slate-700 hover:bg-slate-600 p-4 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          {/* Exercise Info Section */}
          <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
            <h2 className="text-2xl font-bold mb-4">{currentExercise.name}</h2>
            <div className="mb-4 flex gap-4 text-sm text-slate-400">
              <span>Duration: {currentExercise.duration}s</span>
              {currentExercise.sets > 1 && <span>Sets: {currentExercise.sets}</span>}
            </div>
            <p className="text-slate-300 leading-relaxed">
              {currentExercise.description}
            </p>
          </div>
        </div>

        {/* Exercise List */}
        <div className="mt-8 bg-slate-800 rounded-2xl p-6 shadow-2xl border border-slate-700">
          <h3 className="text-xl font-bold mb-4">Exercise List</h3>
          <div className="space-y-2">
            {exercises.map((exercise, index) => (
              <button
                key={index}
                onClick={() => selectExercise(index)}
                className={`w-full text-left p-4 rounded-lg transition-colors ${
                  index === currentExerciseIndex
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{exercise.name}</span>
                  <span className="text-sm opacity-75">
                    {exercise.duration}s {exercise.sets > 1 && `× ${exercise.sets}`}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutTimer;