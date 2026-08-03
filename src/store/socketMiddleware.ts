import type { Middleware } from '@reduxjs/toolkit';
import { io, Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { addLog, setLogs, setEntireBoardState } from './boardSlice';
import type { ActivityLog, Board } from '../types/types';

interface MasterStatePayload {
  boards: Board[];
  newTaskInputs: Record<string, { title: string; description: string; assignee: string }>;
}

interface BoardAction {
  type: string;
  payload?: {
    boardId?: string; title?: string; task?: { title: string }; updates?: { completed?: boolean; assignee?: string };
    taskIndex?: number; fromSocket?: boolean; sourceBoardId?: string; targetBoardId?: string; [key: string]: unknown; 
  };
}

interface RootStateSubset {
  auth: { user: { email: string | null } | null };
  board: { boards: Board[] }; 
}

let socket: Socket | null = null;

export const socketMiddleware: Middleware = store => {
  return next => action => {
    if (!socket) {
      socket = io('http://localhost:3001');
      
      socket.on('board:stateSync', (masterState: MasterStatePayload) => {
        store.dispatch(setEntireBoardState(masterState));
      });

      socket.on('board:sync', (data: { action: BoardAction; log: ActivityLog }) => {
        const socketAction = { ...data.action, payload: { ...(data.action.payload || {}), fromSocket: true } };
        store.dispatch(socketAction);
        if (data.log) store.dispatch(addLog(data.log));
      });

      socket.on('board:history', (logs: ActivityLog[]) => {
        store.dispatch(setLogs(logs));
      });
    }

    const typedAction = action as BoardAction;
    
    // FIX: We added 'board/addLog' and 'board/setLogs' to this list 
    // so they never accidentally overwrite the server's master state!
    const isUIAction = [
      'board/updateNewTaskInput', 
      'board/startEditingTitle', 
      'board/setEditingTitle', 
      'board/setDraggedTask',
      'board/setEntireBoardState',
      'board/addLog',
      'board/setLogs'
    ].includes(typedAction.type);

    const prevState = store.getState() as RootStateSubset;
    const getPrevBoardTitle = (id?: string) => prevState.board.boards.find(b => b.id === id)?.title || 'a column';
    const getPrevTaskTitle = (boardId?: string, taskIndex?: number) => {
      if (boardId === undefined || taskIndex === undefined) return 'a ticket';
      return prevState.board.boards.find(b => b.id === boardId)?.tasks[taskIndex]?.title || 'a ticket';
    };

    const result = next(action);
    
    if (typedAction.type.startsWith('board/') && !isUIAction && !typedAction.payload?.fromSocket) {
      
      const currentState = store.getState() as RootStateSubset;
      const user = currentState.auth.user;
      const username = user?.email ? user.email.split('@')[0] : 'Someone';
      
      const getCurrentBoardTitle = (id?: string) => currentState.board.boards.find(b => b.id === id)?.title || 'a column';
      const getCurrentTaskTitle = (boardId?: string, taskIndex?: number) => {
        if (boardId === undefined || taskIndex === undefined) return 'a ticket';
        return currentState.board.boards.find(b => b.id === boardId)?.tasks[taskIndex]?.title || 'a ticket';
      };

      let message: string | null = null;

      switch (typedAction.type) {
        case 'board/addTask': message = `${username} created ticket "${typedAction.payload?.task?.title}" in "${getCurrentBoardTitle(typedAction.payload?.boardId)}"`; break;
        case 'board/updateTask': {
          const taskTitle = getCurrentTaskTitle(typedAction.payload?.boardId, typedAction.payload?.taskIndex);
          if (typedAction.payload?.updates?.completed !== undefined) {
            const status = typedAction.payload.updates.completed ? 'completed' : 're-opened';
            message = `${username} marked "${taskTitle}" as ${status} in "${getCurrentBoardTitle(typedAction.payload?.boardId)}"`;
          } else if (typedAction.payload?.updates?.assignee !== undefined) {
            const target = typedAction.payload.updates.assignee || 'Unassigned';
            message = `${username} assigned "${taskTitle}" to ${target}`;
          } else {
            message = `${username} updated "${taskTitle}" in "${getCurrentBoardTitle(typedAction.payload?.boardId)}"`;
          }
          break;
        }
        case 'board/deleteTask': message = `${username} deleted "${getPrevTaskTitle(typedAction.payload?.boardId, typedAction.payload?.taskIndex)}" from "${getCurrentBoardTitle(typedAction.payload?.boardId)}"`; break;
        case 'board/dropTask': {
          const taskTitle = getPrevTaskTitle(typedAction.payload?.sourceBoardId, typedAction.payload?.taskIndex);
          if (typedAction.payload?.sourceBoardId === typedAction.payload?.targetBoardId) {
            message = `${username} reordered "${taskTitle}" in "${getCurrentBoardTitle(typedAction.payload?.targetBoardId)}"`;
          } else {
            message = `${username} moved "${taskTitle}" from "${getPrevBoardTitle(typedAction.payload?.sourceBoardId)}" to "${getCurrentBoardTitle(typedAction.payload?.targetBoardId)}"`;
          }
          break;
        }
        case 'board/addBoard': message = `${username} created column "${typedAction.payload?.title || 'New Board'}"`; break;
        case 'board/saveBoardTitle': message = `${username} renamed a column to "${getCurrentBoardTitle(typedAction.payload?.boardId)}"`; break;
        case 'board/deleteBoard': message = `${username} deleted column "${getPrevBoardTitle(typedAction.payload?.boardId)}"`; break;
      }
      
      let logPayload: ActivityLog | null = null;
      if (message) {
        logPayload = { id: uuidv4(), userEmail: user?.email || 'Anonymous', message, timestamp: Date.now() };
        store.dispatch(addLog(logPayload)); 
      }

      const finalBoardState = currentState.board;
      
      socket.emit('board:action', { 
        action: typedAction, 
        log: logPayload,
        fullState: finalBoardState 
      });
    }

    return result;
  };
};