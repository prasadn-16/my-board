import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { addBoard } from "../../store/boardSlice";
import BoardColumn from "../../components/BoardColumn/BoardColumn";

const MainBoard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const boards = useSelector((state: RootState) => state.board.boards);

  return (
    <section className="board p-4 w-full min-h-screen bg-gray-100 text-gray-900">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">My Board</h1>
          <p className="text-gray-600 mt-2">Organize your tasks and projects</p>
        </div>
        <button
          onClick={() => dispatch(addBoard())}
          className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
        >
          + Add Board
        </button>
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
