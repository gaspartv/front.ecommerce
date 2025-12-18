"use client";

import { Box, Button, Input, NativeSelect } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

export default function SearchForm({ path }: { path: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "all");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);

    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }

    if (status && status !== "all") {
      params.set("status", status);
    } else {
      params.delete("status");
    }

    params.delete("page");

    startTransition(() => {
      router.push(`/${path}?${params.toString()}`);
    });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    const params = new URLSearchParams(searchParams);

    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }

    if (newStatus && newStatus !== "all") {
      params.set("status", newStatus);
    } else {
      params.delete("status");
    }

    params.delete("page");

    startTransition(() => {
      router.push(`/${path}?${params.toString()}`);
    });
  };

  return (
    <Box as="form" display="flex" gap={2} onSubmit={handleSearch}>
      <NativeSelect.Root w={120}>
        <NativeSelect.Field value={status} onChange={handleStatusChange}>
          <option value="all">Todos</option>
          <option value="active">Ativo</option>
          <option value="inactive">Inativo</option>
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
      <Input
        placeholder={`Buscar por ${path}`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Button type="submit" loading={isPending}>
        Buscar
      </Button>
    </Box>
  );
}
