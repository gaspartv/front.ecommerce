"use client";

import { toaster } from "@/components/ui/toaster";
import { Button, Dialog, Stack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

interface ModalDeleteCategoryProps {
  open: boolean;
  onOpenChange: (details: { open: boolean }) => void;
  categoryId: string;
}

export default function ModalDeleteCategory({
  open,
  onOpenChange,
  categoryId,
}: ModalDeleteCategoryProps) {
  const router = useRouter();

  async function onSubmit() {
    try {
      const rest = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "categories/delete?id=" + categoryId,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!rest.ok) {
        toaster.create({
          title: "Erro ao deletar categoria",
          description: "Ocorreu um erro ao deletar a categoria",
          type: "error",
        });
        return;
      }

      toaster.create({
        title: "Categoria deletada com sucesso",
        description: "A categoria foi deletada com sucesso",
        type: "success",
      });

      onOpenChange({ open: false });
      router.refresh();
    } catch {
      toaster.create({
        title: "Erro ao deletar categoria",
        description: "Ocorreu um erro ao deletar a categoria",
        type: "error",
      });
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Backdrop bg="blackAlpha.800" />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header></Dialog.Header>
          <Dialog.CloseTrigger />
          <Dialog.Body>
            <Stack>
              <p>Tem certeza que deseja deletar esta categoria?</p>
            </Stack>
          </Dialog.Body>
          <Dialog.Footer>
            <Button
              variant="outline"
              onClick={() => onOpenChange({ open: false })}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              form="category-form"
              colorPalette="red"
              onClick={onSubmit}
            >
              Deletar
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
