"use client";

import {
  ButtonGroup,
  Flex,
  IconButton,
  NativeSelect,
  Pagination,
  Text,
} from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

interface PaginateProps {
  path: string;
  total: number;
  pageSize: number;
  page: number;
}

export function Paginate(props: PaginateProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPage));

    startTransition(() => {
      router.push(`/${props.path}?${params.toString()}`);
    });
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams);
    params.set("limit", e.target.value);
    params.delete("page");

    startTransition(() => {
      router.push(`/${props.path}?${params.toString()}`);
    });
  };

  return (
    <Flex justify="space-between" align="center" gap={4} flexWrap="wrap">
      <Flex align="center" gap={2}>
        <Text fontSize="sm" color="fg.muted" cursor="default">
          Itens por página:
        </Text>
        <NativeSelect.Root size="sm" width="80px" cursor="pointer">
          <NativeSelect.Field
            value={props.pageSize}
            onChange={handleLimitChange}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </NativeSelect.Field>
        </NativeSelect.Root>
      </Flex>

      <Pagination.Root
        count={props.total}
        pageSize={props.pageSize}
        page={props.page}
        onPageChange={(details) => handlePageChange(details.page)}
      >
        <ButtonGroup variant="ghost" size="sm" wrap="wrap">
          <Pagination.PrevTrigger asChild>
            <IconButton disabled={isPending}>
              <LuChevronLeft />
            </IconButton>
          </Pagination.PrevTrigger>

          <Pagination.Items
            render={(page) => (
              <IconButton
                variant={{ base: "ghost", _selected: "outline" }}
                disabled={isPending}
              >
                {page.value}
              </IconButton>
            )}
          />

          <Pagination.NextTrigger asChild>
            <IconButton disabled={isPending}>
              <LuChevronRight />
            </IconButton>
          </Pagination.NextTrigger>
        </ButtonGroup>
      </Pagination.Root>

      <Text fontSize="sm" color="fg.muted" cursor="default">
        Total: {props.total} {props.total === 1 ? "item" : "itens"}
      </Text>
    </Flex>
  );
}
