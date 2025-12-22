"use client";

import { toaster } from "@/components/ui/toaster";
import { Button, Dialog, Stack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";

interface IProps {
  children: React.ReactNode;
  productId: string;
  productName: string;
}

export default function ModalDeleteProduct({
  children,
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
        process.env.NEXT_PUBLIC_API_URL + "products/delete?id=" + productId,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!rest.ok) {
        toaster.create({
          title: "Erro ao deletar produto",
          description: "Ocorreu um erro ao deletar o produto",
          type: "error",
        });
        return;
      }

      toaster.create({
        title: "Produto deletado com sucesso",
        description: "O produto foi deletado com sucesso",
        type: "success",
      });

      onOpenChange({ open: false });
      router.refresh();
    } catch {
      toaster.create({
        title: "Erro ao deletar produto",
        description: "Ocorreu um erro ao deletar o produto",
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
            <Dialog.Header></Dialog.Header>
            <Dialog.CloseTrigger />
            <Dialog.Body>
              <Stack>
                <strong>{productName}</strong>
                Tem certeza que deseja deletar este produto?
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
      <Button w={8} h={8} colorPalette="red" onClick={() => setIsOpen(true)}>
        {children}
      </Button>
    </Fragment>
  );
}
