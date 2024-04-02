import { Box, Button, Divider, HStack, Text, VStack } from "@chakra-ui/react";
import { FaComment, FaGithub } from "react-icons/fa";
import { SiNaver } from "react-icons/si";
import Cookie from "js-cookie";

export default function SocialLogin() {
  const kakaoParams = {
    response_type: "code",
    client_id: "53fc0ecca4b497fbc215cf23e1b300fd",
    redirect_uri: "https://airbnbclonejb.shop/social/kakao",
  };
  const kakaoParam = new URLSearchParams(kakaoParams).toString();

  const naverParams = {
    response_type: "code",
    client_id: "fpoOdeasfK9LdgkuknhQ",
    redirect_uri: "https://airbnbclonejb.shop/social/naver",
    state: Cookie.get("csrftoken") ?? "",
  };

  const naverParam = new URLSearchParams(naverParams).toString();

  return (
    <Box marginBottom={4}>
      <HStack marginY={8}>
        <Divider />
        <Text
          textTransform={"uppercase"}
          color={"gray.500"}
          fontSize={"xs"}
          as={"b"}
        >
          or
        </Text>
        <Divider />
      </HStack>
      <VStack>
        <Button
          as={"a"}
          href="https://github.com/login/oauth/authorize?client_id=4ff505a15275ca6c50a6&scope=read:user,user:email"
          width={"100%"}
          leftIcon={<FaGithub />}
        >
          Github로 로그인
        </Button>
        <Button
          as={"a"}
          href={`https://kauth.kakao.com/oauth/authorize?${kakaoParam}`}
          width={"100%"}
          leftIcon={<FaComment />}
          colorScheme={"yellow"}
        >
          Kakao로 로그인
        </Button>
        <Button
          as={"a"}
          href={`https://nid.naver.com/oauth2.0/authorize?${naverParam}`}
          width={"100%"}
          leftIcon={<SiNaver />}
          colorScheme={"green"}
        >
          Naver로 로그인
        </Button>
      </VStack>
    </Box>
  );
}
