// THis is our ROOT file for the frontend

// import other files
import TaskList from "./components/TaskList";


//for toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



// for the URL for frontend routes
export const URL = process.env.REACT_APP_SERVER_URL   // add 'export' in the front to export it to every other location 
function App() {
  return (
    <div className="app">
     <div className="task-container">
      <TaskList/>
     </div>
     <ToastContainer />  
    </div>
  );
}

export default App;
