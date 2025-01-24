import { useState } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";

const WorkoutForm = () => {
  const { dispatch } = useWorkoutsContext();

  const [title, setTitle] = useState('');
  const [load, setLoad] = useState('');
  const [reps, setReps] = useState('');
  const [workoutType, setWorkoutType] = useState('weighted');  // New state for workout type
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const workout = { title, load, reps, workoutType };

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/workouts`, 
      {
        method: 'POST',
        body: JSON.stringify(workout),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }
    if (response.ok) {
      setTitle('');
      setLoad('');
      setReps('');
      setWorkoutType('weighted');  // Reset workout type
      setError(null);
      setEmptyFields([]);
      console.log('New workout added', json);
      dispatch({ type: 'CREATE_WORKOUT', payload: json });
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a New Workout</h3>

      <label>Exercise Title:</label>
      <input 
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className={emptyFields.includes('title') ? 'error' : ''}
      />

      <label>Load (in kg):</label>
      <input 
        type="number"
        onChange={(e) => setLoad(e.target.value)}
        value={load}
        className={emptyFields.includes('load') ? 'error' : ''}
        disabled={workoutType === 'calisthenics'}  // Disable if calisthenics is selected
      />

      <label>Reps:</label>
      <input 
        type="number"
        onChange={(e) => setReps(e.target.value)}
        value={reps}
        className={emptyFields.includes('reps') ? 'error' : ''}
      />

      <label>Workout Type:</label>
      <div>
        <input 
          type="radio" 
          id="weighted" 
          name="workoutType" 
          value="weighted" 
          checked={workoutType === 'weighted'}
          onChange={() => setWorkoutType('weighted')}
        />
        <label htmlFor="weighted">Weighted</label>
        
        <input 
          type="radio" 
          id="calisthenics" 
          name="workoutType" 
          value="calisthenics" 
          checked={workoutType === 'calisthenics'}
          onChange={() => setWorkoutType('calisthenics')}
        />
        <label htmlFor="calisthenics">Calisthenics</label>
      </div>

      <button>Add Workout</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default WorkoutForm;
