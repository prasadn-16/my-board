export interface Task {
  id: string;
  title: string;
  description: string;
}

export interface Board {
  id: string;
  title: string;
  tasks: Task[];
}

export interface BoardColumnProps {
  boardId: string;
  title: string;
  tasks: Array<{ id: string; title: string; description: string }>;
  index: number;
  editingBoardId: string | null;
  editingTitle: string;
  newTaskInput: { title: string; description: string };
  onEditTitle: (boardId: string, currentTitle: string) => void;
  onSaveTitle: (boardId: string) => void;
  onTitleChange: (value: string) => void;
  onDragStart: (boardId: string, taskIndex: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (boardId: string) => void;
  onDeleteTask: (boardId: string, taskIndex: number) => void;
  onDeleteBoard: (boardId: string) => void;
  onNewTaskChange: (
    boardId: string,
    value: { title: string; description: string },
  ) => void;
  onAddTask: (boardId: string) => void;
  getBackgroundColor: (index: number) => string;
}
export interface BoardHeaderProps {
  boardId: string;
  title: string;
  isEditing: boolean;
  editingTitle: string;
  onEdit: (boardId: string, currentTitle: string) => void;
  onSave: (boardId: string) => void;
  onTitleChange: (value: string) => void;
  onDelete: (boardId: string) => void;
}
export interface AddTaskInputProps {
  boardId: string;
  value: { title: string; description: string };
  onChange: (
    boardId: string,
    value: { title: string; description: string },
  ) => void;
  onAdd: (boardId: string) => void;
}

export interface TaskCardProps {
  task: Task;
  taskIndex: number;
  boardId: string;
  backgroundColor: string;
  onDragStart: (boardId: string, taskIndex: number) => void;
  onDelete: (boardId: string, taskIndex: number) => void;
}
