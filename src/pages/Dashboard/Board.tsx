import { useSelector, useDispatch } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import type { RootState, AppDispatch } from "../../store/store";
import { addBoard } from "../../store/boardSlice";
import BoardColumn from "../../components/BoardColumn/BoardColumn";

const MainBoard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const boards = useSelector((state: RootState) => state.board.boards);
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <section className="board p-4 w-full min-h-screen bg-gray-100 text-gray-900">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold">My Board</h1>
          <p className="text-gray-600 mt-2">
            Organize your tasks,{" "}
            <span className="font-medium text-indigo-600">
              {user?.email?.split("@")[0]}
            </span>
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => dispatch(addBoard())}
            className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
          >
            + Add Board
          </button>

          <button
            onClick={handleLogout}
            className="px-6 py-2.5 rounded-lg bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:outline-none font-medium"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max">
        {boards.map((board, index) => (
          <BoardColumn key={board.id} boardId={board.id} index={index} />
        ))}
      </div>
    </section>
  );
};

export default MainBoard;