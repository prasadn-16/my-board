interface AddTaskInputProps {
  boardId: string;
  value: { title: string; description: string };
  onChange: (
    boardId: string,
    value: { title: string; description: string },
  ) => void;
  onAdd: (boardId: string) => void;
}

const AddTaskInput = ({
  boardId,
  value,
  onChange,
  onAdd,
}: AddTaskInputProps) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onAdd(boardId);
    }
  };

  return (
    <div className="task space-y-2">
      <input
        type="text"
        placeholder="Task title..."
        value={value.title}
        onChange={(e) => onChange(boardId, { ...value, title: e.target.value })}
        onKeyDown={handleKeyPress}
        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <textarea
        placeholder="Task description (optional)..."
        value={value.description}
        onChange={(e) =>
          onChange(boardId, { ...value, description: e.target.value })
        }
        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-16"
      />
      <button
        onClick={() => onAdd(boardId)}
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm font-medium"
      >
        Add Task
      </button>
    </div>
  );
};

export default AddTaskInput;
