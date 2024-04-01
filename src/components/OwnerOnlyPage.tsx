import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRoom } from "../api";
import { useQuery } from "@tanstack/react-query";
import { IRoomDetail } from "../types";

export default function useOwnerOnlyPage() {
  const { roomPk } = useParams();
  const { isLoading, data } = useQuery<IRoomDetail>({
    queryKey: ["rooms", roomPk],
    queryFn: getRoom,
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!data?.is_owner) {
        navigate("/");
      }
    }
  }, [isLoading, data, navigate]);
  return;
}
