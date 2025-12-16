"use client";

import { Switch } from "@chakra-ui/react";
import { Fragment, useState } from "react";
import ModalChangeStatusCategory from "./modal-change-status-category";

export default function ChangeStatusCategory({
  disabled_at,
}: {
  disabled_at: string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const onOpenChange = ({ open }: { open: boolean }) => {
    setIsOpen(open);
  };

  return (
    <Fragment>
      <ModalChangeStatusCategory
        open={isOpen}
        onOpenChange={onOpenChange}
        disabled_at={disabled_at}
      />
      <Switch.Root
        checked={disabled_at == null}
        colorPalette={disabled_at == null ? "green" : "red"}
        size="sm"
        onClick={() => setIsOpen(true)}
      >
        <Switch.HiddenInput />
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
      </Switch.Root>
    </Fragment>
  );
}
