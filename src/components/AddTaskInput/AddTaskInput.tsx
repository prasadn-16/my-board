import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import type { RootState, AppDispatch } from "@/store/store";
import { updateNewTaskInput, addTask } from "@/store/boardSlice";
import type { AddTaskInputProps } from "@/types/types";

const defaultInput = { title: "", description: "", assignee: "" };

const AddTaskInput = ({ boardId, targetAssignee }: AddTaskInputProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const value = useSelector(
    (state: RootState) => state.board.newTaskInputs[boardId] || defaultInput,
  );

  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.role === "admin";
  const isTitleEmpty = !value.title.trim();

  const submitTask = () => {
    if (!isTitleEmpty) {
      dispatch(
        addTask({
          boardId,
          task: {
            id: uuidv4(),
            title: value.title.trim(),
            description: value.description?.trim() || "",
            completed: false,
            assignee:
              targetAssignee !== undefined
                ? targetAssignee
                : isAdmin
                  ? null
                  : user?.email || null,
            createdBy: user?.email || "Anonymous",
          },
        }),
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isTitleEmpty) submitTask();
  };

  return (
    <div className="task space-y-2">
      <input
        type="text"
        placeholder="Task title (Required)..."
        value={value.title}
        onChange={(e) =>
          dispatch(
            updateNewTaskInput({ boardId, value: { title: e.target.value } }),
          )
        }
        onKeyDown={handleKeyPress}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <textarea
        placeholder="Task description (optional)..."
        value={value.description}
        onChange={(e) =>
          dispatch(
            updateNewTaskInput({
              boardId,
              value: { description: e.target.value },
            }),
          )
        }
        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-16"
      />
      <button
        onClick={submitTask}
        disabled={isTitleEmpty}
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
      >
        Add Task
      </button>
    </div>
  );
};

export default AddTaskInput;