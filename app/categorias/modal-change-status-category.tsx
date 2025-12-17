"use client";

import { toaster } from "@/components/ui/toaster";
import { Button, Dialog, Stack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

interface ModalDeleteCategoryProps {
  open: boolean;
  onOpenChange: (details: { open: boolean }) => void;
  disabled_at: string | null;
  categoryId: string;
}

export default function ModalChangeStatusCategory({
  open,
  onOpenChange,
  disabled_at,
  categoryId,
}: ModalDeleteCategoryProps) {
  const router = useRouter();

  async function onSubmit() {
    try {
      const rest = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "categories/disable?id=" + categoryId,
        {
          method: "PATCH",
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

      const data = await rest.json();
      const status = data.status;

      toaster.create({
        title: "Status da categoria alterado com sucesso",
        description:
          "Categoria " +
          (status === "active" ? "ativada" : "desativada") +
          " com sucesso",
        type: "success",
      });

      onOpenChange({ open: false });
      router.refresh();
    } catch {
      toaster.create({
        title: "Erro ao alterar status da categoria",
        description: "Ocorreu um erro ao alterar o status da categoria",
        type: "error",
      });
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Backdrop bg="blackAlpha.800" />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title></Dialog.Title>
          </Dialog.Header>
          <Dialog.CloseTrigger />
          <Dialog.Body>
            <Stack>
              <p>
                Tem certeza que deseja{" "}
                <strong>{disabled_at == null ? "desativar" : "ativar"}</strong>{" "}
                esta categoria?
              </p>
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
              colorPalette={disabled_at == null ? "red" : "blue"}
              onClick={onSubmit}
            >
              {disabled_at == null ? "Desativar" : "Ativar"}
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
