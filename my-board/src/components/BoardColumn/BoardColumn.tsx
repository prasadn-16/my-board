import TaskCard from "../TaskCard/TaskCard";
import AddTaskInput from "../AddTaskInput/AddTaskInput";
import BoardHeader from "../BoardHeader/BoardHeader";

interface BoardColumnProps {
  boardId: string;
  title: string;
  tasks: Array<{ id: string; title: string; description: string }>;
  index: number;
  editingBoardId: string | null;
  editingTitle: string;
  newTaskInput: { title: string; description: string };
  onEditTitle: (boardId: string, currentTitle: string) => void;
  onSaveTitle: (boardId: string) => void;
  onTitleChange: (value: string) => void;
  onDragStart: (boardId: string, taskIndex: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (boardId: string) => void;
  onDeleteTask: (boardId: string, taskIndex: number) => void;
  onDeleteBoard: (boardId: string) => void;
  onNewTaskChange: (
    boardId: string,
    value: { title: string; description: string },
  ) => void;
  onAddTask: (boardId: string) => void;
  getBackgroundColor: (index: number) => string;
}

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
      {/* Board Header */}
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

      {/* Tasks */}
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

      {/* Add Task Input */}
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
