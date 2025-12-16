"use client";

import { toaster } from "@/components/ui/toaster";
import {
  Button,
  Dialog,
  Field,
  Input,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(3, "Nome obrigatório").max(255, "Nome muito longo"),
  description: z
    .string()
    .min(5, "Descrição obrigatória")
    .max(510, "Descrição muito longa"),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface ModalEditCategoryProps {
  open: boolean;
  onOpenChange: (details: { open: boolean }) => void;
  categoryId: string;
  name: string;
  description: string;
}

export default function ModalEditCategory({
  open,
  onOpenChange,
  categoryId,
  name,
  description,
}: ModalEditCategoryProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CategoryFormData>({
    defaultValues: {
      name,
      description,
    },
    resolver: zodResolver(categorySchema),
  });

  async function onSubmit(data: CategoryFormData) {
    try {
      const rest = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}categories/edit?id=${categoryId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!rest.ok) {
        toaster.create({
          title: "Erro ao editar categoria",
          description: "Ocorreu um erro ao editar a categoria",
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
        title: "Erro ao editar categoria",
        description: "Ocorreu um erro ao editar a categoria",
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
            <Dialog.Title>Editar Categoria</Dialog.Title>
          </Dialog.Header>
          <Dialog.CloseTrigger />
          <Dialog.Body>
            <form onSubmit={handleSubmit(onSubmit)} id="category-form">
              <Stack gap={4}>
                <Field.Root invalid={!!errors.name}>
                  <Field.Label>Nome</Field.Label>
                  <Input
                    {...register("name")}
                    placeholder="Nome da categoria"
                  />
                  {errors.name && (
                    <Field.ErrorText>{errors.name.message}</Field.ErrorText>
                  )}
                </Field.Root>

                <Field.Root invalid={!!errors.description}>
                  <Field.Label>Descrição</Field.Label>
                  <Textarea
                    {...register("description")}
                    placeholder="Descrição da categoria"
                  />
                  {errors.description && (
                    <Field.ErrorText>
                      {errors.description.message}
                    </Field.ErrorText>
                  )}
                </Field.Root>
              </Stack>
            </form>
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
              Editar
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
