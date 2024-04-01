import {
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
} from "@chakra-ui/react";
import { FaLock, FaUserNinja } from "react-icons/fa";
import SocialLogin from "./SocialLogin";
import React, { useState } from "react";

interface ILoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: ILoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const onChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    if (name === "username") {
      setUsername(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>로그인</ModalHeader>
        <ModalCloseButton />
        {/* as any를 빼면 타입 정의하라고 에러 뜨는데 event 타입을 div로 바꾸면됨. 둘 중 하나 선택! */}
        <ModalBody as={"form"} onSubmit={onSubmit as any}>
          <VStack>
            <InputGroup>
              <InputLeftElement
                children={
                  <Box color={"gray.500"}>
                    <FaUserNinja />
                  </Box>
                }
              />
              <Input
                required
                name="username"
                onChange={onChange}
                value={username}
                variant={"filled"}
                placeholder="아이디"
              />
            </InputGroup>
            <InputGroup>
              <InputLeftElement
                children={
                  <Box color={"gray.500"}>
                    <FaLock />
                  </Box>
                }
              />
              <Input
                required
                name="password"
                onChange={onChange}
                value={password}
                variant={"filled"}
                placeholder="비밀번호"
                type="password"
                autoComplete="off"
              />
            </InputGroup>
          </VStack>
          <Button
            type="submit"
            marginTop={4}
            colorScheme={"red"}
            width={"100%"}
          >
            로그인
          </Button>

          <SocialLogin />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
