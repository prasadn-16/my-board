import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import {
  startEditingTitle,
  setEditingTitle,
  saveBoardTitle,
  deleteBoard,
} from "@/store/boardSlice";
import type { BoardHeaderProps } from "@/types/types";

const BoardHeader = ({ boardId, title }: BoardHeaderProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const isEditing = useSelector((state: RootState) => state.board.editingBoardId === boardId);
  const editingTitle = useSelector((state: RootState) => state.board.editingTitle);

  return (
    <>
      {isEditing ? (
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={editingTitle}
            onChange={(e) => dispatch(setEditingTitle(e.target.value))}
            className="flex-1 px-2 py-1 border border-gray-300 rounded text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoFocus
          />
          <button
            onClick={() => dispatch(saveBoardTitle(boardId))}
            className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm font-medium"
          >
            Save
          </button>
        </div>
      ) : (
        <div className="flex justify-between items-center mb-4 group">
          <div
            onClick={() => dispatch(startEditingTitle({ boardId, title }))}
            className="text-xl font-semibold cursor-pointer hover:text-indigo-600 transition-colors flex-1"
          >
            {title}
          </div>
          <button
            onClick={() => dispatch(deleteBoard(boardId))}
            className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800 text-sm font-bold transition-opacity"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
};

export default BoardHeader;