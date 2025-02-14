import React, { useState } from "react";
import { FaUserCheck } from "react-icons/fa6";
import { IoPersonRemove } from "react-icons/io5";

export default function KanbanaList({ kanbanaData, mainIndex, setKanbanList, kanbanaList }) {
    const [dragStart, setDragStart] = useState({
        initialMain: null,
        tempIndex: null
    });

    const handleDragStart = (index) => {

        const obj = {
            initialMain: mainIndex,
            tempIndex: index
        };

        setDragStart(obj);
        localStorage.setItem("items", JSON.stringify(obj));
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDropEvent = (index) => {
        const initialObj = JSON.parse(localStorage.getItem("items"));

        const updatedItems = [...kanbanaList];
        const [removed] = updatedItems[initialObj.initialMain]["allTasks"].splice(initialObj.tempIndex, 1);

        updatedItems[mainIndex]["allTasks"].splice(index, 0, removed);
        setKanbanList(updatedItems);
        localStorage.removeItem("items");

    }

    const handleRemoveList = (index) => {
        const updatedItems = [...kanbanaList];
        updatedItems[mainIndex]["allTasks"].splice(index, 1);
        setKanbanList(updatedItems);
    }

    return (
        kanbanaData?.length === 0 ? (<p draggable className="h-100" onDragOver={handleDragOver}
            onDrop={() => handleDropEvent(0)}></p>) : (kanbanaData.map((singleTask, index) => {
                return (
                    <div>
                        <p
                            key={index}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDropEvent(index)}
                            className="p-1 fw-medium rounded-1 shadow-sm mt-1"
                            style={{ backgroundColor: "#EBF1F6", cursor: "grab" }}
                        >{singleTask} <FaUserCheck className="text-success ms-5" /> </p>
                        <IoPersonRemove className="text-danger ms-5" onClick={() => handleRemoveList(index)} />
                    </div>

                )
            }))
    )
}