import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Text,
  Textarea,
  ToastId,
  VStack,
  useToast,
} from "@chakra-ui/react";
import useHostOnlyPage from "../components/HostOnlyPage";
import ProtectedPage from "../components/ProtectedPage";
import { FaBed, FaToilet, FaWonSign } from "react-icons/fa";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  IUploadRoomVariables,
  getAmenities,
  getRoomCategories,
  uploadRoom,
} from "../api";
import { IAmenity, ICategory, IRoomDetail } from "../types";
import { useForm } from "react-hook-form";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

// ProtectedPage처럼 컴포넌트 형태로 감싸는 방식이 있고,
// useHostOnlyPage처럼 훅 형태의 방식이 있음

export default function UploadRoom() {
  useHostOnlyPage(); // useHostOnlyPage처럼 훅 형태의 방식이 있음
  const { register, watch, handleSubmit } = useForm<IUploadRoomVariables>();
  const { data: amenities, isLoading: isAmenitiesLoading } = useQuery<
    IAmenity[]
  >({
    queryKey: ["amenities"],
    queryFn: getAmenities,
  });

  const { data: categories, isLoading: isCategoriesLoading } = useQuery<
    ICategory[]
  >({
    queryKey: ["roomCategories"],
    queryFn: getRoomCategories,
  });

  const toast = useToast();
  const toastId = useRef<ToastId>();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: uploadRoom,
    onMutate: () => {
      toastId.current = toast({
        status: "loading",
        title: "방 생성",
        description: "새로운 방 생성을 시도하고 있습니다🤔",
        position: "bottom-right",
      });
    },
    onSuccess: (data: IRoomDetail) => {
      if (toastId.current) {
        toast.update(toastId.current, {
          status: "success",
          title: "방 생성",
          description: "방 생성 성공😁",
          position: "bottom-right",
        });
        navigate(`/rooms/${data.pk}`);
      }
    },
    onError: (error) => {
      if (toastId.current) {
        toast.update(toastId.current, {
          title: "방 생성",
          description: "방 생성을 실패했습니다.🥺",
          status: "error",
        });
        console.log(error);
      }
    },
  });

  const onSubmit = (data: IUploadRoomVariables) => {
    mutation.mutate(data);
  };

  return (
    // ProtectedPage처럼 컴포넌트 형태로 감싸는 방식이 있고,
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
          <Heading textAlign={"center"}>방 업로드</Heading>
          <VStack
            spacing={10}
            as={"form"}
            mt={5}
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormControl>
              <FormLabel>이름</FormLabel>
              <Input
                {...register("name", { required: true })}
                required
                type="text"
              ></Input>
              <FormHelperText>방 이름을 작성해주세요.</FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>국가</FormLabel>
              <Input
                {...register("country", { required: true })}
                required
                type="text"
              ></Input>
            </FormControl>
            <FormControl>
              <FormLabel>도시</FormLabel>
              <Input
                {...register("city", { required: true })}
                required
                type="text"
              ></Input>
            </FormControl>
            <FormControl>
              <FormLabel>주소</FormLabel>
              <Input
                {...register("address", { required: true })}
                required
                type="text"
              ></Input>
            </FormControl>
            <FormControl>
              <FormLabel>가격</FormLabel>
              <InputGroup>
                <InputLeftAddon children={<FaWonSign />}></InputLeftAddon>
                <Input
                  {...register("price", { required: true })}
                  type="number"
                  min={0}
                ></Input>
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel>방</FormLabel>
              <InputGroup>
                <InputLeftAddon children={<FaBed />}></InputLeftAddon>
                <Input
                  {...register("rooms", { required: true })}
                  type="number"
                  min={0}
                ></Input>
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel>화장실</FormLabel>
              <InputGroup>
                <InputLeftAddon children={<FaToilet />}></InputLeftAddon>
                <Input
                  {...register("toilets", { required: true })}
                  type="number"
                  min={0}
                ></Input>
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel>설명</FormLabel>
              <Textarea
                {...register("description", { required: true })}
              ></Textarea>
            </FormControl>
            <FormControl>
              <Checkbox {...register("pet_friendly", { required: true })}>
                펫 동반
              </Checkbox>
            </FormControl>
            <FormControl>
              <FormLabel>방의 종류</FormLabel>
              <Select
                {...register("kind", { required: true })}
                placeholder="종류를 선택해주세요."
              >
                <option value={"entire_place"}>Entire_place</option>
                <option value={"private_room"}>Private_room</option>
                <option value={"shared_room"}>Shared_room</option>
              </Select>
              <FormHelperText>어떤 종류의 방을 선택하실건가요?</FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>카테고리</FormLabel>
              <Select
                {...register("category", { required: true })}
                placeholder="카테고리를 선택해주세요."
              >
                {categories?.map((category) => (
                  <option key={category.pk} value={category.pk}>
                    {category.name}
                  </option>
                ))}
              </Select>
              <FormHelperText>어떤 카테고리를 원하시나요?</FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>어메니티</FormLabel>
              <Grid templateColumns={"1fr 1fr"} gap={5}>
                {amenities?.map((amenity) => (
                  <Box alignItems={"flex-start"} key={amenity.pk}>
                    <Checkbox
                      value={amenity.pk}
                      {...register("amenities", { required: true })}
                    >
                      {amenity.name}
                    </Checkbox>
                    <FormHelperText>{amenity.description}</FormHelperText>
                  </Box>
                ))}
              </Grid>
            </FormControl>
            {mutation.isError ? (
              <Text color={"red.500"}>에러가 발생했습니다.</Text>
            ) : null}

            <Button
              type="submit"
              isLoading={mutation.isPending}
              colorScheme="red"
              size={"lg"}
              w={"100%"}
            >
              업로드
            </Button>
          </VStack>
        </Container>
      </Box>
    </ProtectedPage>
  );
}
