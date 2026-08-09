import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { dropTask } from "@/store/boardSlice";
import BoardHeader from "../BoardHeader/BoardHeader";
import TaskCard from "../TaskCard/TaskCard";
import AddTaskInput from "../AddTaskInput/AddTaskInput";
import type { BoardColumnProps } from "@/types/types";

const BoardColumn = ({ boardId }: BoardColumnProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const board = useSelector((state: RootState) =>
    state.board.boards.find((b) => b.id === boardId),
  );
  const draggedTask = useSelector(
    (state: RootState) => state.board.draggedTask,
  );

  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.role === "admin";

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (draggedTask) {
      dispatch(
        dropTask({
          targetBoardId: boardId,
          sourceBoardId: draggedTask.boardId,
          taskIndex: draggedTask.taskIndex,
        }),
      );
    }
  };

  if (!board) return null;

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col gap-4 w-[280px] md:w-[320px] shrink-0 snap-center max-h-[70vh] lg:max-h-[calc(100vh-140px)]"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <BoardHeader boardId={boardId} title={board.title} />

      <div className="flex flex-col gap-3 flex-1 overflow-y-auto min-h-[50px] pr-1">
        {board.tasks.map((task, index) => {
          // VISIBILITY LOGIC: Admins see all. Users see their tasks AND unassigned tasks.
          const isVisible =
            isAdmin || task.assignee === user?.email || !task.assignee;

          if (!isVisible) return null;

          return (
            <TaskCard
              key={task.id}
              task={task}
              taskIndex={index}
              boardId={boardId}
              backgroundColor="bg-gray-50 border border-gray-100"
            />
          );
        })}
      </div>

      {/* ONLY ADMIN CAN CREATE TICKETS */}
      {isAdmin && (
        <div className="shrink-0 pt-2 border-t border-gray-100 mt-2">
          <AddTaskInput boardId={boardId} />
        </div>
      )}
    </div>
  );
};

export default BoardColumn;