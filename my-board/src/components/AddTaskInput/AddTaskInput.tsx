interface AddTaskInputProps {
  boardId: string;
  value: string;
  onChange: (boardId: string, value: string) => void;
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
    <div className="task flex gap-2">
      <input
        type="text"
        placeholder="Add a task..."
        value={value}
        onChange={(e) => onChange(boardId, e.target.value)}
        onKeyDown={handleKeyPress}
        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        onClick={() => onAdd(boardId)}
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm font-medium"
      >
        Add
      </button>
    </div>
  );
};

export default AddTaskInput;
