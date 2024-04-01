import {
  Box,
  Button,
  Grid,
  HStack,
  IconButton,
  Image,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaCamera, FaRegHeart, FaStar } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { IRoomDetail, IRoomList } from "../types";
import { SyntheticEvent } from "react";

export default function Room({
  photos,
  is_owner,
  name,
  rating,
  city,
  country,
  price,
  pk,
}: IRoomList) {
  const gray = useColorModeValue("gray.600", "gray.300");
  const navigate = useNavigate();
  const onCameraClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    navigate(`/rooms/${pk}/photos`);
  };
  const onLikeClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();
  };
  return (
    <Link to={`rooms/${pk}`}>
      <VStack alignItems={"flex-start"}>
        <Box
          position={"relative"}
          overflow={"hidden"}
          marginBottom={"2"}
          rounded={"3xl"}
        >
          <Image
            objectFit={"cover"}
            minHeight={"280"}
            src={photos[0] === undefined ? "" : photos[0].file}
            fallbackSrc="https://imagedelivery.net/9eIK9qFXQVHEUfw3x1I_Uw/07ce8527-68d8-49a2-c99d-810008c66900/public"
          />
          {/* <Box position={"absolute"} top={5} right={5} color={"white"}>
          <FaRegHeart size={20} cursor={"pointer"} />
        </Box> */}
          {/* <Button
            variant={"unstyled"}
            position={"absolute"}
            top={0}
            right={0}
            color={"white"}
            _hover={{ color: "red.400" }}
          > */}
          <Box
            position={"absolute"}
            top={4}
            right={4}
            color={"white"}
            _hover={{ color: "red.400" }}
            transition="color 0.2s ease-in-out"
            onClick={is_owner ? onCameraClick : onLikeClick}
          >
            {is_owner ? (
              // <FaCamera size={20} cursor={"pointer"} onClick={onCameraClick} />
              // <IconButton
              //   aria-label="Camera"
              //   icon={<FaCamera />}
              //   onClick={onCameraClick}
              // />

              <FaCamera size={20} cursor={"pointer"} />
            ) : (
              <FaRegHeart size={20} cursor={"pointer"} />
            )}
            {/* </Button> */}
          </Box>
        </Box>

        <Box width={"100%"}>
          {/* <Grid templateColumns={"6fr 1fr"} gap={2}>
          <Text display={"block"} as={"b"} noOfLines={1} fontSize={"sm"}>
            {name}
          </Text>
          <HStack spacing={1}>
            <FaStar size={15} />
            <Text>{rating}</Text>
          </HStack>
        </Grid> */}
          <HStack justifyContent={"space-between"} gap={2}>
            <Text display={"block"} as={"b"} noOfLines={1} fontSize={"sm"}>
              {name}
            </Text>
            <HStack spacing={1}>
              <FaStar size={15} />
              <Text>{rating}</Text>
            </HStack>
          </HStack>
          <Text fontSize={"sm"} color={gray}>
            {city}, {country}
          </Text>
        </Box>
        <Text fontSize={"sm"} color={gray}>
          <Text as={"b"}>${price}</Text> / night
        </Text>
      </VStack>
    </Link>
  );
}
