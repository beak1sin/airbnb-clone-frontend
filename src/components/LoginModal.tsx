import {
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  ToastId,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { FaLock, FaUserNinja } from "react-icons/fa";
import SocialLogin from "./SocialLogin";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  IUsernameLoginError,
  IUsernameLoginSuccess,
  IUsernameLoginVariables,
  usernameLogin,
} from "../api";

interface ILoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface IForm {
  username: string;
  password: string;
}

export default function LoginModal({ isOpen, onClose }: ILoginModalProps) {
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IForm>();

  const toast = useToast();
  const toastId = useRef<ToastId>();
  const queryClient = useQueryClient();
  const mutation = useMutation<
    IUsernameLoginSuccess,
    IUsernameLoginError,
    IUsernameLoginVariables
  >({
    mutationFn: usernameLogin,
    onMutate: () => {
      console.log("mutation starting");
      toastId.current = toast({
        title: "로그인",
        description: "로그인을 시도하고 있습니다🤔",
        status: "loading",
      });
    },
    onSuccess: (data) => {
      if (toastId.current) {
        toast.update(toastId.current, {
          title: "로그인",
          description: "로그인 성공😁",
          status: "success",
        });
        onClose();
        queryClient.refetchQueries({
          queryKey: ["me"],
        });
        queryClient.refetchQueries({
          queryKey: ["rooms"],
        });
        reset();
        console.log(data.ok);
      }
    },
    onError: (error) => {
      if (toastId.current) {
        toast.update(toastId.current, {
          title: "로그인 실패",
          description: "아이디와 비밀번호가 올바르지 않습니다🥺",
          status: "error",
        });
      }
    },
  });

  const onSubmit = ({ username, password }: IForm) => {
    mutation.mutate({ username, password });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>로그인</ModalHeader>
        <ModalCloseButton />
        {/* as any를 빼면 타입 정의하라고 에러 뜨는데 event 타입을 div로 바꾸면됨. 둘 중 하나 선택! */}
        <ModalBody as={"form"} onSubmit={handleSubmit(onSubmit)}>
          <VStack>
            <InputGroup>
              <InputLeftElement
                children={
                  <Box color={"gray.500"}>
                    <FaUserNinja />
                  </Box>
                }
              />
              <Input
                // required
                isInvalid={Boolean(errors.username?.message)}
                {...register("username", {
                  required: "아이디를 입력해주세요.",
                  minLength: {
                    value: 6,
                    message: "6자리 이상이여야 합니다.",
                  },
                })}
                variant={"filled"}
                placeholder="아이디"
              />
            </InputGroup>
            {/* <Text fontSize={"sm"} color={"red.500"}>
              {errors.username?.message}
            </Text> */}
            <InputGroup>
              <InputLeftElement
                children={
                  <Box color={"gray.500"}>
                    <FaLock />
                  </Box>
                }
              />
              <Input
                // required
                isInvalid={Boolean(errors.password?.message)}
                {...register("password", {
                  required: "비밀번호를 입력해주세요.",
                  minLength: {
                    value: 6,
                    message: "6자리 이상이여야 합니다.",
                  },
                })}
                variant={"filled"}
                placeholder="비밀번호"
                type="password"
                autoComplete="off"
              />
            </InputGroup>
            {/* <Text fontSize={"sm"} color={"red.500"}>
              {errors.password?.message}
            </Text> */}
          </VStack>
          <Button
            isLoading={mutation.isPending}
            type="submit"
            marginTop={4}
            colorScheme={"red"}
            width={"100%"}
          >
            로그인
          </Button>

          <SocialLogin />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
