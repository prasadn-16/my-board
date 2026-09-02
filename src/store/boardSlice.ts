import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import type { Board, Task, ActivityLog } from "../types/types";

interface BoardState {
  boards: Board[];
  logs: ActivityLog[];
  editingBoardId: string | null;
  editingTitle: string;
  draggedTask: { boardId: string; taskIndex: number } | null;
  newTaskInputs: Record<
    string,
    { title: string; description: string; assignee: string }
  >;
  searchQuery: string;
}

const initialState: BoardState = {
  boards: [
    {
      id: "1",
      title: "To Do",
      createdBy: "system",
      tasks: [
        {
          id: uuidv4(),
          title: "Setup Project",
          description: "Initialize Vite app",
          completed: false,
          assignee: null,
          createdBy: "system",
        },
      ],
    },
  ],
  logs: [],
  editingBoardId: null,
  editingTitle: "",
  draggedTask: null,
  newTaskInputs: {},
  searchQuery: "",
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    addLog: (state, action: PayloadAction<ActivityLog>) => {
      state.logs.unshift(action.payload);
      if (state.logs.length > 50) state.logs.pop();
    },
    setLogs: (state, action: PayloadAction<ActivityLog[]>) => {
      state.logs = action.payload;
    },
    setEntireBoardState: (
      state,
      action: PayloadAction<Partial<BoardState>>,
    ) => {
      if (action.payload.boards) state.boards = action.payload.boards;
      if (action.payload.newTaskInputs)
        state.newTaskInputs = action.payload.newTaskInputs;
    },
    addBoard: (
      state,
      action: PayloadAction<{
        id: string;
        title: string;
        createdBy?: string;
        fromSocket?: boolean;
      }>,
    ) => {
      state.boards.push({
        id: action.payload.id,
        title: action.payload.title,
        createdBy: action.payload.createdBy || "Anonymous",
        tasks: [],
      });
    },
    deleteBoard: (
      state,
      action: PayloadAction<{ boardId: string; fromSocket?: boolean }>,
    ) => {
      state.boards = state.boards.filter(
        (board) => board.id !== action.payload.boardId,
      );
    },
    startEditingTitle: (
      state,
      action: PayloadAction<{ boardId: string; title: string }>,
    ) => {
      state.editingBoardId = action.payload.boardId;
      state.editingTitle = action.payload.title;
    },
    setEditingTitle: (state, action: PayloadAction<string>) => {
      state.editingTitle = action.payload;
    },
    saveBoardTitle: (
      state,
      action: PayloadAction<{
        boardId: string;
        title?: string;
        fromSocket?: boolean;
      }>,
    ) => {
      const board = state.boards.find((b) => b.id === action.payload.boardId);
      if (board) board.title = action.payload.title || state.editingTitle;
      state.editingBoardId = null;
      state.editingTitle = "";
    },
    setDraggedTask: (
      state,
      action: PayloadAction<{ boardId: string; taskIndex: number } | null>,
    ) => {
      state.draggedTask = action.payload;
    },
    updateNewTaskInput: (
      state,
      action: PayloadAction<{
        boardId: string;
        value: Partial<{
          title: string;
          description: string;
          assignee: string;
        }>;
      }>,
    ) => {
      const current = state.newTaskInputs[action.payload.boardId] || {
        title: "",
        description: "",
        assignee: "",
      };
      state.newTaskInputs[action.payload.boardId] = {
        ...current,
        ...action.payload.value,
      };
    },
    dropTask: (
      state,
      action: PayloadAction<{
        targetBoardId: string;
        sourceBoardId: string;
        taskIndex: number;
        newAssignee?: string | null;
        fromSocket?: boolean;
      }>,
    ) => {
      const { sourceBoardId, targetBoardId, taskIndex, newAssignee } =
        action.payload;
      const sourceBoard = state.boards.find((b) => b.id === sourceBoardId);
      const targetBoard = state.boards.find((b) => b.id === targetBoardId);

      if (sourceBoard && targetBoard) {
        const [taskToMove] = sourceBoard.tasks.splice(taskIndex, 1);
        if (newAssignee !== undefined) {
          taskToMove.assignee = newAssignee;
        }
        targetBoard.tasks.push(taskToMove);
      }
      state.draggedTask = null;
    },
    addTask: (
      state,
      action: PayloadAction<{
        boardId: string;
        task: Task;
        fromSocket?: boolean;
      }>,
    ) => {
      const board = state.boards.find((b) => b.id === action.payload.boardId);
      if (board) {
        board.tasks.push(action.payload.task);
        if (!action.payload.fromSocket) {
          state.newTaskInputs[action.payload.boardId] = {
            title: "",
            description: "",
            assignee: "",
          };
        }
      }
    },
    updateTask: (
      state,
      action: PayloadAction<{
        boardId: string;
        taskIndex: number;
        updates: Partial<Task>;
        fallbackNewBoardId?: string;
        fromSocket?: boolean;
      }>,
    ) => {
      const { boardId, taskIndex, updates, fallbackNewBoardId } =
        action.payload;
      const board = state.boards.find((b) => b.id === boardId);
      if (!board || !board.tasks[taskIndex]) return;

      const task = board.tasks[taskIndex];
      const newAssignee = updates.assignee;

      // FIX: Ensure newAssignee is strictly a string to satisfy TypeScript
      if (
        typeof newAssignee === "string" &&
        newAssignee.trim() !== "" &&
        newAssignee !== task.assignee
      ) {
        const isGlobal = (b: Board) =>
          !b.createdBy ||
          b.createdBy === "system" ||
          b.createdBy.toLowerCase().includes("admin") ||
          b.createdBy === "Anonymous";
        const isVisibleTo = (b: Board, email: string) =>
          isGlobal(b) || b.createdBy === email;

        if (!isVisibleTo(board, newAssignee)) {
          // FIX: Use findIndex instead of find to prevent Redux Toolkit Draft errors
          let targetBoardIndex = state.boards.findIndex(
            (b) => b.title === board.title && isVisibleTo(b, newAssignee),
          );

          if (targetBoardIndex === -1 && fallbackNewBoardId) {
            state.boards.push({
              id: fallbackNewBoardId,
              title: board.title,
              createdBy: newAssignee,
              tasks: [],
            });
            // Update the index to point to our newly pushed board
            targetBoardIndex = state.boards.length - 1;
          }

          if (targetBoardIndex !== -1) {
            const [taskToMove] = board.tasks.splice(taskIndex, 1);
            Object.assign(taskToMove, updates);
            state.boards[targetBoardIndex].tasks.push(taskToMove);
            return;
          }
        }
      }

      board.tasks[taskIndex] = {
        ...board.tasks[taskIndex],
        ...updates,
      };
    },
    deleteTask: (
      state,
      action: PayloadAction<{
        boardId: string;
        taskIndex: number;
        fromSocket?: boolean;
      }>,
    ) => {
      const board = state.boards.find((b) => b.id === action.payload.boardId);
      if (board) board.tasks.splice(action.payload.taskIndex, 1);
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const {
  addLog,
  setLogs,
  setEntireBoardState,
  addBoard,
  deleteBoard,
  startEditingTitle,
  setEditingTitle,
  saveBoardTitle,
  setDraggedTask,
  dropTask,
  updateNewTaskInput,
  addTask,
  updateTask,
  deleteTask,
  setSearchQuery,
} = boardSlice.actions;

export default boardSlice.reducer;