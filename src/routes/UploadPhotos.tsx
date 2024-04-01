import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Textarea,
  ToastId,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import useHostOnlyPage from "../components/HostOnlyPage";
import ProtectedPage from "../components/ProtectedPage";
import { useMutation } from "@tanstack/react-query";
import { createImage, getUploadUrl, uploadImage } from "../api";
import { useRef } from "react";

interface IForm {
  file: FileList;
  description: string;
}

interface IUploadUrlResponse {
  id: string;
  uploadURL: string;
}

export default function UploadPhotos() {
  const { register, watch, handleSubmit, reset } = useForm<IForm>();
  const { roomPk } = useParams();
  const toast = useToast();
  const toastId = useRef<ToastId>();

  const createImageMutation = useMutation({
    mutationFn: createImage,
    onSuccess: (data: any) => {
      if (toastId.current) {
        toast.update(toastId.current, {
          status: "success",
          title: "사진 업로드",
          description: "사진 업로드 성공😁",
          position: "bottom-right",
        });
        reset();
      }
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: uploadImage,
    onSuccess: ({ result }: any) => {
      if (roomPk) {
        createImageMutation.mutate({
          roomPk: roomPk,
          file: result.variants[0],
          description: watch("description"),
        });
      }
    },
  });

  const uploadURLMutation = useMutation({
    mutationFn: getUploadUrl,
    onMutate: () => {
      toastId.current = toast({
        status: "loading",
        title: "사진 업로드",
        description: "새로운 사진 업로드를 시도하고 있습니다🤔",
        position: "bottom-right",
      });
    },
    onSuccess: (data: IUploadUrlResponse) => {
      uploadImageMutation.mutate({
        file: watch("file"),
        uploadURL: data.uploadURL,
      });
    },
  });

  const onSubmit = (data: any) => {
    uploadURLMutation.mutate();
  };
  useHostOnlyPage();

  return (
    <ProtectedPage>
      <Box
        pb={40}
        mt={10}
        px={{
          base: 10,
          lg: 40,
        }}
      >
        <Container>
          <Heading textAlign={"center"}>사진 업로드</Heading>
          <VStack
            as={"form"}
            onSubmit={handleSubmit(onSubmit)}
            spacing={5}
            mt={10}
          >
            <FormControl>
              <FormLabel>사진</FormLabel>
              <Input {...register("file")} type="file" accept="image/*" />
            </FormControl>
            <FormControl>
              <FormLabel>설명</FormLabel>
              <Textarea
                {...register("description", { required: true })}
              ></Textarea>
            </FormControl>
            <Button
              isLoading={
                uploadURLMutation.isPending ||
                uploadImageMutation.isPending ||
                createImageMutation.isPending
              }
              type="submit"
              w="full"
              colorScheme={"red"}
            >
              업로드
            </Button>
          </VStack>
        </Container>
      </Box>
    </ProtectedPage>
  );
}
