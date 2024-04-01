import {
  Button,
  HStack,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  ToastId,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { roomDelete } from "../api";
import { useNavigate, useParams } from "react-router-dom";
import { useRef } from "react";

interface IRoomDeleteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RoomDeleteModal({ isOpen, onClose }: IRoomDeleteProps) {
  const { roomPk } = useParams();
  const toast = useToast();
  const toastId = useRef<ToastId>();
  const navigate = useNavigate();
  const roomDeleteMutation = useMutation({
    mutationFn: roomDelete,
    onMutate: () => {
      console.log("mutation starting");
      toastId.current = toast({
        title: "방 삭제",
        description: "방 삭제를 시도하고 있습니다🤔",
        status: "loading",
      });
    },
    onSuccess: (data) => {
      if (toastId.current) {
        toast.update(toastId.current, {
          title: "방 삭제",
          description: "방 삭제 성공😁",
          status: "success",
        });
        onClose();
        navigate("/");
      }
    },
  });
  const onRoomDeleteClick = () => {
    if (roomPk) {
      roomDeleteMutation.mutate(roomPk);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>방 삭제</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text textAlign={"center"}>방을 정말로 삭제하시겠습니까?</Text>
          <Text mt={"5"} textAlign={"center"}>
            삭제하시면 다시 복구할 수 없습니다.
          </Text>
        </ModalBody>
        <ModalFooter>
          <HStack w={"100%"}>
            <Button onClick={onRoomDeleteClick} colorScheme="red" w={"100%"}>
              삭제
            </Button>
            <Button onClick={onClose} w={"100%"}>
              취소
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
