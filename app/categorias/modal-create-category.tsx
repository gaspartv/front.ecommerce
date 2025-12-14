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
  name: z.string().min(3, "Nome obrigatório"),
  description: z.string().min(5, "Descrição obrigatória"),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface ModalCreateCategoryProps {
  open: boolean;
  onOpenChange: (details: { open: boolean }) => void;
}

export default function ModalCreateCategory({
  open,
  onOpenChange,
}: ModalCreateCategoryProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  async function onSubmit(data: CategoryFormData) {
    try {
      const rest = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "categories/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!rest.ok) {
        toaster.create({
          title: "Erro ao criar categoria",
          description: "Ocorreu um erro ao criar a categoria",
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
        title: "Erro ao criar categoria",
        description: "Ocorreu um erro ao criar a categoria",
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
            <Dialog.Title>Nova Categoria</Dialog.Title>
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
              Salvar
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
