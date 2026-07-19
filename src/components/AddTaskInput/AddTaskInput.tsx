import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { updateNewTaskInput, addTask } from "../../store/boardSlice";
import type { AddTaskInputProps } from "../../types/types";

const AddTaskInput = ({ boardId }: AddTaskInputProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const value = useSelector(
    (state: RootState) =>
      state.board.newTaskInputs[boardId] || { title: "", description: "" },
  );

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      dispatch(addTask(boardId));
    }
  };

  return (
    <div className="task space-y-2">
      <input
        type="text"
        placeholder="Task title..."
        value={value.title}
        onChange={(e) =>
          dispatch(
            updateNewTaskInput({
              boardId,
              value: { ...value, title: e.target.value },
            }),
          )
        }
        onKeyDown={handleKeyPress}
        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <textarea
        placeholder="Task description (optional)..."
        value={value.description}
        onChange={(e) =>
          dispatch(
            updateNewTaskInput({
              boardId,
              value: { ...value, description: e.target.value },
            }),
          )
        }
        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-16"
      />
      <button
        onClick={() => dispatch(addTask(boardId))}
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm font-medium"
      >
        Add Task
      </button>
    </div>
  );
};

export default AddTaskInput;
