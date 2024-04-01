import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api";
import { IUser } from "../types";

export default function useUser() {
    const {isLoading, data, isError} = useQuery<IUser>({
        queryKey: ["me"],
        queryFn: getMe,
        retry: false, // 반복적으로 요청하는거 유무
    })
    return {
        userLoading:isLoading,//변수명과 데이터명 같으면 변수명만 넣어도됨.
        user:data,
        isLoggedIn: !isError,
    }
}