import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import BoardColumn from "../../components/BoardColumn/BoardColumn";
import type { Task } from "../../types/types";
import type { Board } from "../../types/types";

const MainBoard = () => {
  const [boards, setBoards] = useState<Board[]>([
    {
      id: "1",
      title: "To Do",
      tasks: [{ id: uuidv4(), title: "Task 1", description: "" }],
    },
    {
      id: "2",
      title: "In Progress",
      tasks: [{ id: uuidv4(), title: "Task 2", description: "" }],
    },
    {
      id: "3",
      title: "Done",
      tasks: [{ id: uuidv4(), title: "Task 3", description: "" }],
    },
  ]);
  const [editingBoardId, setEditingBoardId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>("");
  const [draggedTask, setDraggedTask] = useState<{
    boardId: string;
    taskIndex: number;
  } | null>(null);
  const [newTaskInputs, setNewTaskInputs] = useState<
    Record<string, { title: string; description: string }>
  >({});

  // 1. Wrap with useCallback
  const handleAddBoard = useCallback(() => {
    const newBoard: Board = {
      id: uuidv4(), // Use a fresh ID here instead of the top-level one
      title: `Board ${boards.length + 1}`,
      tasks: [],
    };
    setBoards((prev) => [...prev, newBoard]);
  }, [boards.length]);

  // 2. Wrap with useCallback
  const handleEditTitle = useCallback(
    (boardId: string, currentTitle: string) => {
      setEditingBoardId(boardId);
      setEditingTitle(currentTitle);
    },
    [],
  );

  // 3. Wrap with useCallback (depends on editingTitle)
  const handleSaveTitle = useCallback(
    (boardId: string) => {
      setBoards((prev) =>
        prev.map((board) =>
          board.id === boardId ? { ...board, title: editingTitle } : board,
        ),
      );
      setEditingBoardId(null);
      setEditingTitle("");
    },
    [editingTitle],
  );

  // 4. Wrap with useCallback
  const handleDragStart = useCallback((boardId: string, taskIndex: number) => {
    setDraggedTask({ boardId, taskIndex });
  }, []);

  // 5. Wrap with useCallback
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  // 6. Wrap with useCallback (depends on boards and draggedTask)
  const handleDropTask = useCallback(
    (targetBoardId: string) => {
      if (!draggedTask) return;

      const sourceBoard = boards.find((b) => b.id === draggedTask.boardId);
      if (!sourceBoard) return;

      const draggedTaskText = sourceBoard.tasks[draggedTask.taskIndex];

      // Remove task from source board
      setBoards((prev) =>
        prev.map((board) =>
          board.id === draggedTask.boardId
            ? {
                ...board,
                tasks: board.tasks.filter(
                  (_, idx) => idx !== draggedTask.taskIndex,
                ),
              }
            : board,
        ),
      );

      // Add task to target board
      setBoards((prevBoards) =>
        prevBoards.map((board) =>
          board.id === targetBoardId
            ? { ...board, tasks: [...board.tasks, draggedTaskText] }
            : board,
        ),
      );

      setDraggedTask(null);
    },
    [draggedTask, boards],
  );

  const handleAddTask = useCallback(
    (boardId: string) => {
      const taskInput = newTaskInputs[boardId];
      const taskTitle = taskInput?.title?.trim();

      if (!taskTitle) return;

      const newTask: Task = {
        id: uuidv4(),
        title: taskTitle,
        description: taskInput?.description?.trim() || "",
      };

      setBoards((prevBoards) =>
        prevBoards.map((board) =>
          board.id === boardId
            ? { ...board, tasks: [...board.tasks, newTask] }
            : board,
        ),
      );

      setNewTaskInputs((prevInputs) => ({
        ...prevInputs,
        [boardId]: { title: "", description: "" },
      }));
    },
    [newTaskInputs],
  );

  // 8. Wrap with useCallback
  const handleDeleteTask = useCallback((boardId: string, taskIndex: number) => {
    setBoards((prev) =>
      prev.map((board) =>
        board.id === boardId
          ? {
              ...board,
              tasks: board.tasks.filter((_, idx) => idx !== taskIndex),
            }
          : board,
      ),
    );
  }, []);

  // 9. Converted to use `prev` and wrapped in useCallback
  const handleDeleteBoard = useCallback((boardId: string) => {
    setBoards((prev) => prev.filter((board) => board.id !== boardId));
  }, []);

  // 10. Extracted inline function from JSX into memoized callback
  const handleNewTaskChange = useCallback(
    (boardId: string, value: { title: string; description: string }) => {
      setNewTaskInputs((prev) => ({ ...prev, [boardId]: value }));
    },
    [],
  );

  // 11. Wrap with useCallback
  const getBackgroundColor = useCallback((index: number) => {
    const colors = [
      "bg-blue-100",
      "bg-yellow-100",
      "bg-green-100",
      "bg-purple-100",
      "bg-pink-100",
      "bg-orange-100",
    ];
    return colors[index % colors.length];
  }, []);

  return (
    <section className="board p-4 w-full min-h-screen bg-gray-100 text-gray-900">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">My Board</h1>
          <p className="text-gray-600 mt-2">Organize your tasks and projects</p>
        </div>
        <button
          onClick={handleAddBoard}
          className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
        >
          + Add Board
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max">
        {boards.map((board, index) => (
          <BoardColumn
            key={board.id}
            boardId={board.id}
            title={board.title}
            tasks={board.tasks}
            index={index}
            editingBoardId={editingBoardId}
            editingTitle={editingTitle}
            newTaskInput={
              newTaskInputs[board.id] || { title: "", description: "" }
            }
            onEditTitle={handleEditTitle}
            onSaveTitle={handleSaveTitle}
            onTitleChange={setEditingTitle} // useState setter, already memoized
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDropTask}
            onDeleteTask={handleDeleteTask}
            onDeleteBoard={handleDeleteBoard}
            onNewTaskChange={handleNewTaskChange} // Now references the memoized function
            onAddTask={handleAddTask}
            getBackgroundColor={getBackgroundColor}
          />
        ))}
      </div>
    </section>
  );
};

export default MainBoard;
