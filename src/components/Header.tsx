import {
  Avatar,
  Box,
  Button,
  HStack,
  IconButton,
  LightMode,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  ToastId,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FaAirbnb, FaMoon, FaSun } from "react-icons/fa";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";
import { Link } from "react-router-dom";
import useUser from "../lib/useUser";
import { logOut } from "../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";

export default function Header() {
  const { userLoading, user, isLoggedIn } = useUser();
  const {
    isOpen: isLoginOpen,
    onClose: onLoginClose,
    onOpen: onLoginOpen,
  } = useDisclosure();
  const {
    isOpen: isSignUpOpen,
    onClose: onSignUpClose,
    onOpen: onSignUpOpen,
  } = useDisclosure();

  const { colorMode, toggleColorMode } = useColorMode();
  const logoColor = useColorModeValue("red.500", "red.200");
  const Icon = useColorModeValue(FaMoon, FaSun);
  const toast = useToast();
  const toastId = useRef<ToastId>();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: logOut,
    onMutate: () => {
      toastId.current = toast({
        title: "로그아웃",
        description: "로그아웃중입니다.",
        status: "loading",
        position: "bottom-right",
      });
    },
    onSuccess: () => {
      if (toastId.current) {
        queryClient.refetchQueries({
          queryKey: ["me"],
        });
        queryClient.refetchQueries({
          queryKey: ["rooms"],
        });
        toast.update(toastId.current, {
          status: "success",
          title: "로그아웃",
          description: "로그아웃이 안료되었습니다!",
        });
      }
    },
    onError: () => {},
  });
  const onLogOut = async () => {
    mutation.mutate();
  };
  return (
    <Stack
      paddingY={5}
      paddingX={{
        base: 10,
        lg: 40,
      }}
      alignItems={"center"}
      direction={{
        sm: "column",
        md: "row",
      }}
      spacing={{
        sm: 4,
        md: 0,
      }}
      borderBottomWidth={1}
      justifyContent={"space-between"}
    >
      <Link to={"/"}>
        <Box color={logoColor}>
          <FaAirbnb size={48} />
        </Box>
      </Link>
      <HStack spacing={2}>
        <IconButton
          onClick={toggleColorMode}
          variant={"ghost"}
          aria-label="Toggle Dark Mode"
          icon={<Icon />}
        />

        {!userLoading ? (
          !isLoggedIn ? (
            <>
              <Button onClick={onLoginOpen}>로그인</Button>
              <LightMode>
                <Button onClick={onSignUpOpen} colorScheme="red">
                  회원가입
                </Button>
              </LightMode>
            </>
          ) : (
            <Menu>
              <MenuButton>
                <Avatar name={user?.name} size={"md"} src={user?.avatar} />
              </MenuButton>
              <MenuList>
                {user?.is_host ? (
                  <Link to={"rooms/upload"}>
                    <MenuItem>업로드</MenuItem>
                  </Link>
                ) : null}
                <MenuItem onClick={onLogOut}>로그아웃</MenuItem>
              </MenuList>
            </Menu>
          )
        ) : null}
      </HStack>
      <LoginModal isOpen={isLoginOpen} onClose={onLoginClose} />
      <SignUpModal isOpen={isSignUpOpen} onClose={onSignUpClose} />
    </Stack>
  );
}
