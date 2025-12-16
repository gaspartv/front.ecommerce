"use client";

import { Button } from "@chakra-ui/react";
import { Fragment, useState } from "react";
import ModalEditCategory from "./modal-edit-category";

export default function EditCategory({
  children,
  categoryId,
  name,
  description,
}: {
  children: React.ReactNode;
  categoryId: string;
  name: string;
  description: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const onOpenChange = ({ open }: { open: boolean }) => {
    setIsOpen(open);
  };

  return (
    <Fragment>
      <ModalEditCategory
        open={isOpen}
        onOpenChange={onOpenChange}
        categoryId={categoryId}
        name={name}
        description={description}
      />
      <Button w={8} h={8} colorPalette="blue" onClick={() => setIsOpen(true)}>
        {children}
      </Button>
    </Fragment>
  );
}
