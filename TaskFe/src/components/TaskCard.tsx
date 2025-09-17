import { useState } from "react";
import { useDelTask, useUpdateTask } from "../Utils/TaskQuery";

type TaskCardProp = {
  id: string;
  taskName: string;
  active: boolean;
  importance: number;
  deadLine: string;
};

export function TaskCard({ data }: { data: TaskCardProp }) {
  const { mutate: deleteTask, isPending:isDeleting } = useDelTask();
  const {mutate:updateTask,isPending:isUpdating} = useUpdateTask()

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [taskName,setTaskName] = useState<string>(data.taskName)
  const [deadLine,setDeadline] = useState<string>(data.deadLine)
  const [importance,setImportance] = useState<number>(data.importance)

  function handleDelete() {
    deleteTask(data.id);
  }

  function handleUpdate(){
    updateTask({id:data.id,data:{taskName,deadLine,importance,active:data.active}},{onSuccess:()=>setIsEdit(false)})
  }


  return (
    <div className="flex flex-col border px-3 py-4 mx-3 my-0.5">
      {!isEdit ? (
        <>
          <span>{data.taskName}</span>
          <span>{data.deadLine}</span>
          <span>{data.importance}</span>
        </>
      ) : (
        <>
          <input type="text" name="taskName" id="taskName" value={taskName} onChange={(e)=>(setTaskName(e.target.value))} className="border-b-1 border-gray-600 focus:outline-none"/>
          <input type="date" name="deadline" id="deadline" value={deadLine} onChange={(e)=>(setDeadline(e.target.value))} className="border-b-1 border-gray-600 focus:outline-none"/>
          <div className="flex flex-row">
            <span>low</span>
            <input
              type="range"
              name="importance"
              id="importance"
              min={1}
              max={4}
              value={importance}
              onChange={(e)=>setImportance(Number.parseInt(e.target.value))}
              className="accent-amber-500"
            />
            <span>high </span>
          </div>
        </>
      )}

      {/* <span>{data.active}</span> */}

      <div className="flex flex-row gap-1">
        {!isEdit ? (
          <>
            <span onClick={() => setIsEdit(true)} className="bg-gray-300 rounded py-0.5 px-1.5 shadow hover:opacity-75">edit</span>
            <span onClick={handleDelete} className="bg-red-400 rounded py-0.5 px-1.5 shadow hover:opacity-75">
              {isDeleting ? "loading" : "delete"}
            </span>
          </>
        ) : (
          <>
            <span onClick={()=>setIsEdit(false)} className="bg-gray-300 rounded py-0.5 px-1.5 shadow hover:opacity-75">cancel</span>
            <span onClick={handleUpdate} className="bg-amber-400 rounded py-0.5 px-1.5 shadow hover:opacity-75">{isUpdating?"loading":"save"}</span>
          </>
        )}
      </div>
    </div>
  );
}
