"use client";

import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { Fragment } from "react/jsx-runtime";
import ModalCreateCategory from "./modal-create-category";

export default function CreateCategory({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const onOpenChange = ({ open }: { open: boolean }) => {
    setIsOpen(open);
  };

  return (
    <Fragment>
      <ModalCreateCategory open={isOpen} onOpenChange={onOpenChange} />
      <Button onClick={() => setIsOpen(true)}>{children}</Button>
    </Fragment>
  );
}
