import { Box, HStack, Skeleton, SkeletonText } from "@chakra-ui/react";

export default function RoomSkeleton() {
  return (
    <Box>
      <Skeleton height={280} rounded={"2xl"} mb={5} />
      <HStack mb={4} justifyContent={"space-between"}>
        <SkeletonText w={"50%"} noOfLines={1} />
        <SkeletonText w={"10%"} noOfLines={1} />
      </HStack>
      <SkeletonText w={"30%"} noOfLines={1} mb={5} />
      <SkeletonText w={"20%"} noOfLines={1} />
    </Box>
  );
}
