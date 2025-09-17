import { useState, type FormEvent } from "react";
import { useAddTask } from "../Utils/TaskQuery";

type NewTaskFormProps = {
  setShowModal: (value: boolean) => void;
};

export function NewTaskForm({ setShowModal }: NewTaskFormProps) {
  const { mutate: addTask, isPending: isAdding } = useAddTask();
  const [task, setTask] = useState<string>();
  const [deadline, setDeadline] = useState<string>();
  const [importance, setImportance] = useState<number>(1);
  function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (task && deadline && importance) {
      addTask(
        { taskName: task, deadLine: deadline, importance },
        { onSuccess: () => setShowModal(false) }
      );
    }
  }
  return (
    <>
      <span className="font-bold text-center">new task</span>
      <form className="flex flex-col" onSubmit={handleAdd}>
        <label htmlFor="taskName">Task Details</label>
        <input
          type="text"
          name="taskName"
          id="taskName"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="border-b-1 border-gray-600 focus:outline-none"
        />
        <label htmlFor="deadline">Deadline</label>
        <input
          type="date"
          name="deadline"
          id="deadline"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="border-b-1 border-gray-600 focus:outline-none"
        />
        <label htmlFor="importance">Importance</label>
        <div className="flex flex-row">
          <span>low</span>
          <input
            type="range"
            name="importance"
            id="importance"
            min={1}
            max={4}
            value={importance}
            onChange={(e) => setImportance(Number.parseInt(e.target.value))}
            className="accent-amber-500"
          />
          <span>high </span>
        </div>
        <button type="submit" className="bg-amber-400 my-2 hover:opacity-75">
          {!isAdding ? "Add Task" : "Loading..."}
        </button>
      </form>
    </>
  );
}
