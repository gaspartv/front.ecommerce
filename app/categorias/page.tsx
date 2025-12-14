import { Paginate } from "@/components/ui/pagination";
// Removed Chakra icons
import { Box, Heading, HStack, Image, Stack, Table } from "@chakra-ui/react";
import Link from "next/link";
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
  order_by?: string;
  order_dir?: string;
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

  if (searchParams.order_by) {
    params.set("order_by", searchParams.order_by);
  }

  if (searchParams.order_dir) {
    params.set("order_dir", searchParams.order_dir);
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
  searchParams: Promise<{
    search?: string;
    page?: string;
    limit?: string;
    order_by?: string;
    order_dir?: "asc" | "desc";
  }>;
}) {
  const params = await searchParams;
  const { data, limit, page, total } = await getCategories(params);

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
            <Table.Header cursor="default">
              <Table.Row bg="gray.300" _dark={{ bg: "black" }}>
                <Table.ColumnHeader maxW="8px"></Table.ColumnHeader>
                <Table.ColumnHeader maxW="12px">
                  <Link
                    href={{
                      pathname: "/categorias",
                      query: {
                        ...params,
                        order_by: "disabled_at",
                        order_dir:
                          params.order_by === "disabled_at" &&
                          params.order_dir === "asc"
                            ? "desc"
                            : "asc",
                      },
                    }}
                    scroll={false}
                  >
                    <HStack gap={2} align="center">
                      <span>Status</span>
                      {params.order_by === "disabled_at" ? (
                        params.order_dir === "asc" ? (
                          <span aria-hidden>▲</span>
                        ) : (
                          <span aria-hidden>▼</span>
                        )
                      ) : (
                        <span aria-hidden style={{ opacity: 0.4 }}>
                          ▲
                        </span>
                      )}
                    </HStack>
                  </Link>
                </Table.ColumnHeader>
                <Table.ColumnHeader maxW="48px">
                  <Link
                    href={{
                      pathname: "/categorias",
                      query: {
                        ...params,
                        order_by: "name",
                        order_dir:
                          params.order_by === "name" &&
                          params.order_dir === "asc"
                            ? "desc"
                            : "asc",
                      },
                    }}
                    scroll={false}
                  >
                    <HStack gap={2} align="center">
                      <span>Nome</span>
                      {params.order_by === "name" ? (
                        params.order_dir === "asc" ? (
                          <span aria-hidden>▲</span>
                        ) : (
                          <span aria-hidden>▼</span>
                        )
                      ) : (
                        <span aria-hidden style={{ opacity: 0.4 }}>
                          ▲
                        </span>
                      )}
                    </HStack>
                  </Link>
                </Table.ColumnHeader>
                <Table.ColumnHeader>Descrição</Table.ColumnHeader>
                <Table.ColumnHeader
                  maxW="12px"
                  textAlign="center"
                ></Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body cursor="default">
              {data.map((item: CategoryInterface) => (
                <Table.Row key={item.id}>
                  <Table.Cell maxW="8px">
                    <Image
                      src={item.image}
                      boxSize="30px"
                      borderRadius="full"
                      fit="cover"
                      alt={item.name}
                    />
                  </Table.Cell>
                  <Table.Cell
                    maxW="12px"
                    bg={item.disabled_at == null ? "green.500" : "red.500"}
                    color="white"
                    textAlign="center"
                  >
                    {item.disabled_at == null ? "Ativo" : "Inativo"}
                  </Table.Cell>
                  <Table.Cell maxW="48px" title={item.name}>
                    {item.name}
                  </Table.Cell>
                  <Table.Cell title={item.description}>
                    {item.description}
                  </Table.Cell>
                  <Table.Cell maxW="12px">
                    <HStack justify="center" spacing={3}>
                      <Box
                        as="span"
                        role="img"
                        aria-label="Editar"
                        title="Editar"
                        cursor="pointer"
                        color="blue.500"
                        _hover={{ color: "blue.600" }}
                        _active={{ color: "blue.700" }}
                        lineHeight="0"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12.3 2.3a1 1 0 011.4 0l2 2a1 1 0 010 1.4l-8.6 8.6-3.6.6.6-3.6z"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Box>
                      <Box
                        as="span"
                        role="img"
                        aria-label="Deletar"
                        title="Deletar"
                        cursor="pointer"
                        color="red.500"
                        _hover={{ color: "red.600" }}
                        _active={{ color: "red.700" }}
                        lineHeight="0"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4 6h12M6 6l1 11h6l1-11M8 6V4h6v2M9 9.5V15m4-5.5V15"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Box>
                    </HStack>
                  </Table.Cell>
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
