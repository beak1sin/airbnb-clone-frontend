import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { checkBooking, getRoom, getRoomReviews, roomBooking } from "../api";
import { IReview, IRoomDetail } from "../types";
import "../calendar.css";
import {
  Avatar,
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Heading,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  Skeleton,
  SkeletonCircle,
  Text,
  ToastId,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FaFemale, FaMale, FaStar } from "react-icons/fa";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import RoomDeleteModal from "../components/RoomDeleteModal";
import { formatDate } from "../lib/utils";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function RoomDetail() {
  // 룸 삭제 모달 기능
  const {
    isOpen: isRoomDeleteOpen,
    onClose: onRoomDeleteClose,
    onOpen: onRoomDeleteOpen,
  } = useDisclosure();

  const { roomPk } = useParams();
  const { isLoading, data } = useQuery<IRoomDetail>({
    queryKey: ["rooms", roomPk],
    queryFn: getRoom,
  });
  const { isLoading: isReviewsLoading, data: reviewsData } = useQuery<
    IReview[]
  >({
    queryKey: ["rooms", roomPk, "reviews"],
    queryFn: getRoomReviews,
  });

  const [dates, setDates] = useState<Value>();
  const [guests, setGuests] = useState(0);
  const onChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    if (name === "guests") {
      setGuests(Number(value));
    }
  };
  const {
    data: checkBookingData,
    isLoading: isCheckBookingLoading,
    refetch,
  } = useQuery({
    queryKey: ["check", roomPk, dates],
    queryFn: checkBooking,
    enabled: dates !== undefined,
    gcTime: 0,
  });

  const toast = useToast();
  const toastId = useRef<ToastId>();

  const mutation = useMutation({
    mutationFn: roomBooking,
    onMutate: () => {
      toastId.current = toast({
        status: "loading",
        title: "방 예약",
        description: "방 예약을 시도하고 있습니다🤔",
        position: "bottom-right",
      });
    },
    onSuccess: () => {
      if (toastId.current) {
        toast.update(toastId.current, {
          status: "success",
          title: "방 예약",
          description: "방 예약 성공😁",
          position: "bottom-right",
        });
      }
    },
    onError: (error) => {
      if (toastId.current) {
        toast.update(toastId.current, {
          title: "방 예약",
          description: "방 예약을 실패했습니다.🥺",
          status: "error",
        });
        console.log(error);
      }
    },
  });

  const bookingClick = () => {
    if (dates && roomPk && Array.isArray(dates)) {
      mutation.mutate({
        pk: roomPk,
        check_in: dates[0],
        check_out: dates[1],
        guests: guests,
      });
    }
  };

  return (
    <Box
      mt={10}
      px={{
        base: 10,
        lg: 40,
      }}
    >
      <Helmet>
        <title>{data ? data.name : "로딩중..."}</title>
      </Helmet>
      <Skeleton height={"43px"} width={"100%"} isLoaded={!isLoading}>
        <HStack justifyContent={"space-between"}>
          <Heading>{data?.name}</Heading>
          {data ? (
            data.is_owner ? (
              <HStack>
                <Link to={"update"}>
                  <Button>수정</Button>
                </Link>
                <Button onClick={onRoomDeleteOpen} colorScheme="red">
                  삭제
                </Button>
              </HStack>
            ) : null
          ) : null}
        </HStack>
      </Skeleton>
      <Grid
        mt={8}
        gap={3}
        rounded={"xl"}
        overflow={"hidden"}
        height={"60vh"}
        templateColumns={"repeat(4, 1fr)"}
        templateRows={"1fr 1fr"}
      >
        {[0, 1, 2, 3, 4].map((index) => (
          <GridItem
            colSpan={index === 0 ? 2 : 1}
            rowSpan={index === 0 ? 2 : 1}
            overflow={"hidden"}
            key={index}
          >
            <Skeleton isLoaded={!isLoading} w={"100%"} h={"100%"}>
              <Image
                objectFit={"cover"}
                w={"100%"}
                h={"100%"}
                src={
                  data?.photos[index] === undefined
                    ? ""
                    : data?.photos[index].file
                }
                fallbackSrc="https://imagedelivery.net/9eIK9qFXQVHEUfw3x1I_Uw/07ce8527-68d8-49a2-c99d-810008c66900/public"
              />
            </Skeleton>
          </GridItem>
        ))}
      </Grid>
      <Grid gap={20} templateColumns={"2fr 1fr"} maxW={"container.lg"}>
        <Box>
          <HStack justifyContent={"space-between"} mt={10}>
            <VStack alignItems={"flex-start"}>
              <Skeleton isLoaded={!isLoading}>
                <Heading fontSize={"2xl"}>
                  House Hosted by {data?.owner.name}
                </Heading>
              </Skeleton>
              <Skeleton isLoaded={!isLoading}>
                <HStack width={"100%"} justifyContent={"flex-start"}>
                  <Text>
                    {data?.toilets} toilet{data?.toilets === 1 ? "" : "s"}
                  </Text>
                  <Text>•</Text>
                  <Text>
                    {data?.rooms} room{data?.rooms === 1 ? "" : "s"}
                  </Text>
                </HStack>
              </Skeleton>
            </VStack>
            <SkeletonCircle size={"24"} isLoaded={!isLoading}>
              <Avatar
                name={data?.owner.name}
                size={"xl"}
                src={data?.owner.avatar}
              ></Avatar>
            </SkeletonCircle>
          </HStack>
          <Box mt={10} mb={10}>
            <Skeleton isLoaded={!isLoading} mb={5}>
              <Heading fontSize={"2xl"}>
                <HStack>
                  <FaStar /> <Text>{data?.rating}</Text>
                  <Text>•</Text>
                  <Text>
                    {reviewsData?.length} review
                    {reviewsData?.length === 1 ? "" : "s"}
                  </Text>
                </HStack>
              </Heading>
            </Skeleton>
            <Container mt={16} marginX={"none"} maxW={"container.lg"}>
              <Skeleton isLoaded={!isReviewsLoading} h={"300px"}>
                <Grid templateColumns={"1fr 1fr"} gap={10}>
                  {reviewsData?.map((review) => (
                    <VStack alignItems={"flex-start"} key={review.pk} gap={4}>
                      <HStack>
                        {/* <SkeletonCircle isLoaded={!isReviewsLoading} size={"16"}> */}
                        <Avatar
                          name={review.user.name}
                          src={review.user.avatar}
                          size={"md"}
                        />
                        {/* </SkeletonCircle> */}
                        <VStack alignItems={"flex-start"} spacing={0}>
                          <Heading fontSize={"md"}>{review.user.name}</Heading>
                          <HStack>
                            <FaStar size={"12px"} />
                            <Text>{review.rating}</Text>
                          </HStack>
                        </VStack>
                      </HStack>
                      <Text>{review.payload}</Text>
                    </VStack>
                  ))}
                </Grid>
              </Skeleton>
            </Container>
          </Box>
        </Box>
        <Box pt={10}>
          <Calendar
            // showDoubleView 2개 보여주기
            onChange={setDates}
            prev2Label={null} // 이전 년도 버튼 숨기기
            next2Label={null} // 다음 년도 버튼 숨기기
            minDetail="month" // 달로 보기
            minDate={new Date()} // 최소 날짜 (현재 기준으로)
            maxDate={new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 * 4 * 12)} // 1년 뒤까지만 나오게
            selectRange // 범위 설정 가능하게
            // goToRangeStartOnSelect
          />
          <FormControl>
            <FormLabel>게스트</FormLabel>
            <InputGroup>
              <InputLeftAddon
                children={
                  <Box>
                    <FaMale />
                    <FaFemale />
                  </Box>
                }
              ></InputLeftAddon>
              <Input
                name="guests"
                value={guests}
                onChange={onChange}
                type="number"
                min={0}
              ></Input>
            </InputGroup>
          </FormControl>
          <Button
            isDisabled={!checkBookingData?.ok || guests === 0}
            isLoading={isCheckBookingLoading && dates !== undefined}
            mt={"5"}
            w={"100%"}
            colorScheme="red"
            onClick={bookingClick}
          >
            예약하기
          </Button>
          {!checkBookingData?.ok && !isCheckBookingLoading ? (
            <Text mt={"5"} textAlign={"center"} color={"red.500"}>
              죄송헙니다. 이 날짜에는 예약을 할 수 없습니다.
            </Text>
          ) : null}
        </Box>
      </Grid>
      <RoomDeleteModal isOpen={isRoomDeleteOpen} onClose={onRoomDeleteClose} />
    </Box>
  );
}
