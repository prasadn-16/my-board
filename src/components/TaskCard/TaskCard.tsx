import { memo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import type { AppDispatch, RootState } from "@/store/store";
import { setDraggedTask, deleteTask, updateTask } from "@/store/boardSlice";
import type { TaskCardProps } from "@/types/types";

const TaskCard = memo(
  ({ task, taskIndex, boardId, backgroundColor }: TaskCardProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.auth.user);

    const [assigneeInput, setAssigneeInput] = useState(task.assignee || "");

    useEffect(() => {
      setAssigneeInput(task.assignee || "");
    }, [task.assignee]);

    const isAdmin = user?.role === "admin";
    const isAssignee = task.assignee === user?.email;
    const isUnassigned = !task.assignee;

    const hasPermission = isAdmin || isAssignee || isUnassigned;
    const isDraggable = isAdmin || isAssignee;

    const handleAssigneeBlur = () => {
      if (assigneeInput.trim() !== (task.assignee || "")) {
        dispatch(
          updateTask({
            boardId,
            taskIndex,
            updates: { assignee: assigneeInput.trim() },
            fallbackNewBoardId: uuidv4(),
          }),
        );
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") e.currentTarget.blur();
    };

    return (
      <div
        draggable={isDraggable}
        onDragStart={() => dispatch(setDraggedTask({ boardId, taskIndex }))}
        className={`${backgroundColor} p-3 rounded-lg ${isDraggable ? "cursor-move hover:shadow-md" : "opacity-90"} transition-all group flex flex-col gap-2`}
      >
        <div className="flex justify-between items-start gap-2">
          <div className="flex items-start gap-2 flex-1">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() =>
                dispatch(
                  updateTask({
                    boardId,
                    taskIndex,
                    updates: { completed: !task.completed },
                  }),
                )
              }
              disabled={!hasPermission}
              className="mt-1 cursor-pointer w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 disabled:opacity-50"
            />
            <div className="flex-1">
              <p
                className={`text-sm font-semibold text-gray-800 ${task.completed ? "line-through text-gray-400" : ""}`}
              >
                {task.title}
              </p>
              {task.description && (
                <p
                  className={`text-xs mt-1 ${task.completed ? "text-gray-400" : "text-gray-600"}`}
                >
                  {task.description}
                </p>
              )}

              {task.createdBy && (
                <div className="flex items-center gap-1 mt-2.5 text-[10px] text-gray-400 font-medium bg-gray-100 w-fit px-1.5 py-0.5 rounded">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Author: {task.createdBy.split("@")[0]}</span>
                </div>
              )}
            </div>
          </div>

          {isAdmin && (
            <button
              onClick={() => dispatch(deleteTask({ boardId, taskIndex }))}
              className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-sm font-bold transition-opacity shrink-0"
              title="Delete task"
            >
              ✕
            </button>
          )}
        </div>

        <div className="mt-2 pt-2 border-t border-gray-200 flex items-center justify-between">
          <input
            type="text"
            placeholder="Unassigned"
            value={assigneeInput}
            onChange={(e) => setAssigneeInput(e.target.value)}
            onBlur={handleAssigneeBlur}
            onKeyDown={handleKeyDown}
            disabled={!isAdmin && !isUnassigned && !isAssignee}
            className="text-xs bg-transparent border-none p-0 focus:ring-0 text-gray-500 w-full disabled:bg-transparent disabled:opacity-75"
          />
        </div>
      </div>
    );
  },
);

TaskCard.displayName = "TaskCard";
export default TaskCard;