import { Paginate } from "@/components/ui/pagination";
import { Box, Heading, HStack, Stack, Table } from "@chakra-ui/react";
import Link from "next/link";
import { Fragment } from "react/jsx-runtime";
import ChangeImageCategory from "./change-image-category";
import ChangeStatusCategory from "./change-status-category";
import CreateCategory from "./create-category";
import DeleteCategory from "./delete-category";
import EditCategory from "./edit-category";
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
  status?: "all" | "active" | "inactive";
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

  if (searchParams.status) {
    params.set("status", searchParams.status);
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
    status?: "all" | "active" | "inactive";
  }>;
}) {
  const params = await searchParams;
  const { data, limit, page, total } = await getCategories(params);

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
            <Heading size={{ base: "lg", md: "xl" }}>Categorias</Heading>

            <CreateCategory>Adicionar categoria</CreateCategory>
          </Box>

          <SearchForm />

          <Box overflowX="auto" borderWidth="1px" borderRadius="md">
            <Table.Root
              size={{ base: "lg", sm: "sm" }}
              variant="outline"
              striped
              overflowX={{ base: "auto", md: "visible" }}
            >
              <Table.Header cursor="default">
                <Table.Row bg="gray.300" _dark={{ bg: "black" }}>
                  <Table.ColumnHeader minW="48px"></Table.ColumnHeader>
                  <Table.ColumnHeader minW="80px">
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
                  <Table.ColumnHeader w="15%" maxW="240px">
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
                  <Table.ColumnHeader w="full" minW="200px" maxW="450px">
                    Descrição
                  </Table.ColumnHeader>
                  <Table.ColumnHeader w="22%" minW="100px" textAlign="center">
                    Ações
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body cursor="default">
                {data.map((item: CategoryInterface) => (
                  <Table.Row key={item.id}>
                    <Table.Cell minW="48px">
                      <ChangeImageCategory
                        categoryId={item.id}
                        image={item.image}
                        name={item.name}
                      />
                    </Table.Cell>
                    <Table.Cell minW="80px" textAlign="center">
                      <ChangeStatusCategory
                        disabled_at={item.disabled_at}
                        categoryId={item.id}
                      />
                    </Table.Cell>
                    <Table.Cell
                      w="15%"
                      maxW="240px"
                      title={item.name}
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                    >
                      {item.name}
                    </Table.Cell>
                    <Table.Cell
                      w="full"
                      minW="200px"
                      maxW="450px"
                      title={item.description}
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                    >
                      {item.description}
                    </Table.Cell>
                    <Table.Cell w="22%" minW="100px" textAlign="center">
                      <HStack
                        display="flex"
                        alignItems="center"
                        justify="center"
                      >
                        <EditCategory
                          categoryId={item.id}
                          name={item.name}
                          description={item.description}
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
                        </EditCategory>
                        <DeleteCategory categoryId={item.id}>
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
                        </DeleteCategory>
                      </HStack>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>

          <Paginate total={total} pageSize={limit} page={page} />
        </Stack>
      </Box>
    </Fragment>
  );
}
