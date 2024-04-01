import {
  Heading,
  Spinner,
  Text,
  ToastId,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { naverLogin } from "../api";

export default function NaverConfirm() {
  const { search } = useLocation();
  const toast = useToast();
  const toastId = useRef<ToastId>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: naverLogin,
    onMutate: () => {
      toastId.current = toast({
        status: "loading",
        title: "로그인",
        description: "네이버 로그인을 시도하고 있습니다🤔",
        position: "bottom-right",
      });
    },
    onSuccess: () => {
      if (toastId.current) {
        toast.update(toastId.current, {
          status: "success",
          title: "로그인",
          description: "네이버 로그인 성공😁",
          position: "bottom-right",
        });
        queryClient.refetchQueries({ queryKey: ["me"] });
        navigate("/");
      }
    },
    onError: (error) => {
      if (toastId.current) {
        toast.update(toastId.current, {
          title: "로그인 실패",
          description: "로그인을 실패했습니다.🥺",
          status: "error",
        });
        console.log(error);
      }
    },
  });
  const confirmLogin = async () => {
    const params = new URLSearchParams(search);
    const code = params.get("code");
    const state = params.get("state");
    if (code && state) {
      mutation.mutate({ code, state });
    }
  };

  useEffect(() => {
    confirmLogin();
  }, []);
  return (
    <VStack bg={"gray.100"} justifyContent={"center"} minH={"90vh"}>
      <Heading>로그인 중...</Heading>
      <Text>페이지를 벗어나지 마십시오!</Text>
      <Spinner size={"lg"} />
    </VStack>
  );
}
