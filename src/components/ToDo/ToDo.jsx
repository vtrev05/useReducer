import React from 'react'
import { useReducer } from 'react';
import { useState } from 'react';
import { state } from '../../utils/initialState'
import { v4 as uuidv4 } from "uuid";

const initialState =  state;

// Esta función reducer será la que se usa como 1er param en el useReducer(reducer, initialState), la que contiene el useReducer. Se llama reducer pero podríamos cambiar el nombre, es una constante simplemente.
const reducer = ( state,action) => {
  // La función reducer tendrá siempre 2 params, que serán state y action.
  //A su vez, action será un objeto que mínimo tendrá 1 propiedad TYPE.
    if (action.type === 'ADD_TODO') {
      //payload contendrá la respuesta total de esa action. En este caso, solo me interesa el name, ya que las otras dos propiedades id e isCompleted no las necesito. El name será lo que escriba el usuario en el input.
        const {name} = action.payload

        return [
            ...state, {
                id: uuidv4(),
                name,
                isCompleted: false 
            }
        ]
    }

    if (action.type === 'TOGGLE_IS_COMPLETED') {
      //nos traemos el id porque será la forma que tenemos de identificar la tarea exacta que queremos marcar como completada. Podríamos hacerlo con el name pero cabría la posibilidad de encontrar problemas al duplicar tareas con el mismo nombre.
        const {id} = action.payload

        const newState = state.map((task) => {
          //Mapeamos el state (que será el listado de nuestras tareas) y, en el momento que el id de alguna de esas tareas recorridas coincida con el id del payload, le modificamos la propiedad isCompleted.
            if (task.id === id) {
                return {...task, isCompleted: !task.isCompleted}
            }
            //devolvemos la tarea modificada
            return task
        })
            //Por último, devolvemos el nuevo estado con la propiedad isCompleted modificada.
        return newState 

    }
}

const ToDo = () => {

    const [todoText, setTodoText] = useState("")

    //El state en este caso será el listado de tareas, el dispatch será lo que "dispare" las actions del reduce como vemos más abajo en handleClick.
    //useReducer recibirá por primer param la función que contiene los diferentes tipos de acciones y recibiremos el estado inicial.
    const [state, dispatch] = useReducer(reducer, initialState)

    const handleChange = ({target}) => setTodoText(target.value)


    const handleClick = () => {
      //el dispatch lo que hace es "disparar" el reducer pasándole el type y el payload.
        dispatch({
          type: "ADD_TODO",
          payload: { name: todoText }
        });
        setTodoText("");
      };


      const handleToggle = (id) => {
        dispatch({
          type: "TOGGLE_IS_COMPLETED",
          payload: { id }
        });
      };


  return (
    <div>
        <p>
        Nuevo TODO:
        <input type="text" value={todoText} onChange={handleChange} />
        <button onClick={handleClick}>Agregar</button>
      </p>


      <h2>Listado</h2>


      <ul>
        {state.map(({ name, isCompleted, id }) => {
          const style = {
            // si es complete tachamos
            textDecoration: isCompleted ? "line-through" : "inherit"
          };

          return (
            // funcion de tachado -> completado
            <li key={id} style={style} onClick={() => handleToggle(id)}>
              {name}
            </li>
          );
        })}
      </ul>

    </div>
  )
}

export default ToDo