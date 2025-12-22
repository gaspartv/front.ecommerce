"use client";

import { toaster } from "@/components/ui/toaster";
import {
  Button,
  Checkbox,
  Dialog,
  Field,
  Grid,
  Input,
  NativeSelect,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { IMaskInput } from "react-imask";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(3, "Nome obrigatório."),
  description: z.string().min(5, "Descrição obrigatória."),
  price: z.coerce.number().positive("Preço deve ser maior que zero."),
  stock_quantity: z
    .number()
    .int("Quantidade deve ser um número inteiro.")
    .positive("Quantidade deve ser maior que zero."),
  category_id: z.string().min(1, "Categoria obrigatória.").optional(),
  sku: z.string().min(1, "SKU obrigatório.").optional(),
  weight: z.number().optional().or(z.literal(undefined)),
  dimensions: z.string().optional(),
  is_featured: z.boolean().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface IProps {
  children: React.ReactNode;
  categoriesSelect: { id: string; name: string }[];
}

export default function ModalCreateProduct({
  children,
  categoriesSelect,
}: IProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const onOpenChange = ({ open }: { open: boolean }) => {
    setIsOpen(open);
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(productSchema),
  });

  async function onSubmit(data: ProductFormData) {
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + "products/create";

      const rest = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!rest.ok) {
        toaster.create({
          title: "Erro ao criar produto",
          description: "Ocorreu um erro ao criar a produto",
          type: "error",
        });
        return;
      }

      toaster.create({
        title: "Produto criado com sucesso",
        description: "O produto foi criado com sucesso",
        type: "success",
      });

      reset();
      onOpenChange({ open: false });
      router.refresh();
    } catch {
      toaster.create({
        title: "Erro ao criar produto",
        description: "Ocorreu um erro ao criar o produto",
        type: "error",
      });
    }
  }

  return (
    <Fragment>
      <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
        <Dialog.Backdrop bg="blackAlpha.800" />
        <Dialog.Positioner>
          <Dialog.Content maxWidth="600px">
            <Dialog.Header>
              <Dialog.Title fontSize="lg">Novo Produto</Dialog.Title>
            </Dialog.Header>
            <Dialog.CloseTrigger />
            <Dialog.Body py={4}>
              <form onSubmit={handleSubmit(onSubmit)} id="product-form">
                <Stack gap={3}>
                  <Grid templateColumns="1fr 3fr" gap={3} alignItems="start">
                    <Field.Root>
                      <Controller
                        name="is_featured"
                        control={control}
                        defaultValue={false}
                        render={({ field: { onChange, value } }) => (
                          <Checkbox.Root
                            size="sm"
                            checked={value}
                            onCheckedChange={(details) =>
                              onChange(details.checked)
                            }
                          >
                            <Checkbox.HiddenInput />
                            <Checkbox.Control />
                            <Checkbox.Label fontSize="sm">
                              Destaque
                            </Checkbox.Label>
                          </Checkbox.Root>
                        )}
                      />
                      {errors.is_featured && (
                        <Field.ErrorText fontSize="xs">
                          {errors.is_featured.message}
                        </Field.ErrorText>
                      )}
                    </Field.Root>

                    <Field.Root invalid={!!errors.category_id}>
                      <NativeSelect.Root size="sm">
                        <NativeSelect.Field
                          {...register("category_id")}
                          placeholder="Selecione uma categoria"
                        >
                          <option value="" disabled>
                            Selecione uma categoria
                          </option>
                          {categoriesSelect.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                      </NativeSelect.Root>
                      {errors.category_id && (
                        <Field.ErrorText fontSize="xs">
                          {errors.category_id.message}
                        </Field.ErrorText>
                      )}
                    </Field.Root>
                  </Grid>

                  <Field.Root invalid={!!errors.name}>
                    <Field.Label fontSize="sm">Nome</Field.Label>
                    <Input
                      {...register("name")}
                      placeholder="Nome do produto"
                      size="sm"
                    />
                    {errors.name && (
                      <Field.ErrorText fontSize="xs">
                        {errors.name.message}
                      </Field.ErrorText>
                    )}
                  </Field.Root>

                  <Field.Root invalid={!!errors.description}>
                    <Field.Label fontSize="sm">Descrição</Field.Label>
                    <Textarea
                      {...register("description")}
                      placeholder="Descrição do produto"
                      size="sm"
                      rows={3}
                    />
                    {errors.description && (
                      <Field.ErrorText fontSize="xs">
                        {errors.description.message}
                      </Field.ErrorText>
                    )}
                  </Field.Root>

                  <Field.Root invalid={!!errors.price}>
                    <Field.Label fontSize="sm">Preço</Field.Label>
                    <Controller
                      name="price"
                      control={control}
                      render={({ field: { onChange, value, ...field } }) => (
                        <IMaskInput
                          {...field}
                          value={String(value)}
                          mask="R$ num"
                          blocks={{
                            num: {
                              mask: Number,
                              scale: 2,
                              thousandsSeparator: ".",
                              radix: ",",
                              mapToRadix: ["."],
                              padFractionalZeros: true,
                              normalizeZeros: true,
                              min: 0,
                            },
                          }}
                          lazy={false}
                          unmask="typed"
                          onAccept={(value) => {
                            onChange(value || 0);
                          }}
                          placeholder="R$ 0,00"
                          style={{
                            width: "100%",
                            padding: "0.375rem 0.5rem",
                            fontSize: "0.875rem",
                            borderRadius: "0.375rem",
                            border: "1px solid",
                            borderColor: errors.price ? "#E53E3E" : "#E2E8F0",
                            outline: "none",
                          }}
                        />
                      )}
                    />
                    {errors.price && (
                      <Field.ErrorText fontSize="xs">
                        {errors.price.message}
                      </Field.ErrorText>
                    )}
                  </Field.Root>

                  <Grid templateColumns="1fr 1fr" gap={3}>
                    <Field.Root invalid={!!errors.sku}>
                      <Field.Label fontSize="sm">SKU</Field.Label>
                      <Input
                        {...register("sku")}
                        placeholder="SKU do produto"
                        size="sm"
                      />
                      {errors.sku && (
                        <Field.ErrorText fontSize="xs">
                          {errors.sku.message}
                        </Field.ErrorText>
                      )}
                    </Field.Root>

                    <Field.Root invalid={!!errors.stock_quantity}>
                      <Field.Label fontSize="sm">Quantidade</Field.Label>
                      <Input
                        type="number"
                        {...register("stock_quantity", { valueAsNumber: true })}
                        placeholder="Qtd. em estoque"
                        size="sm"
                      />
                      {errors.stock_quantity && (
                        <Field.ErrorText fontSize="xs">
                          {errors.stock_quantity.message}
                        </Field.ErrorText>
                      )}
                    </Field.Root>
                  </Grid>

                  <Grid templateColumns="1fr 2fr" gap={3}>
                    <Field.Root invalid={!!errors.weight}>
                      <Field.Label fontSize="sm">Peso (kg)</Field.Label>
                      <Input
                        type="number"
                        step="0.01"
                        {...register("weight", { valueAsNumber: true })}
                        placeholder="Peso"
                        size="sm"
                      />
                      {errors.weight && (
                        <Field.ErrorText fontSize="xs">
                          {errors.weight.message}
                        </Field.ErrorText>
                      )}
                    </Field.Root>

                    <Field.Root invalid={!!errors.dimensions}>
                      <Field.Label fontSize="sm">Dimensões (LxAxP)</Field.Label>
                      <Input
                        {...register("dimensions")}
                        placeholder="Ex: 10x20x30"
                        size="sm"
                      />
                      {errors.dimensions && (
                        <Field.ErrorText fontSize="xs">
                          {errors.dimensions.message}
                        </Field.ErrorText>
                      )}
                    </Field.Root>
                  </Grid>
                </Stack>
              </form>
            </Dialog.Body>
            <Dialog.Footer py={3}>
              <Button
                variant="outline"
                onClick={() => onOpenChange({ open: false })}
                size="sm"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                form="product-form"
                loading={isSubmitting}
                colorPalette="blue"
                size="sm"
              >
                Adicionar
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
      <Button onClick={() => setIsOpen(true)}>{children}</Button>
    </Fragment>
  );
}
