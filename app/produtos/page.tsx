import { Box, Heading, Stack } from "@chakra-ui/react";
import { Fragment } from "react/jsx-runtime";
import SearchForm from "../../components/ui/search-form";
import CreateProduct from "./create-product";

async function getCategoriesSelect() {
  const url = `${process.env.NEXT_PUBLIC_API_URL}categories/list-select`;

  const res = await fetch(url, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Erro ao buscar categorias para select");
  }
  return res.json();
}

export default async function ProductsPage() {
  const { data: categories } = await getCategoriesSelect();

  return (
    <Fragment>
      <Box
        as="main"
        margin="auto"
        w={{ base: "100%", sm: "100%", md: "100%", lg: "90%" }}
        px={4}
      >
        <Stack width="full" gap="5">
          <Box
            display="flex"
            flexDirection={{ base: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ base: "flex-start", sm: "center" }}
            gap={{ base: 4, sm: 0 }}
          >
            <Heading size={{ base: "lg", md: "xl" }}>Produtos</Heading>

            <CreateProduct categories={categories}>
              Adicionar produto
            </CreateProduct>
          </Box>

          <SearchForm path="produtos" />
        </Stack>
      </Box>
    </Fragment>
  );
}
