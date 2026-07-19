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
  index: number;
}

export interface BoardHeaderProps {
  boardId: string;
  title: string;
}

export interface AddTaskInputProps {
  boardId: string;
}

export interface TaskCardProps {
  task: Task;
  taskIndex: number;
  boardId: string;
  backgroundColor: string;
}
