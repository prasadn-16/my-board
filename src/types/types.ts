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
  createdBy?: string;
}

export interface Board {
  id: string;
  title: string;
  tasks: Task[];
  createdBy?: string;
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
  filterMode?: "admin-workspace" | "user-workspace" | "standard";
  targetEmail?: string | null;
}
export interface BoardHeaderProps {
  boardId: string;
  title: string;
  createdBy?: string;
}
export interface AddTaskInputProps {
  boardId: string;
  targetAssignee?: string | null;
}
export interface TaskCardProps {
  task: Task;
  taskIndex: number;
  boardId: string;
  backgroundColor: string;
}