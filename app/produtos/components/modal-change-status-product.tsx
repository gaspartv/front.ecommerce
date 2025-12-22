"use client";

import { toaster } from "@/components/ui/toaster";
import { Button, Dialog, Stack, Switch } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";

interface IProps {
  disabled_at: string | null;
  productId: string;
  productName: string;
}

export default function ModalChangeStatusProduct({
  disabled_at,
  productId,
  productName,
}: IProps) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const onOpenChange = ({ open }: { open: boolean }) => {
    setIsOpen(open);
  };

  async function onSubmit() {
    try {
      const rest = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "products/disable?id=" + productId,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!rest.ok) {
        toaster.create({
          title: "Erro ao alterar status do produto",
          description: "Ocorreu um erro ao alterar o status do produto",
          type: "error",
        });
        return;
      }

      const data = await rest.json();
      const status = data.status;

      toaster.create({
        title: "Status do produto alterado com sucesso",
        description:
          "Produto " +
          (status === "active" ? "ativado" : "desativado") +
          " com sucesso",
        type: "success",
      });

      onOpenChange({ open: false });
      router.refresh();
    } catch {
      toaster.create({
        title: "Erro ao alterar status do produto",
        description: "Ocorreu um erro ao alterar o status do produto",
        type: "error",
      });
    }
  }

  return (
    <Fragment>
      <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
        <Dialog.Backdrop bg="blackAlpha.800" />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title></Dialog.Title>
            </Dialog.Header>
            <Dialog.CloseTrigger />
            <Dialog.Body>
              <Stack>
                <strong>{productName}</strong>
                Tem certeza que deseja{" "}
                {disabled_at == null ? "desativar" : "ativar"} este produto?
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
