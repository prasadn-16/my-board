import { useSelector, useDispatch } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { v4 as uuidv4 } from "uuid";
import type { RootState, AppDispatch } from "@/store/store";
import { addBoard } from "@/store/boardSlice";
import BoardColumn from "@/components/BoardColumn/BoardColumn";
import ActivityLog from "@/components/ActivityLog/ActivityLog";

const MainBoard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const boards = useSelector((state: RootState) => state.board.boards);
  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.role === "admin";

  return (
    // Changed to a flex-col layout to manage the screen space better
    <section className="board p-4 md:p-6 w-full min-h-screen bg-gray-100 text-gray-900 flex flex-col">
      <header className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            My Board
            {isAdmin && (
              <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full uppercase tracking-wide">
                Admin
              </span>
            )}
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Organize your tasks,{" "}
            <span className="font-medium text-indigo-600">
              {user?.email?.split("@")[0]}
            </span>
          </p>
        </div>

        <div className="flex w-full md:w-auto gap-3">
          <button
            onClick={() =>
              dispatch(addBoard({ id: uuidv4(), title: "New Board" }))
            }
            className="flex-1 md:flex-none px-4 md:px-6 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 font-medium shadow-sm text-sm md:text-base whitespace-nowrap"
          >
            + Add Column
          </button>
          <button
            onClick={() => signOut(auth)}
            className="flex-1 md:flex-none px-4 md:px-6 py-2.5 rounded-lg bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 font-medium shadow-sm text-sm md:text-base"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Board Area - Horizontally scrollable on mobile */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
        {/* Kanban Columns Wrapper */}
        <div className="flex-1 flex gap-4 md:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory items-start">
          {boards.map((board, index) => (
            <BoardColumn key={board.id} boardId={board.id} index={index} />
          ))}
        </div>

        {/* Activity Log Wrapper */}
        <div className="w-full lg:w-80 xl:w-96 shrink-0 mt-4 lg:mt-0">
          <ActivityLog />
        </div>
      </div>
    </section>
  );
};

export default MainBoard;