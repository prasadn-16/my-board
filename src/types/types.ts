export type UserRole = "admin" | "user";

export interface AuthUser {
  uid: string;
  email: string | null;
  role: UserRole;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  assignee: string | null;
}

export interface Board {
  id: string;
  title: string;
  tasks: Task[];
}

export interface ActivityLog {
  id: string;
  userEmail: string;
  message: string;
  timestamp: number;
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
