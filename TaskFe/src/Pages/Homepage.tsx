import { Modal } from "../components/Modal";
import { NewTaskForm } from "../components/NewTaskForm";
import { TaskCard } from "../components/TaskCard";
import { useGetTask } from "../Utils/TaskQuery";

export function Homepage() {
  const { data, isError, isLoading } = useGetTask();

  if (isLoading) return <div>Loading</div>;
  if (isError)
    return (
      <div>
        Error <div>Please Try again later</div>
      </div>
    );
  return (
    <>
      {data
        ? data.map((each) => <TaskCard data={each} key={each.id} />)
        : "No Task"}
      <Modal>
        <Modal.Window>{(fn) => <NewTaskForm setShowModal={fn} />}</Modal.Window>
        <Modal.Trigger>
          <div className="flex items-center justify-center fixed bottom-2 right-2 border-1 h-16 w-16 bg-amber-400 rounded-full cursor-pointer">
            ➕
          </div>
        </Modal.Trigger>
      </Modal>
    </>
  );
}
