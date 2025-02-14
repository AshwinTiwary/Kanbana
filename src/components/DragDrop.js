import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const ItemType = { TASK: "task", COLUMN: "column" };

// ✅ Task Component
const Task = ({ task, taskIndex, columnIndex, moveTask }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType.TASK,
    item: { taskIndex, columnIndex },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  if (!task) return <div style={{ display: "none" }} />;

  return (
    <div
      ref={drag}
      style={{
        padding: "10px",
        margin: "5px 0",
        backgroundColor: "#fff",
        cursor: "grab",
        opacity: isDragging ? 0.5 : 1,
        border: "1px solid #ddd",
        borderRadius: "4px",
      }}
    >
      {task?.title}
    </div>
  );
};

// ✅ Column Component
const Column = ({ column, columnIndex, moveTask, moveColumn }) => {
  const [{ isOver }, dropTask] = useDrop(() => ({
    accept: ItemType.TASK,
    drop: (draggedItem) => {
      if (draggedItem?.columnIndex !== undefined && draggedItem?.taskIndex !== undefined) {
        moveTask(draggedItem.columnIndex, draggedItem.taskIndex, columnIndex);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: ItemType.COLUMN,
    item: { columnIndex },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [, dropColumn] = useDrop(() => ({
    accept: ItemType.COLUMN,
    hover: (draggedItem) => {
      if (draggedItem?.columnIndex !== undefined && draggedItem.columnIndex !== columnIndex) {
        moveColumn(draggedItem.columnIndex, columnIndex);
        draggedItem.columnIndex = columnIndex;
      }
    },
  }));

  if (!column) return <div style={{ display: "none" }} />;

  return (
    <div ref={preview}>
      <div
        ref={(node) => drag(dropColumn(node))}
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          width: "250px",
          minHeight: "150px",
          backgroundColor: isOver ? "#e0e0e0" : "#f8f8f8",
          borderRadius: "8px",
          opacity: isDragging ? 0.5 : 1,
          cursor: "grab",
        }}
      >
        <h3>{column?.title}</h3>
        <div ref={dropTask}>
          {column?.tasks?.map((task, taskIndex) => (
            <Task key={task?.id} task={task} taskIndex={taskIndex} columnIndex={columnIndex} moveTask={moveTask} />
          ))}
        </div>
      </div>
    </div>
  );
};

// ✅ Kanban Board Component 
const KanbanBoard = () => {
  const [columns, setColumns] = useState(
    JSON.parse(localStorage.getItem("kanbanData")) || [
      { id: 1, title: "To Do", tasks: [{ id: 1, title: "Task 1" }, { id: 2, title: "Task 2" }] },
      { id: 2, title: "In Progress", tasks: [{ id: 3, title: "Task 3" }] },
      { id: 3, title: "Done", tasks: [{ id: 4, title: "Task 4" }] },
    ]
  );

  // ✅ Move a task between columns
  const moveTask = (sourceColIndex, taskIndex, targetColIndex) => {
    if (
      sourceColIndex === undefined ||
      taskIndex === undefined ||
      targetColIndex === undefined ||
      !columns[sourceColIndex] ||
      !columns[targetColIndex] ||
      !columns[sourceColIndex]?.tasks?.[taskIndex]
    ) {
      return;
    }

    const updatedColumns = [...columns];

    const [movedTask] = updatedColumns[sourceColIndex].tasks.splice(taskIndex, 1);

    if (updatedColumns[targetColIndex]) {
      updatedColumns[targetColIndex].tasks.push(movedTask);
    }

    setColumns(updatedColumns);
    localStorage.setItem("kanbanData", JSON.stringify(updatedColumns));
  };

  // ✅ Move columns within the board
  const moveColumn = (dragIndex, hoverIndex) => {
    if (
      dragIndex === undefined ||
      hoverIndex === undefined ||
      !columns[dragIndex] ||
      !columns[hoverIndex]
    ) {
      return;
    }

    const updatedColumns = [...columns];
    const [movedColumn] = updatedColumns.splice(dragIndex, 1);
    updatedColumns.splice(hoverIndex, 0, movedColumn);

    setColumns(updatedColumns);
    localStorage.setItem("kanbanData", JSON.stringify(updatedColumns));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
        {columns.map((column, index) => (
          <Column key={column?.id} column={column} columnIndex={index} moveTask={moveTask} moveColumn={moveColumn} />
        ))}
      </div>
    </DndProvider>
  );
};

export default KanbanBoard;
