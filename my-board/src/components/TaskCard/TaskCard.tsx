interface Task {
  id: string;
  title: string;
  description: string;
}

interface TaskCardProps {
  task: Task;
  taskIndex: number;
  boardId: string;
  backgroundColor: string;
  onDragStart: (boardId: string, taskIndex: number) => void;
  onDelete: (boardId: string, taskIndex: number) => void;
}

const TaskCard = ({
  task,
  taskIndex,
  boardId,
  backgroundColor,
  onDragStart,
  onDelete,
}: TaskCardProps) => {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(boardId, taskIndex)}
      className={`${backgroundColor} p-3 rounded cursor-move hover:opacity-80 transition-opacity group flex justify-between items-start gap-2`}
    >
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-800">{task.title}</p>
        {task.description && (
          <p className="text-xs text-gray-600 mt-1">{task.description}</p>
        )}
      </div>
      <button
        onClick={() => onDelete(boardId, taskIndex)}
        className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800 text-sm font-bold transition-opacity flex-shrink-0"
      >
        ✕
      </button>
    </div>
  );
};

export default TaskCard;
