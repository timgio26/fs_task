import {
  createContext,
  useContext,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";

type ModalWindowProp = {
  children: (setShowModal: (value: boolean) => void) => ReactElement;
};
type ModalProp = {
  children: ReactNode;
};

const ModalContext = createContext<{
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

export function Modal({ children }: ModalProp) {
  const [showModal, setShowModal] = useState<boolean>(false);
  return (
    <ModalContext.Provider value={{ showModal, setShowModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function ModalTrigger({ children }: ModalProp) {
  const context = useContext(ModalContext);
  if (!context) throw new Error("ModalTrigger must be used within Modal");

  return (
    <div onClick={() => context.setShowModal((state) => !state)}>
      {children}
    </div>
  );
}

export function ModalWindow({ children }: ModalWindowProp) {
  const context = useContext(ModalContext);
  if (!context) throw new Error("ModalTrigger must be used within Modal");
  return (
    <>
      {context.showModal && (
        <div className="flex flex-col w-1/2 p-3 border-1 z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 fixed bg-white">
          <div className="flex justify-end">
            <span
              onClick={() => context.setShowModal(false)}
              className="cursor-pointer"
            >
              ❌
            </span>
          </div>
          {children(context.setShowModal)}
        </div>
      )}
    </>
  );
}

Modal.Trigger = ModalTrigger;
Modal.Window = ModalWindow;
