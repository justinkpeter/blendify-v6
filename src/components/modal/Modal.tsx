import React, { useEffect, useRef, useState } from "react";
import styles from "./Modal.module.scss";

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export default function Modal({ children, isOpen, onClose }: ModalProps) {
  const [visible, setVisible] = useState(isOpen);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisible(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setVisible(false);
        onClose(); // Notify parent to close modal
      }
    };

    if (visible) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [visible, onClose]);

  return (
    <div className={`${styles.modal} ${visible ? styles.open : ""}`}>
      <div className={styles.modal__overlay} />
      <div className={styles.modal__container} ref={containerRef}>
        <div className={styles.modal__body}>{children}</div>
      </div>
    </div>
  );
}
