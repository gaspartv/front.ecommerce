"use client";

import { Button } from "@chakra-ui/react";
import { Fragment, useState } from "react";
import ModalCreateProduct from "./modal-create-product";

export default function CreateProduct({
  children,
  categories,
}: {
  children: React.ReactNode;
  categories: { id: string; name: string }[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  const onOpenChange = ({ open }: { open: boolean }) => {
    setIsOpen(open);
  };

  return (
    <Fragment>
      <ModalCreateProduct
        categories={categories}
        open={isOpen}
        onOpenChange={onOpenChange}
      />
      <Button onClick={() => setIsOpen(true)}>{children}</Button>
    </Fragment>
  );
}
