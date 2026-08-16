import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import type { RootState } from "@/store/store";

const ActivityLog = () => {
  const logs = useSelector((state: RootState) => state.board.logs);

  return (
    // Changed height logic to be responsive 
    <aside className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col h-[400px] lg:h-[calc(100vh-120px)] lg:sticky lg:top-4">
      <div className="border-b border-gray-100 pb-3 mb-3">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse border border-white"></span>
          Real-time Activity
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {logs.length === 0 ? (
          <p className="text-sm text-gray-500 italic text-center mt-4">No recent activity.</p>
        ) : (
          logs.map((log) => {
            const username = log.userEmail.split('@')[0];
            const actionText = log.message.replace(username, '').trim();
            
            return (
              <div key={log.id} className="text-sm leading-relaxed border-l-2 border-indigo-100 pl-3 py-1">
                <p className="text-gray-800">
                  <span className="font-semibold text-indigo-700">{username}</span>
                  {" "}{actionText}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDistanceToNow(log.timestamp, { addSuffix: true })}
                </p>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};

export default ActivityLog;