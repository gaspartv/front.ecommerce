"use client";

import { Image } from "@chakra-ui/react";
import { Fragment, useState } from "react";
import ModalChangeImageCategory from "./modal-change-image-category";

export default function ChangeImageCategory({
  categoryId,
  image,
  name,
}: {
  categoryId: string;
  image: string;
  name: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const onOpenChange = ({ open }: { open: boolean }) => {
    setIsOpen(open);
  };

  return (
    <Fragment>
      <ModalChangeImageCategory
        open={isOpen}
        onOpenChange={onOpenChange}
        categoryId={categoryId}
      />
      <Image
        src={image}
        boxSize="30px"
        borderRadius="full"
        fit="cover"
        alt={name}
        cursor="pointer"
        transition="transform 0.2s ease-in-out"
        _hover={{ transform: "scale(2)" }}
        onClick={() => setIsOpen(true)}
      />
    </Fragment>
  );
}
