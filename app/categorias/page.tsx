import { Paginate } from "@/components/ui/pagination";
import { Box, Heading, Image, Stack, Table } from "@chakra-ui/react";
import { Fragment } from "react/jsx-runtime";
import CreateCategory from "./create-category";
import SearchForm from "./search-form";

interface CategoryInterface {
  id: string;
  created_at: string;
  updated_at: string;
  disabled_at: string | null;
  deleted_at: string | null;
  name: string;
  description: string;
  image: string;
}

async function getCategories(searchParams: {
  search?: string;
  page?: string;
  limit?: string;
}) {
  const params = new URLSearchParams();

  if (searchParams.search) {
    params.set("search", searchParams.search);
  }

  if (searchParams.page) {
    params.set("page", searchParams.page);
  }

  if (searchParams.limit) {
    params.set("limit", searchParams.limit);
  }

  const url = `${
    process.env.NEXT_PUBLIC_API_URL
  }categories/list?${params.toString()}`;

  const res = await fetch(url, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Erro ao buscar categorias");
  }
  return res.json();
}

export default async function Categorias({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string; limit?: string }>;
}) {
  const params = await searchParams;
  const { data, limit, page, total, totalPages } = await getCategories(params);

  console.log({ data, limit, page, total, totalPages });

  return (
    <Fragment>
      <Box as="main" margin="auto" w="80%" mt={12}>
        <Stack width="full" gap="5">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Heading size="xl">Categorias</Heading>

            <CreateCategory>Adicionar categoria</CreateCategory>
          </Box>

          <SearchForm />

          <Table.Root size="sm" variant="outline" striped>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Imagem</Table.ColumnHeader>
                <Table.ColumnHeader>Nome</Table.ColumnHeader>
                <Table.ColumnHeader>Status</Table.ColumnHeader>
                <Table.ColumnHeader>Descrição</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data.map((item: CategoryInterface) => (
                <Table.Row key={item.id}>
                  <Table.Cell>
                    <Image
                      src={item.image}
                      boxSize="30px"
                      borderRadius="full"
                      fit="cover"
                      alt={item.name}
                    />
                  </Table.Cell>
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>
                    {item.disabled_at == null ? "Ativo" : "Inativo"}
                  </Table.Cell>
                  <Table.Cell>{item.description}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>

          <Paginate total={total} pageSize={limit} page={page} />
        </Stack>
      </Box>
    </Fragment>
  );
}
