import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { dropTask } from "@/store/boardSlice";
import BoardHeader from "../BoardHeader/BoardHeader";
import TaskCard from "../TaskCard/TaskCard";
import AddTaskInput from "../AddTaskInput/AddTaskInput";
import type { BoardColumnProps } from "@/types/types";

const BoardColumn = ({
  boardId,
  filterMode = "standard",
  targetEmail,
}: BoardColumnProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const board = useSelector((state: RootState) =>
    state.board.boards.find((b) => b.id === boardId),
  );
  const draggedTask = useSelector(
    (state: RootState) => state.board.draggedTask,
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const searchQuery = useSelector(
    (state: RootState) => state.board.searchQuery,
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (draggedTask) {
      let newAssignee: string | null | undefined = undefined;

      if (filterMode === "user-workspace" && targetEmail) {
        newAssignee = targetEmail;
      } else if (filterMode === "admin-workspace") {
        newAssignee = "";
      }

      dispatch(
        dropTask({
          targetBoardId: boardId,
          sourceBoardId: draggedTask.boardId,
          taskIndex: draggedTask.taskIndex,
          newAssignee,
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
      <BoardHeader
        boardId={boardId}
        title={board.title}
        createdBy={board.createdBy}
      />

      <div className="flex flex-col gap-3 flex-1 overflow-y-auto min-h-[50px] pr-1">
        {board.tasks.map((task, index) => {
          const taskBelongsTo =
            task.assignee !== null && task.assignee !== undefined
              ? task.assignee === ""
                ? "system"
                : task.assignee
              : task.createdBy || "system";

          const isGlobalTask =
            taskBelongsTo === "system" ||
            taskBelongsTo.toLowerCase().includes("admin") ||
            taskBelongsTo === "Anonymous";

          const isVisible = (() => {
            if (filterMode === "admin-workspace") return isGlobalTask;
            if (filterMode === "user-workspace")
              return taskBelongsTo === targetEmail;
            if (filterMode === "standard")
              return taskBelongsTo === user?.email || isGlobalTask;
            return true;
          })();

          const matchesSearch = (() => {
            if (!searchQuery.trim()) return true;

            const query = searchQuery.toLowerCase();
            const matchesBoardTitle = board.title.toLowerCase().includes(query);

            // If user searched for the board title directly, show all tasks in this board
            if (matchesBoardTitle) return true;

            const matchesTaskTitle = task.title.toLowerCase().includes(query);
            const matchesDesc = task.description?.toLowerCase().includes(query);
            const matchesAssignee = task.assignee
              ?.toLowerCase()
              .includes(query);

            return matchesTaskTitle || matchesDesc || matchesAssignee;
          })();

          if (!isVisible || !matchesSearch) return null;

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

      <div className="shrink-0 pt-2 border-t border-gray-100 mt-2">
        <AddTaskInput boardId={boardId} targetAssignee={targetEmail || null} />
      </div>
    </div>
  );
};

export default BoardColumn;