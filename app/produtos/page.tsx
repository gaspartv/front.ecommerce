import { Paginate } from "@/components/ui/pagination";
import { Box, Heading, HStack, Stack, Table } from "@chakra-ui/react";
import Link from "next/link";
import { Fragment } from "react/jsx-runtime";
import SearchForm from "../../components/ui/search-form";
import ModalChangeImageProduct from "./components/modal-change-image-product";
import ModalChangeStatusProduct from "./components/modal-change-status-product";
import ModalCreateProduct from "./components/modal-create-product";
import ModalDeleteProduct from "./components/modal-delete-product";
import ModalEditProduct from "./components/modal-edit-product";

interface IProduct {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  disabled_at: string | null;
  name: string;
  description: string;
  image: string;
  price: number;
  stock_quantity: number;
  category_id: string;
  category_name: string;
  sku: string;
  weight: number;
  dimensions: string;
  is_featured: boolean;
}

interface IGetProducts {
  search?: string;
  page?: string;
  limit?: string;
  order_by?: string;
  order_dir?: string;
  status?: "all" | "active" | "inactive";
}

async function getProducts(searchParams: IGetProducts) {
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
  }products/list?${params.toString()}`;

  console.log("Fetching products with URL:", url);

  const res = await fetch(url, { cache: "no-store" });

  console.log("Products fetch response status:", res.status);

  if (!res.ok) throw new Error("Erro ao buscar produtos");
  return res.json();
}

async function getCategoriesSelect() {
  const url = `${process.env.NEXT_PUBLIC_API_URL}categories/list-select`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Erro ao buscar produtos para select");
  return res.json();
}

export default async function ProductsPage({
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
  const { data: products, limit, page, total } = await getProducts(params);
  const { data: categoriesSelect } = await getCategoriesSelect();

  console.log({
    limit,
    page,
    total,
  });

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

            <ModalCreateProduct categoriesSelect={categoriesSelect}>
              Adicionar produto
            </ModalCreateProduct>
          </Box>

          <SearchForm path="produtos" />

          <Box overflowX="auto" width="100%">
            <Table.Root
              size={{ base: "sm", md: "sm" }}
              variant="outline"
              striped
            >
              <Table.Header cursor="default">
                <Table.Row bg="gray.300" _dark={{ bg: "black" }}>
                  <Table.ColumnHeader></Table.ColumnHeader>
                  <Table.ColumnHeader w="50px" minW="50px"></Table.ColumnHeader>
                  <Table.ColumnHeader w="80px" minW="80px" textAlign="center">
                    <Link
                      href={{
                        pathname: "/produtos",
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
                      <HStack gap={2} align="center" justify="center">
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
                  <Table.ColumnHeader w="200px" minW="200px">
                    <Link
                      href={{
                        pathname: "/produtos",
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
                  <Table.ColumnHeader w="250px" minW="250px">
                    Descrição
                  </Table.ColumnHeader>
                  <Table.ColumnHeader w="100px" minW="100px" textAlign="right">
                    Preço
                  </Table.ColumnHeader>
                  <Table.ColumnHeader w="80px" minW="80px" textAlign="center">
                    Estoque
                  </Table.ColumnHeader>
                  <Table.ColumnHeader w="120px" minW="120px">
                    Categoria
                  </Table.ColumnHeader>
                  <Table.ColumnHeader w="120px" minW="120px">
                    SKU
                  </Table.ColumnHeader>
                  <Table.ColumnHeader w="80px" minW="80px" textAlign="center">
                    Peso
                  </Table.ColumnHeader>
                  <Table.ColumnHeader w="180px" minW="180px">
                    Dimensões
                  </Table.ColumnHeader>
                  <Table.ColumnHeader w="100px" minW="100px" textAlign="center">
                    Ações
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body cursor="default">
                {products.map((item: IProduct) => (
                  <Table.Row key={item.id}>
                    <Table.Cell w="40px" minW="40px">
                      {item.is_featured ? (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="gold"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ) : (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ opacity: 0.3 }}
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      )}
                    </Table.Cell>
                    <Table.Cell w="50px" minW="50px">
                      <ModalChangeImageProduct
                        image={item.image}
                        name={item.name}
                        productId={item.id}
                      />
                    </Table.Cell>
                    <Table.Cell w="80px" minW="80px" textAlign="center">
                      <ModalChangeStatusProduct
                        disabled_at={item.disabled_at}
                        productId={item.id}
                        productName={item.name}
                      />
                    </Table.Cell>
                    <Table.Cell
                      w="200px"
                      minW="200px"
                      title={item.name}
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                    >
                      {item.name}
                    </Table.Cell>
                    <Table.Cell
                      w="250px"
                      minW="250px"
                      title={item.description}
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                    >
                      {item.description}
                    </Table.Cell>
                    <Table.Cell
                      w="100px"
                      minW="100px"
                      textAlign="right"
                      title={item.price.toString()}
                    >
                      {item.price.toString()}
                    </Table.Cell>
                    <Table.Cell
                      w="80px"
                      minW="80px"
                      textAlign="center"
                      title={item.stock_quantity.toString()}
                    >
                      {item.stock_quantity.toString()}
                    </Table.Cell>
                    <Table.Cell
                      w="120px"
                      minW="120px"
                      title={item.category_name}
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                    >
                      {item.category_name}
                    </Table.Cell>
                    <Table.Cell
                      w="120px"
                      minW="120px"
                      title={item.sku}
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                    >
                      {item.sku}
                    </Table.Cell>
                    <Table.Cell
                      w="80px"
                      minW="80px"
                      textAlign="center"
                      title={item.weight.toString()}
                    >
                      {item.weight.toString()}
                    </Table.Cell>
                    <Table.Cell
                      w="180px"
                      minW="180px"
                      title={item.dimensions}
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                    >
                      {item.dimensions}
                    </Table.Cell>
                    <Table.Cell w="100px" minW="100px" textAlign="center">
                      <HStack
                        display="flex"
                        alignItems="center"
                        justify="center"
                      >
                        <ModalEditProduct
                          productId={item.id}
                          categoriesSelect={categoriesSelect}
                          product={item}
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
                        </ModalEditProduct>
                        <ModalDeleteProduct
                          productId={item.id}
                          productName={item.name}
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
                        </ModalDeleteProduct>
                      </HStack>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>

          <Paginate
            total={total}
            pageSize={limit}
            page={page}
            path="produtos"
          />
        </Stack>
      </Box>
    </Fragment>
  );
}
