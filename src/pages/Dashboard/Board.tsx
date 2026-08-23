import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { v4 as uuidv4 } from "uuid";
import type { RootState, AppDispatch } from "@/store/store";
import { addBoard, setSearchQuery } from "@/store/boardSlice";
import { useDebounce } from "@/hooks/useDebounce";
import BoardColumn from "@/components/BoardColumn/BoardColumn";
import ActivityLog from "@/components/ActivityLog/ActivityLog";
import type { Task } from "@/types/types"; // Import Task type

const MainBoard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const boards = useSelector((state: RootState) => state.board.boards);
  const user = useSelector((state: RootState) => state.auth.user);
  const searchQuery = useSelector(
    (state: RootState) => state.board.searchQuery,
  );
  const isAdmin = user?.role === "admin";

  const [localSearch, setLocalSearch] = useState("");
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    dispatch(setSearchQuery(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  const allEmails = new Set<string>();
  boards.forEach((b) => {
    if (
      b.createdBy &&
      !b.createdBy.toLowerCase().includes("admin") &&
      b.createdBy !== "system" &&
      b.createdBy !== "Anonymous"
    ) {
      allEmails.add(b.createdBy);
    }
    b.tasks.forEach((t) => {
      if (t.assignee && !t.assignee.toLowerCase().includes("admin")) {
        allEmails.add(t.assignee);
      }
      if (
        t.createdBy &&
        !t.createdBy.toLowerCase().includes("admin") &&
        t.createdBy !== "system" &&
        t.createdBy !== "Anonymous"
      ) {
        allEmails.add(t.createdBy);
      }
    });
  });
  allEmails.delete(user?.email || "");
  const uniqueUsers = Array.from(allEmails);

  // Helper function to check if a task is visible in a given context (using strict Task type instead of any)
  const isTaskVisibleForUser = (
    task: Task,
    filterMode: string,
    targetEmail: string | null,
  ) => {
    const taskBelongsTo =
      task.assignee !== null && task.assignee !== undefined
        ? task.assignee === ""
          ? "system"
          : task.assignee
        : task.createdBy || "system";

    const isGlobalTask =
      taskBelongsTo === "system" ||
      taskBelongsTo.toLowerCase().includes("admin") ||
      taskBelongsTo === "Anonymous";

    if (filterMode === "admin-workspace") return isGlobalTask;
    if (filterMode === "user-workspace") return taskBelongsTo === targetEmail;
    if (filterMode === "standard")
      return taskBelongsTo === user?.email || isGlobalTask;
    return true;
  };

  const getVisibleBoards = (
    targetEmail: string | null,
    isStandardView: boolean = false,
    filterMode: string = "standard",
  ) => {
    return boards.filter((b) => {
      const isInWorkspace = (() => {
        if (b.createdBy === "system") return true;
        if (isStandardView) return b.createdBy === user?.email;
        if (targetEmail) return b.createdBy === targetEmail;
        return b.createdBy === user?.email;
      })();

      if (!isInWorkspace) return false;

      if (!searchQuery.trim()) return true;

      const query = searchQuery.toLowerCase();
      const matchesBoardTitle = b.title.toLowerCase().includes(query);

      const hasMatchingTask = b.tasks.some((task) => {
        const isVisible = isTaskVisibleForUser(task, filterMode, targetEmail);
        if (!isVisible) return false;

        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = task.description?.toLowerCase().includes(query);
        const matchesAssignee = task.assignee?.toLowerCase().includes(query);

        return matchesTitle || matchesDesc || matchesAssignee;
      });

      return matchesBoardTitle || hasMatchingTask;
    });
  };

  return (
    <section className="board p-4 md:p-6 w-full min-h-screen bg-gray-100 text-gray-900 flex flex-col">
      <header className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            My Board
            {isAdmin && (
              <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full uppercase tracking-wide">
                Admin Console
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

        <div className="flex flex-wrap w-full md:w-auto gap-3 items-center">
          <div className="relative flex-1 md:flex-none">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search tasks or users..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full md:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>

          <button
            onClick={() =>
              dispatch(
                addBoard({
                  id: uuidv4(),
                  title: "New Board",
                  createdBy: user?.email || "Anonymous",
                }),
              )
            }
            className="flex-1 md:flex-none px-4 md:px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 font-medium shadow-sm text-sm md:text-base whitespace-nowrap"
          >
            + Add Column
          </button>
          <button
            onClick={() => signOut(auth)}
            className="flex-1 md:flex-none px-4 md:px-6 py-2 rounded-lg bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 font-medium shadow-sm text-sm md:text-base"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
        {isAdmin ? (
          <div className="flex-1 overflow-y-auto pr-2 space-y-8 pb-8">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-900">
                <span className="text-2xl">👑</span> Admin Workspace (Yours &
                Unassigned)
              </h2>
              <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory items-start">
                {getVisibleBoards(null, false, "admin-workspace").map(
                  (board, index) => (
                    <BoardColumn
                      key={`admin-${board.id}`}
                      boardId={board.id}
                      index={index}
                      filterMode="admin-workspace"
                      targetEmail={null}
                    />
                  ),
                )}
              </div>
            </div>

            {uniqueUsers.map((assignee) => (
              <div
                key={assignee}
                className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm"
              >
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                  <span className="text-2xl">👤</span> {assignee}'s Workspace
                </h2>
                <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory items-start">
                  {getVisibleBoards(assignee, false, "user-workspace").map(
                    (board, index) => (
                      <BoardColumn
                        key={`${assignee}-${board.id}`}
                        boardId={board.id}
                        index={index}
                        filterMode="user-workspace"
                        targetEmail={assignee}
                      />
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex gap-4 md:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory items-start">
            {getVisibleBoards(null, true, "standard").map((board, index) => (
              <BoardColumn
                key={board.id}
                boardId={board.id}
                index={index}
                filterMode="standard"
              />
            ))}
          </div>
        )}

        <div className="w-full lg:w-80 xl:w-96 shrink-0 mt-4 lg:mt-0">
          <ActivityLog />
        </div>
      </div>
    </section>
  );
};

export default MainBoard;
