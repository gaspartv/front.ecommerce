"use client";

import { Box, Flex, HStack, Spacer, Text } from "@chakra-ui/react";
import Link from "next/link";
import { ColorModeButton } from "./color-mode";

export function Navbar() {
  return (
    <Box
      as="header"
      borderBottomWidth="1px"
      px={{ base: 4, md: 6 }}
      py={3}
      bg={{ base: "bg", _dark: "bg" }}
    >
      <Flex align="center" gap={4}>
        <Link href="/">
          <Text fontWeight="bold" fontSize="lg">
            Painel do administrador
          </Text>
        </Link>

        <Spacer />

        <HStack as="nav" display={{ base: "none", md: "flex" }}>
          <Link href="/">
            <Text>Início</Text>
          </Link>
          <Link href="/categorias">
            <Text>Categorias</Text>
          </Link>
        </HStack>

        <Spacer />

        <ColorModeButton />
      </Flex>
    </Box>
  );
}
