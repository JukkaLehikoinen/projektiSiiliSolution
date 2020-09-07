import React, { useState, useContext } from "react";
import { Draggable } from "react-beautiful-dnd";
import uuid from "uuid/v4";
import { MyContext } from "../pages/BoardView";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import TextField from "@material-ui/core/TextField";

//TODO: rename remaining cards after graphql takeover

const Task = ({ id, column, provided, snapshot }) => {
  const [input, setInput] = useState({ id: null, status: false });
  const [taskInput, setTaskInput] = useState("");
  const context = useContext(MyContext);
  
  const addNewTask = (id) => {
    setInput({ id: id, status: true });
    const destinationColumn = context.columns[id].columnId;
    const newTask = {
      id: uuid(),
      content: taskInput,
    };
    if (newTask.content) {
      context.dispatch({
        type: "ADD_CARD",
        id: id,
        item: newTask,
      });
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(newTask),
      };
      fetch(
        `https://siiliwall.herokuapp.com/columnss/${destinationColumn}/cards`,
        requestOptions
      )
        .then((response) => response.text())
        .catch((error) => {});
      setInput({ id: null, status: false });
    }
    setTaskInput("");
  };

  const deleteTask = (id, item) => {
    const delColumn = context.columns[id].columnId;
    context.dispatch({
      type: "DELETE",
      id,
      item,
    });
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    };
    fetch(
      `https://siiliwall.herokuapp.com/${delColumn}/deletecard/${item.id}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((data) => {})
      .catch((error) => {});
  };

  return (
    <div>
        <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{
            backgroundColor: snapshot.isDraggingOver
                ? "lightblue"
                : "lightgrey",
            padding: 4,
            width: 250,
            minHeight: 500,
            borderRadius: "5px",
            }}
        >

            {column.items.map((item, index) => {
            return (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => {
                    return (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                        padding: 10,
                        margin: "0 0 5px 0",
                        borderRadius: "5px",
                        minHeight: "50px",
                        backgroundColor: snapshot.isDragging
                            ? "#fff"
                            : "#fff",
                        color: "#000",
                        ...provided.draggableProps.style,
                        }}
                    >
                        {item.content}
                        <IconButton
                            aria-label='delete'
                            onClick={() => {
                                if (
                                window.confirm(
                                    "Are you sure you want to delete this item?"
                                )
                                )
                                deleteTask(id, item);
                            }}
                        >
                        <DeleteIcon
                            style={{ color: "black" }}
                            fontSize='small'
                        />
                        </IconButton>
                    </div>
                    );
                }}
                </Draggable>
            );
            })}

            {provided.placeholder}
            {input.id === id && input.status === true && (
            <TextField
                size='small'
                id='outlined-full-width'
                fullWidth
                label='Sticky'
                variant='outlined'
                id={id}
                type='text'
                value={taskInput}
                onKeyPress={(event) => {
                if (event.key === "Enter") {
                    addNewTask(id);
                }
                }}
                onChange={(e) => setTaskInput(e.target.value)}
            ></TextField>
            )}

            <Button
                type='button'
                style={{ margin: 10 }}
                variant='contained'
                color='primary'
                onClick={() => addNewTask(id)}
                >
                + add new
            </Button>
        </div>
    </div>
  );
};

export default Task;