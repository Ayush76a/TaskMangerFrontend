import { createContext, useEffect, useState } from "react"; // import 'useEffect' from react
import Task from "./Task";
import TaskForm from "./TaskForm";
// import react-toastify to use toast variable
import { ToastContainer, toast } from 'react-toastify';

//import axios
import axios, {isCancel, AxiosError} from 'axios';

// the URL to the frontend is putted in the .env file in frontend app.js file
// import the 'URL'
import { URL } from "../App";

//for loading image
import loadingImage from "D:/web_projects/TaskManager/frontend/src/assets/loader.gif"

// console.log("this is image :" + loadingImage);


const TaskList = () => {
    // these constants are our states
    const [tasks, setTasks] = useState([])
    const [completedTasks, setCompletedTasks] = useState([]);
    
    //state for loading -> initailly is Loading is set to be false
    const [isLoading, setIsLoading] = useState(false);

    //states for editing
    const [isEditing, setIsEditing] = useState(false);
    const [TaskId, setTaskId] = useState("");
    
    const [formData, setFormData] = useState({
        name:" ",
        completed:false
    })
    
    //getting name from formData
    const {name} = formData ;
    
    // in TaskForm many functions ->
    // handleInputChange()  e=>event paramter -> to get the event.target property

    
    const handleInputChange = (e) =>{
          const {name, value} = e.target
          setFormData({...formData, [name]: value })
    }
    

    // Function to get Task
    const getTasks = async() =>{
        setIsLoading(true)
        // 'Axios' is used to fetch data from database
        
        try{
          const {data} =  await axios.get(`${URL}/api/v1/tasks`)
        //   console.log(data);
            setTasks(data)
          setIsLoading(false)
        }
        catch(err){
         toast.error(err.message);
           
         // if error comes ->
         setIsLoading(false);
        }
    }

    // EFFECT creation
    useEffect(()=>{
        getTasks()
    },[])
    

    
    
    
    // Function to Create Task 

    const createTask = async (e) =>{
       e.preventDefault()
       // using toastify to give the error
       if(name === ""){
        return toast.error("Input field can't be empty")
       }
       try{
          await axios.post(`${URL}/api/v1/tasks`, formData)
          toast.success("Task added successfully")
          setFormData({...formData, name:""})
          getTasks()
       }
       catch(err){
          toast.error(err.message);
          console.log(err)
          // even if both backend and frotend are working on same http , we even get the 'Network error' on adding a task
          // this error is due to CORS(cross origin resource sharing) i.e. the url for the frontend and backend are different 
          // localhost:3000 and localhost:4000
          // to overcome this cors error and to share resources b/w the frontend and the backend -> use  .use(cors()) middleWare in the root backend file
          // also put the cors middleware above the route middleware to make it work
       }
    }


    // Delete Task via the button in frontend
    const deleteTask = async (id) =>{
       try{
         await axios.delete(`${URL}/api/v1/tasks/${id}`)
         // reload the page using getTask function
         getTasks()
       }
       catch(err){
           toast.error(err.message)
       }
    }


    // for counting the no. of completed tasks , also add the dependency array
     useEffect(() => {
        const cTask = tasks.filter((task) => {
            return task.completed === true
        })
        setCompletedTasks(cTask)
     },[tasks])
    
    
    // get Single task function which is envoked via the edit button and 
    // now one can change the info about the task using the same form block and the add button
    // getSingle task fn for editing
    const getSingleTask = async (task) =>{
        setFormData ({name : task.name, completed: false})
        setTaskId(task._id)
        setIsEditing(true)
    };


    // when isEditing is set true we will fire another function
    // UpdateTask function for editing 
    // # Use the same http Method in backend and frontend for updation i.e. Patch otherwise error will come
    const updateTask = async(e) =>{
        e.preventDefault()
        if (name === ""){
            return toast.error("Input field cannot be empty")
        }

        try{
            await axios.patch(`${URL}/api/v1/tasks/${TaskId}`, formData)
            // now clear the form 
            setFormData({ ...formData, name: ""});
            //set is editing to falsse again
            setIsEditing(false);
            getTasks();     // reaload the page
            toast.success("Task Edited Successfully");
        }
        catch(err){
            toast.error(err.message)
        }
    }
    



    // Function to set a Task to Completed using the Tick function
    // UPon Task Completion the bar at leftmost corner of the a task will also Turn Green from Red
    // to do this change the div name in Task.js i.e. add the "completed"  class name if task is completed otherwise the class name will only be task
    const setToComplete = async (task) => {
        const newFormData = {
            name : task.name,
            completed : true,
        }

        try{
           await axios.patch(`${URL}/api/v1/tasks/${task._id}`, newFormData)
           getTasks()
           toast.success("Congrats!!! for Completing this Task")
        }
        catch(err)
        {
          toast.error(err.message)
        }
    }







    // BELOW IS OUR JSX
      
    return (
        <div>
            <h2>Task Manager</h2>
            
        <  TaskForm name={name} 
            handleInputChange={handleInputChange}  
            createTask={createTask}  
            isEditing={isEditing}
            updateTask={updateTask} 
        />
        
        { tasks.length > 0 && (
                <div className="--flex-between ---pb">
                    <p>
                     <b>Total Task :</b> {tasks.length}
                    </p>
                    <p>
                     <b>Completed Task :</b> {completedTasks.length}
                    </p>
                </div>
        )}


            <hr/>
            {
                isLoading && (
                    <div className="--flex-center">
                       <img src = {loadingImage} alt="Loading" />
                    </div>
                )
            }
            {
                !isLoading && tasks.length === 0 ? (
                    <p className="--py">No task added. Please Add a task</p>
                ) : (
                       <>
                       {tasks.map((task, index) =>{
                        return (
                            < Task  
                              key ={task._id} 
                              task={task}  
                              index={index}
                              deleteTask = {deleteTask}
                              getSingleTask= {getSingleTask}
                              setToComplete={setToComplete} 
                            />
                       )
                       })}
                       </>
                ) 
            }
       </div>
    )
}
export default TaskList