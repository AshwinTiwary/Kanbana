import React, { useState } from "react";
import KanbanaList from "./KanbanList";
import { IoMdAdd } from "react-icons/io";

export default function Kanbana() {
    const [kanabanaTitle, setKanbanaTitle] = useState("");
    const [kabanTasks, setKabanTasks] = useState("");
    const [kanbanaList, setKanbanList] = useState([]);
    const [draggedKanabanaMain, setDraggedKanabanaMain] = useState(null);

    const handleDragStartMain = (event, index, column) => {
        setDraggedKanabanaMain(index);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (index) => {
        if (draggedKanabanaMain === null) return;

        const updatedItems = [...kanbanaList];
        const [removed] = updatedItems.splice(draggedKanabanaMain, 1);
        // console.log("1", removed);
        updatedItems.splice(index, 0, removed);
        // console.log("2", updatedItems);
        setKanbanList(updatedItems);
        setDraggedKanabanaMain(null);
    };

    function addList() {
        setKanbanList((prev) => ([...prev, { mainTitle: kanabanaTitle, allTasks: [] }]))
    }
    function handleKanbanChange(event) {
        setKanbanaTitle(event.target.value);
    }
    function addKabanTask(index) {
        const backedUp = [...kanbanaList];
        const backedObj = backedUp[index];
        backedObj["allTasks"] = [...backedObj["allTasks"], kabanTasks];
        backedUp[index] = backedObj;
        setKanbanList(backedUp);
    }
    return (
        <div className="d-flex mt-4 w-100">
            <div className="modal fade" id="exampleModalMain" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Add List</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <label htmlFor="listName">Enter List Name :</label>
                            <input className="form-control" type="text" placeholder="List Name" aria-label="default input example" name="listName" onChange={handleKanbanChange} />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={addList}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="d-flex gap-5 mt-3 w-100 overflowY-scroll">
                {
                    kanbanaList.length > 0 && kanbanaList.map((singleKanban, index) => {
                        const spacesRemovedName = singleKanban.mainTitle.replace(/\s+/g, '')
                        return (
                            <div key={index} className="shadow bg-light rounded-2 px-2 py-1 w-25">
                                <div
                                    draggable
                                    onDragStart={(event) => handleDragStartMain(event, index, true)}
                                    onDragOver={handleDragOver}
                                    onDrop={() => handleDrop(index)}
                                    className="d-flex justify-content-between mb-3"
                                    style={{ cursor: draggedKanabanaMain ? "grabbing" : "grab" }}
                                >

                                    <p className="fw-medium text-danger">{singleKanban.mainTitle}</p>

                                    <button type="button" className="border-0 bg-light" data-bs-toggle="modal" data-bs-target={`#${spacesRemovedName}`}>
                                        <IoMdAdd className="fs-5 text-dark" />
                                    </button>
                                </div>
                                <KanbanaList
                                    kanbanaData={singleKanban.allTasks}
                                    mainIndex={index}
                                    setKanbanList={setKanbanList}
                                    kanbanaList={kanbanaList}
                                />
                                <div className="modal fade" id={spacesRemovedName} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h1 className="modal-title fs-5" id="exampleModalLabel">Adding to {singleKanban.mainTitle}</h1>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">
                                                <label htmlFor="listName">Enter Task :</label>
                                                <input className="form-control" type="text" placeholder="List Name" aria-label="default input example" name="listName" onChange={(e) => setKabanTasks(e.target.value)} />
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => addKabanTask(index)}>Save</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        )
                    })
                }
            </div>
            <button type="button" className="bg-primary border-0 rounded-circle ms-5" data-bs-toggle="modal" data-bs-target="#exampleModalMain" style={{ width: "40px", height: "40px" }}>
                <IoMdAdd className="fs-5 text-light" />
            </button>
        </div>
    )
}