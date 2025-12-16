"use client";

import { Button } from "@chakra-ui/react";
import { Fragment, useState } from "react";
import ModalDeleteCategory from "./modal-delete-category";

export default function DeleteCategory({
  children,
  categoryId,
}: {
  children: React.ReactNode;
  categoryId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const onOpenChange = ({ open }: { open: boolean }) => {
    setIsOpen(open);
  };

  return (
    <Fragment>
      <ModalDeleteCategory
        open={isOpen}
        onOpenChange={onOpenChange}
        categoryId={categoryId}
      />
      <Button w={8} h={8} colorPalette="red" onClick={() => setIsOpen(true)}>
        {children}
      </Button>
    </Fragment>
  );
}
