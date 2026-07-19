import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { dropTask } from "../../store/boardSlice";
import TaskCard from "../TaskCard/TaskCard";
import AddTaskInput from "../AddTaskInput/AddTaskInput";
import BoardHeader from "../BoardHeader/BoardHeader";
import type { BoardColumnProps } from "../../types/types";

const BoardColumn = ({ boardId, index }: BoardColumnProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const board = useSelector((state: RootState) =>
    state.board.boards.find((b) => b.id === boardId),
  );

  if (!board) return null;

  const getBackgroundColor = (idx: number) => {
    const colors = [
      "bg-blue-100",
      "bg-yellow-100",
      "bg-green-100",
      "bg-purple-100",
      "bg-pink-100",
      "bg-orange-100",
    ];
    return colors[idx % colors.length];
  };

  return (
    <div
      className="board-col bg-white rounded-lg shadow p-6 min-h-96"
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => dispatch(dropTask(boardId))}
    >
      <BoardHeader boardId={boardId} title={board.title} />

      <div className="space-y-3 mb-4">
        {board.tasks.map((task, taskIndex) => (
          <TaskCard
            key={task.id}
            task={task}
            taskIndex={taskIndex}
            boardId={boardId}
            backgroundColor={getBackgroundColor(index)}
          />
        ))}
      </div>

      <AddTaskInput boardId={boardId} />
    </div>
  );
};

export default BoardColumn;
