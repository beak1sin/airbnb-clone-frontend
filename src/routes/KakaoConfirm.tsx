import {
  Button,
  Heading,
  Spinner,
  Text,
  ToastId,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { kakaoLogin } from "../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function KakaoConfirm() {
  const { search } = useLocation();
  const toast = useToast();
  const toastId = useRef<ToastId>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: kakaoLogin,
    onMutate: () => {
      toastId.current = toast({
        status: "loading",
        title: "로그인",
        description: "카카오 로그인을 시도하고 있습니다🤔",
        position: "bottom-right",
      });
    },
    onSuccess: () => {
      if (toastId.current) {
        toast.update(toastId.current, {
          status: "success",
          title: "로그인",
          description: "카카오 로그인 성공😁",
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
    if (code) {
      mutation.mutate(code);
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
