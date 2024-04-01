import {
  Box,
  Button,
  Grid,
  HStack,
  Heading,
  Image,
  Skeleton,
  SkeletonText,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import Room from "../components/Room";
import RoomSkeleton from "../components/RoomSkeleton";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRooms } from "../api";
import { IRoomList } from "../types";

export default function Home() {
  // 차크라 임폴트로 착각하면 안됨
  const { isLoading, data } = useQuery<IRoomList[]>({
    queryKey: ["rooms"],
    queryFn: getRooms,
  });
  return (
    <Grid
      marginTop={10}
      paddingX={{
        base: 10,
        lg: 40,
      }}
      columnGap={4}
      rowGap={8}
      templateColumns={{
        sm: "1fr",
        md: "1fr 1fr",
        lg: "repeat(3, 1fr)",
        xl: "repeat(4, 1fr)",
        "2xl": "repeat(5, 1fr)",
      }}
    >
      {isLoading ? (
        <Box>
          <RoomSkeleton />
        </Box>
      ) : null}
      {data?.map((room) => (
        <Room
          key={room.pk}
          pk={room.pk}
          name={room.name}
          rating={room.rating}
          city={room.city}
          country={room.country}
          price={room.price}
          is_owner={room.is_owner}
          photos={room.photos}
        />
      ))}
    </Grid>
  );
}
