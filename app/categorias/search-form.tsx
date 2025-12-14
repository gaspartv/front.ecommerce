"use client";

import { Box, Button, Input } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

export default function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);

    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }

    // Reset para página 1 ao fazer nova busca
    params.delete("page");

    startTransition(() => {
      router.push(`/categorias?${params.toString()}`);
    });
  };

  return (
    <Box as="form" display="flex" gap={2} onSubmit={handleSearch}>
      <Input
        placeholder="Buscar por categoria"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Button type="submit" loading={isPending}>
        Buscar
      </Button>
    </Box>
  );
}
