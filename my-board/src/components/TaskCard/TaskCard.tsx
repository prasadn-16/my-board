interface TaskCardProps {
  task: string;
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
      className={`${backgroundColor} p-3 rounded cursor-move hover:opacity-80 transition-opacity group flex justify-between items-center`}
    >
      <p className="text-sm text-gray-800 flex-1">{task}</p>
      <button
        onClick={() => onDelete(boardId, taskIndex)}
        className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800 text-sm font-bold transition-opacity"
      >
        ✕
      </button>
    </div>
  );
};

export default TaskCard;
