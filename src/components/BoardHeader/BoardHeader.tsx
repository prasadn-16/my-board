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
  const isEditing = useSelector(
    (state: RootState) => state.board.editingBoardId === boardId,
  );
  const editingTitle = useSelector(
    (state: RootState) => state.board.editingTitle,
  );
  
  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.role === "admin";

  return (
    <>
      {isEditing ? (
        <div className="flex gap-2 mb-2 w-full">
          <input
            type="text"
            value={editingTitle}
            onChange={(e) => dispatch(setEditingTitle(e.target.value))}
            onKeyDown={(e) =>
              e.key === "Enter" && dispatch(saveBoardTitle({ boardId }))
            }
            className="flex-1 min-w-0 px-2 py-1 border border-indigo-300 rounded text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoFocus
          />
          <button
            onClick={() => dispatch(saveBoardTitle({ boardId }))}
            className="shrink-0 px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm font-medium"
          >
            Save
          </button>
        </div>
      ) : (
        <div className="flex justify-between items-center mb-2 group">
          {/* ONLY ADMIN CAN RENAME COLUMNS */}
          <div
            onClick={() =>
              isAdmin && dispatch(startEditingTitle({ boardId, title }))
            }
            className={`text-lg font-semibold flex-1 ${isAdmin ? "cursor-pointer hover:text-indigo-600" : ""} transition-colors break-words min-w-0 pr-2`}
          >
            {title}
          </div>

          {/* ONLY ADMIN CAN DELETE COLUMNS */}
          {isAdmin && (
            <button
              onClick={() => dispatch(deleteBoard({ boardId }))}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition-opacity shrink-0"
              title="Delete Column"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default BoardHeader;