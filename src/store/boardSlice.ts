import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import type { Board } from "../types/types";

interface BoardState {
  boards: Board[];
  editingBoardId: string | null;
  editingTitle: string;
  draggedTask: { boardId: string; taskIndex: number } | null;
  newTaskInputs: Record<string, { title: string; description: string }>;
}

const initialState: BoardState = {
  boards: [
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
  ],
  editingBoardId: null,
  editingTitle: "",
  draggedTask: null,
  newTaskInputs: {},
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    addBoard: (state) => {
      state.boards.push({
        id: uuidv4(),
        title: `Board ${state.boards.length + 1}`,
        tasks: [],
      });
    },
    deleteBoard: (state, action: PayloadAction<string>) => {
      state.boards = state.boards.filter(
        (board) => board.id !== action.payload,
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
    saveBoardTitle: (state, action: PayloadAction<string>) => {
      const board = state.boards.find((b) => b.id === action.payload);
      if (board) {
        board.title = state.editingTitle;
      }
      state.editingBoardId = null;
      state.editingTitle = "";
    },
    setDraggedTask: (
      state,
      action: PayloadAction<{ boardId: string; taskIndex: number } | null>,
    ) => {
      state.draggedTask = action.payload;
    },
    dropTask: (state, action: PayloadAction<string>) => {
      const targetBoardId = action.payload;
      if (!state.draggedTask) return;

      const sourceBoard = state.boards.find(
        (b) => b.id === state.draggedTask!.boardId,
      );
      const targetBoard = state.boards.find((b) => b.id === targetBoardId);

      if (sourceBoard && targetBoard) {
        const taskToMove = sourceBoard.tasks[state.draggedTask.taskIndex];
        sourceBoard.tasks.splice(state.draggedTask.taskIndex, 1);
        targetBoard.tasks.push(taskToMove);
      }
      state.draggedTask = null;
    },
    updateNewTaskInput: (
      state,
      action: PayloadAction<{
        boardId: string;
        value: { title: string; description: string };
      }>,
    ) => {
      state.newTaskInputs[action.payload.boardId] = action.payload.value;
    },
    addTask: (state, action: PayloadAction<string>) => {
      const boardId = action.payload;
      const input = state.newTaskInputs[boardId];
      const taskTitle = input?.title?.trim();

      if (taskTitle) {
        const board = state.boards.find((b) => b.id === boardId);
        if (board) {
          board.tasks.push({
            id: uuidv4(),
            title: taskTitle,
            description: input.description?.trim() || "",
          });
        }
        state.newTaskInputs[boardId] = { title: "", description: "" };
      }
    },
    deleteTask: (
      state,
      action: PayloadAction<{ boardId: string; taskIndex: number }>,
    ) => {
      const board = state.boards.find((b) => b.id === action.payload.boardId);
      if (board) {
        board.tasks.splice(action.payload.taskIndex, 1);
      }
    },
  },
});

export const {
  addBoard,
  deleteBoard,
  startEditingTitle,
  setEditingTitle,
  saveBoardTitle,
  setDraggedTask,
  dropTask,
  updateNewTaskInput,
  addTask,
  deleteTask,
} = boardSlice.actions;

export default boardSlice.reducer;
