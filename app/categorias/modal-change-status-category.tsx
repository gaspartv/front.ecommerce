"use client";

import { toaster } from "@/components/ui/toaster";
import { Button, Dialog, Stack } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(3, "Nome obrigatório"),
  description: z.string().min(5, "Descrição obrigatória"),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface ModalDeleteCategoryProps {
  open: boolean;
  onOpenChange: (details: { open: boolean }) => void;
  disabled_at: string | null;
}

export default function ModalChangeStatusCategory({
  open,
  onOpenChange,
  disabled_at,
}: ModalDeleteCategoryProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  async function onSubmit() {
    try {
      const rest = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "categories/delete" + "idCategory",
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
        title: "Categoria criada com sucesso",
        description: "A categoria foi criada com sucesso",
        type: "success",
      });

      reset();
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
              loading={isSubmitting}
              colorPalette="blue"
            >
              Alterar
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
