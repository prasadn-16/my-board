import { memo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { setDraggedTask, deleteTask, updateTask } from "@/store/boardSlice";
import type { TaskCardProps } from "@/types/types";

const TaskCard = memo(
  ({ task, taskIndex, boardId, backgroundColor }: TaskCardProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.auth.user);

    // Use local state so we don't spam the server on every keystroke!
    const [assigneeInput, setAssigneeInput] = useState(task.assignee || "");

    // Sync local state if it updates from the socket
    useEffect(() => {
      setAssigneeInput(task.assignee || "");
    }, [task.assignee]);

    const isAdmin = user?.role === "admin";
    const isAssignee = task.assignee === user?.email;
    const isUnassigned = !task.assignee;
    const hasPermission = isAdmin || isAssignee || isUnassigned;

    // Dispatch only when the user finishes typing and clicks away
    const handleAssigneeBlur = () => {
      if (assigneeInput.trim() !== (task.assignee || "")) {
        dispatch(
          updateTask({
            boardId,
            taskIndex,
            updates: { assignee: assigneeInput.trim() },
          }),
        );
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") e.currentTarget.blur(); // Trigger the blur event
    };

    return (
      <div
        draggable={hasPermission}
        onDragStart={() => dispatch(setDraggedTask({ boardId, taskIndex }))}
        className={`${backgroundColor} p-3 rounded-lg ${hasPermission ? "cursor-move hover:shadow-md" : "opacity-75"} transition-all group flex flex-col gap-2`}
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
              className="mt-1 cursor-pointer w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
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
            </div>
          </div>

          {hasPermission && (
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
            className="text-xs bg-transparent border-none p-0 focus:ring-0 text-gray-500 w-full disabled:bg-transparent"
          />
        </div>
      </div>
    );
  },
);

TaskCard.displayName = "TaskCard";
export default TaskCard;
