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
  ToastId,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { FaEnvelope, FaLock, FaUserNinja, FaUserSecret } from "react-icons/fa";
import SocialLogin from "./SocialLogin";
import { SiNaver } from "react-icons/si";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { singUp } from "../api";
import { useRef } from "react";
interface ISignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface IForm {
  username: string;
  password: string;
  name: string;
  email: string;
}

export default function SignUpModal({ isOpen, onClose }: ISignUpModalProps) {
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IForm>();

  const toast = useToast();
  const toastId = useRef<ToastId>();

  const mutation = useMutation({
    mutationFn: singUp,
    onMutate: () => {
      console.log("mutation starting");
      toastId.current = toast({
        title: "회원가입",
        description: "회원가입을 시도하고 있습니다🤔",
        status: "loading",
      });
    },
    onSuccess: (data) => {
      if (toastId.current) {
        toast.update(toastId.current, {
          title: "회원가입",
          description: "회원가입 성공😁",
          status: "success",
        });
        onClose();
        reset();
        console.log(data);
      }
    },
    onError: (error) => {
      if (toastId.current) {
        toast.update(toastId.current, {
          title: "회원가입 실패",
          description: "회원가입을 실패했습니다.🥺",
          status: "error",
        });
        console.log(error);
      }
    },
  });

  const onSubmit = ({ username, password, name, email }: IForm) => {
    mutation.mutate({ username, password, name, email });
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>회원가입</ModalHeader>
        <ModalCloseButton />
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
            <InputGroup>
              <InputLeftElement
                children={
                  <Box color={"gray.500"}>
                    <FaLock />
                  </Box>
                }
              />
              <Input
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
            <InputGroup>
              <InputLeftElement
                children={
                  <Box color={"gray.500"}>
                    <FaUserSecret />
                  </Box>
                }
              />
              <Input
                isInvalid={Boolean(errors.name?.message)}
                {...register("name", {
                  required: "이름을 입력해주세요.",
                  // validate: (value) => value.length >= 2 || value.length === 0, 선택사항
                  minLength: {
                    value: 2,
                    message: "최소 2자리 이상이여야 합니다.",
                  },
                })}
                variant={"filled"}
                placeholder="이름"
              />
            </InputGroup>
            <InputGroup>
              <InputLeftElement
                children={
                  <Box color={"gray.500"}>
                    <FaEnvelope />
                  </Box>
                }
              />
              <Input
                isInvalid={Boolean(errors.email?.message)}
                {...register("email", {
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "이메일 형식이 아닙니다.",
                  },
                })}
                variant={"filled"}
                placeholder="이메일"
              />
            </InputGroup>
          </VStack>
          <Button
            type="submit"
            marginTop={4}
            colorScheme={"red"}
            width={"100%"}
          >
            회원가입
          </Button>

          <SocialLogin />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
