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
  getRoom,
  getRoomCategories,
  updateRoom,
  uploadRoom,
} from "../api";
import { IAmenity, ICategory, IRoomDetail } from "../types";
import { useForm } from "react-hook-form";
import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useOwnerOnlyPage from "../components/OwnerOnlyPage";

// ProtectedPage처럼 컴포넌트 형태로 감싸는 방식이 있고,
// useHostOnlyPage처럼 훅 형태의 방식이 있음

export default function UploadRoom() {
  useHostOnlyPage(); // useHostOnlyPage처럼 훅 형태의 방식이 있음
  useOwnerOnlyPage();
  const { roomPk } = useParams();
  const { isLoading: isRoomLoading, data: roomData } = useQuery<IRoomDetail>({
    queryKey: ["rooms", roomPk],
    queryFn: getRoom,
  });
  const { register, watch, handleSubmit, setValue } =
    useForm<IUploadRoomVariables>({
      defaultValues: {
        name: roomData ? roomData.name : "",
        country: roomData ? roomData.country : "",
        city: roomData ? roomData.city : "",
        address: roomData ? roomData.address : "",
        price: roomData ? roomData.price : undefined,
        rooms: roomData ? roomData.rooms : undefined,
        toilets: roomData ? roomData.toilets : undefined,
        description: roomData ? roomData.description : "",
        pet_friendly: roomData ? roomData.pet_friendly : undefined,
        kind: roomData ? roomData.kind : "",
        // category: roomData ? roomData.category.pk : undefined,

        category: roomData ? roomData.category : undefined,
        // category: roomData ? roomData.category : null,

        amenities: roomData ? roomData.amenities : undefined,
      },
    });

  useEffect(() => {
    if (roomData) {
      setValue("name", roomData.name);
      setValue("country", roomData.country);
      setValue("city", roomData.city);
      setValue("address", roomData.address);
      setValue("price", roomData.price);
      setValue("rooms", roomData.rooms);
      setValue("toilets", roomData.toilets);
      setValue("description", roomData.description);
      setValue("pet_friendly", roomData.pet_friendly);
      setValue("kind", roomData.kind);
      setValue("category", roomData.category);
      setValue("amenities", roomData.amenities);

      //   setValue(
      //     "amenities",
      //     roomData.amenities.map((a) => a.pk)
      //   );
    }
  }, [roomData, setValue]);

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
    mutationFn: updateRoom,
    onMutate: () => {
      toastId.current = toast({
        status: "loading",
        title: "방 수정",
        description: "방 수정을 시도하고 있습니다🤔",
        position: "bottom-right",
      });
    },
    onSuccess: (data: IRoomDetail) => {
      if (toastId.current) {
        toast.update(toastId.current, {
          status: "success",
          title: "방 수정",
          description: "방 수정 성공😁",
          position: "bottom-right",
        });
        navigate(`/rooms/${data.pk}`);
      }
    },
    onError: (error) => {
      if (toastId.current) {
        toast.update(toastId.current, {
          title: "방 수정",
          description: "방 수정을 실패했습니다.🥺",
          status: "error",
        });
        console.log(error);
      }
    },
  });

  const onUpdateSubmit = () => {
    if (roomPk) {
      const formData = watch();
      // mutation.mutate(formData);
      mutation.mutate({
        pk: roomPk,
        name: formData["name"],
        country: formData["country"],
        city: formData["city"],
        address: formData["address"],
        price: formData["price"],
        rooms: formData["rooms"],
        toilets: formData["toilets"],
        description: formData["description"],
        pet_friendly: formData["pet_friendly"],
        kind: formData["kind"],
        category: formData["category"],
        amenities: formData["amenities"],
      });
    }
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
          <Heading textAlign={"center"}>방 수정</Heading>
          <VStack
            spacing={10}
            as={"form"}
            mt={5}
            onSubmit={handleSubmit(onUpdateSubmit)}
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
              <Checkbox {...register("pet_friendly")}>펫 동반</Checkbox>
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
                key={roomData?.category?.pk}
                defaultValue={roomData?.category?.pk}
              >
                {categories?.map((category) => (
                  <option
                    key={category.pk}
                    value={category.pk}
                    // defaultChecked={true}
                    selected={category.pk === roomData?.category?.pk}
                  >
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
                      defaultChecked={roomData?.amenities?.some(
                        (a) => a.pk === amenity.pk
                      )}
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
              수정하기
            </Button>
          </VStack>
        </Container>
      </Box>
    </ProtectedPage>
  );
}
