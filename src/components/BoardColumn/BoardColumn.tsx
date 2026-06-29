import TaskCard from "../TaskCard/TaskCard";
import AddTaskInput from "../AddTaskInput/AddTaskInput";
import BoardHeader from "../BoardHeader/BoardHeader";
import type { BoardColumnProps } from "../../types/types";

const BoardColumn = ({
  boardId,
  title,
  tasks,
  index,
  editingBoardId,
  editingTitle,
  newTaskInput,
  onEditTitle,
  onSaveTitle,
  onTitleChange,
  onDragStart,
  onDragOver,
  onDrop,
  onDeleteTask,
  onDeleteBoard,
  onNewTaskChange,
  onAddTask,
  getBackgroundColor,
}: BoardColumnProps) => {
  return (
    <div
      className="board-col bg-white rounded-lg shadow p-6 min-h-96"
      onDragOver={onDragOver}
      onDrop={() => onDrop(boardId)}
    >
      <BoardHeader
        boardId={boardId}
        title={title}
        isEditing={editingBoardId === boardId}
        editingTitle={editingTitle}
        onEdit={onEditTitle}
        onSave={onSaveTitle}
        onTitleChange={onTitleChange}
        onDelete={onDeleteBoard}
      />

      <div className="space-y-3 mb-4">
        {tasks.map((task, taskIndex) => (
          <TaskCard
            key={taskIndex}
            task={task}
            taskIndex={taskIndex}
            boardId={boardId}
            backgroundColor={getBackgroundColor(index)}
            onDragStart={onDragStart}
            onDelete={onDeleteTask}
          />
        ))}
      </div>

      <AddTaskInput
        boardId={boardId}
        value={newTaskInput}
        onChange={onNewTaskChange}
        onAdd={onAddTask}
      />
    </div>
  );
};

export default BoardColumn;
