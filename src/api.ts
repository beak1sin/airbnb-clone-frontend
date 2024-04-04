import { QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";
import Cookie from "js-cookie";
import { formatDate } from "./lib/utils";
import { IAmenity, ICategory } from "./types";
import { useParams } from "react-router-dom";

const axiosInstance = axios.create({
    baseURL: process.env.NODE_ENV === "development" ?
     "http://127.0.0.1:8080/api/v1/" : 
    //  "https://airbnbclone-1cq0.onrender.com/api/v1/",
    "https://backend.airbnbclonejb.shop/api/v1/",
    withCredentials: true, // 쿠키도 같이 보내겠다는 뜻임. 로그인관련 세션아이디를 가져올수있음.
})

export const getRooms = () => axiosInstance.get("rooms/").then(response => response.data);

// export async function getRooms() {
//     const response = await axiosInstance.get(`rooms/`);
//     return response.data;
// }

export const getRoom = ({queryKey}: QueryFunctionContext) => {
    const [_, roomPk] = queryKey;
    return axiosInstance.get(`rooms/${roomPk}`).then(response => response.data);
}

export const getRoomReviews = ({queryKey}: QueryFunctionContext) => {
    const [_, roomPk] = queryKey;
    return axiosInstance.get(`rooms/${roomPk}/reviews`).then(response => response.data);
}

export const roomDelete = (roomPk:string) => axiosInstance.delete(`rooms/${roomPk}`, {
    headers: {
        "X-CSRFToken": Cookie.get("csrftoken"),
    }
}).then(response => response.data);

export const getMe = () => axiosInstance.get("users/me").then(response => response.data); 

export const logOut = () => axiosInstance.post("users/log-out", null, {
    headers: {
        "X-CSRFToken": Cookie.get("csrftoken"),
    }
}).then(response => response.data);

export const githubLogin = (code:string) => axiosInstance.post("users/github", {code}, {
    headers: {
        "X-CSRFToken": Cookie.get("csrftoken"),
        // "X-CSRFToken": Cookie.get("csrftoken") || "",
    }    
}).then(response => response.status);

export const kakaoLogin = (code:string) => axiosInstance.post("users/kakao", {code}, {
    headers: {
        "X-CSRFToken": Cookie.get("csrftoken"),
        // "X-CSRFToken": Cookie.get("csrftoken") || "",
    }    
}).then(response => response.status);

interface INaverLogin {
    code: string;
    state: string;
}
export const naverLogin = ({code, state}:INaverLogin) => axiosInstance.post("users/naver", {code, state}, {
    headers: {
        "X-CSRFToken": Cookie.get("csrftoken"),
    }
}).then(response => response.status);

export interface IUsernameLoginVariables {
    username:string;
    password:string;
}

export interface IUsernameLoginSuccess {
    ok: string;
}

export interface IUsernameLoginError {
    error: string;
}

// mutation 로그인
export const usernameLogin = ({username, password}:IUsernameLoginVariables) => axiosInstance.post("users/log-in", {username, password}, {
    headers: {
        "X-CSRFToken": Cookie.get("csrftoken"),
        // "X-CSRFToken": Cookie.get("csrftoken") || "",
    }    
}).then(response => response.data);


export interface ISignUpVariables {
    username:string;
    password:string;
    name:string;
    email:string;
}


// mutation 회원가입
export const singUp = ({username, password, name, email}:ISignUpVariables) => axiosInstance.post("users/sign-up", {username, password, name, email}, {
    headers: {
        "X-CSRFToken": Cookie.get("csrftoken"),
        // "X-CSRFToken": Cookie.get("csrftoken") || "",
    }    
}).then(response => response.data);

export const getAmenities = () => axiosInstance.get("rooms/amenities").then(response => response.data); 

export const getRoomCategories = () => axiosInstance.get("categories", {"params": {
    "kind": "room",
}}).then(response => response.data); 

export interface IUploadRoomVariables {
    pk: string;
    name: string;
    country: string;
    city: string;
    price: number;
    rooms: number;
    toilets: number;
    description: string;
    address: string;
    pet_friendly: boolean;
    kind: string;
    // amenities: number[];
    // category: number;
    category: ICategory;
    amenities: IAmenity[];
}

export const uploadRoom = (variables:IUploadRoomVariables) => axiosInstance.post("rooms/", variables, {
    headers: {
        "X-CSRFToken": Cookie.get("csrftoken"),
    }    
}).then(response => response.data);

export const updateRoom = (variables:IUploadRoomVariables) => axiosInstance.put(`rooms/${variables.pk}`, variables, {
    headers: {
        "X-CSRFToken": Cookie.get("csrftoken"),
    }    
}).then(response => response.data);

export const getUploadUrl = () => axiosInstance.post("medias/photos/get-url", null, {
    headers: {
        "X-CSRFToken": Cookie.get("csrftoken"),
    }    
}).then(response => response.data);

export interface IUploadImageVariables {
    file: FileList;
    uploadURL: string;
}

export const uploadImage = ({file, uploadURL}:IUploadImageVariables) => {
    const form = new FormData();
    form.append("file", file[0]);
    return axios.post(uploadURL, form, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    }).then(respones => respones.data);
}

export interface ICreateImageVariables {
    description: string;
    file: string;
    roomPk: string;
}

export const createImage = ({description, file, roomPk}: ICreateImageVariables) => axiosInstance.post(`rooms/${roomPk}/photos`, {description, file},{    
    headers: {
        "X-CSRFToken": Cookie.get("csrftoken"),
    }     
}).then(respones => respones.data);

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

type CheckBookingQueryKey = [string, string?, Value?];

export const checkBooking = ({queryKey}: QueryFunctionContext<CheckBookingQueryKey>) => {
    const [_, roomPk, dates] = queryKey;
    if (dates && Array.isArray(dates)) {
        const [firstDate, secondDate] = dates;
        if (firstDate && secondDate) {
            const check_in = formatDate(firstDate);
            const check_out = formatDate(secondDate);
            return axiosInstance.get(`rooms/${roomPk}/bookings/check?check_in=${check_in}&check_out=${check_out}`).then(response => response.data);
        }
    }

};

interface RoomBookingVariables {
    pk: string;
    check_in: ValuePiece;
    check_out: ValuePiece;
    guests: number;
}

export const roomBooking = (data:RoomBookingVariables) => axiosInstance.post(`rooms/${data.pk}/bookings`, data, {
    headers: {
        "X-CSRFToken": Cookie.get("csrftoken"),
    }
}).then(response => response.data);