"use client";

import { toaster } from "@/components/ui/toaster";
import { Box, Button, Dialog, Image, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";

interface IProps {
  productId: string;
  image: string;
  name: string;
}

export default function ModalChangeImageProduct({
  productId,
  image,
  name,
}: IProps) {
  const router = useRouter();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const onOpenChange = ({ open }: { open: boolean }) => {
    setIsOpen(open);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toaster.create({
          title: "Arquivo inválido",
          description: "Por favor, selecione apenas arquivos de imagem",
          type: "error",
        });
        return;
      }

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setSelectedFile(file);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  async function onSubmit() {
    if (!selectedFile) {
      toaster.create({
        title: "Nenhuma imagem selecionada",
        description: "Por favor, selecione uma imagem para fazer o upload",
        type: "error",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const rest = await fetch(
        process.env.NEXT_PUBLIC_API_URL +
          "products/change-image?id=" +
          productId,
        {
          method: "PATCH",
          body: formData,
        }
      );

      if (!rest.ok) {
        toaster.create({
          title: "Erro ao atualizar imagem",
          description: "Ocorreu um erro ao atualizar a imagem da categoria",
          type: "error",
        });
        return;
      }

      toaster.create({
        title: "Imagem atualizada com sucesso",
        description: "A imagem da categoria foi atualizada",
        type: "success",
      });

      handleRemoveFile();
      onOpenChange({ open: false });
      router.refresh();
    } catch {
      toaster.create({
        title: "Erro ao atualizar imagem",
        description: "Ocorreu um erro ao atualizar a imagem da categoria",
        type: "error",
      });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <Fragment>
      <Dialog.Root
        open={isOpen}
        onOpenChange={(details) => {
          if (!details.open) {
            handleRemoveFile();
          }
          onOpenChange(details);
        }}
      >
        <Dialog.Backdrop bg="blackAlpha.800" />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Alterar Imagem da Categoria</Dialog.Title>
            </Dialog.Header>
            <Dialog.CloseTrigger />
            <Dialog.Body>
              <Stack gap={4}>
                <Box>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  <Button
                    colorPalette="blue"
                    variant="outline"
                    width="100%"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Selecionar Imagem
                  </Button>
                </Box>

                {previewUrl && (
                  <Box
                    borderWidth="1px"
                    borderRadius="md"
                    padding={4}
                    position="relative"
                  >
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      maxHeight="300px"
                      width="100%"
                      objectFit="contain"
                      borderRadius="md"
                    />
                    <Box mt={2}>
                      <Text fontSize="sm" color="gray.600">
                        {selectedFile?.name} -{" "}
                        {((selectedFile?.size || 0) / 1024).toFixed(2)} KB
                      </Text>
                    </Box>
                    <Button
                      size="sm"
                      colorPalette="red"
                      variant="ghost"
                      onClick={handleRemoveFile}
                      position="absolute"
                      top={2}
                      right={2}
                    >
                      Remover
                    </Button>
                  </Box>
                )}

                {!selectedFile && (
                  <Box
                    borderWidth="2px"
                    borderStyle="dashed"
                    borderRadius="md"
                    padding={8}
                    textAlign="center"
                    color="gray.500"
                  >
                    <Text>Nenhuma imagem selecionada</Text>
                  </Box>
                )}
              </Stack>
            </Dialog.Body>
            <Dialog.Footer>
              <Button
                variant="outline"
                onClick={() => onOpenChange({ open: false })}
                disabled={isUploading}
              >
                Cancelar
              </Button>
              <Button
                colorPalette="blue"
                onClick={onSubmit}
                disabled={!selectedFile || isUploading}
                loading={isUploading}
              >
                {isUploading ? "Enviando..." : "Atualizar Imagem"}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
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
