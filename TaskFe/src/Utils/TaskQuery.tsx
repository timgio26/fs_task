import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "./useAuth";
import { useNavigate } from "react-router";
import {  z } from "zod";
import toast from "react-hot-toast";

const LoginSchema = z.object({
  token: z.string(),
});

type LoginDto = {
  username: string;
  password: string;
};

type SignupDto = {
  username: string;
  name:string;
  password: string;
};

type NewTaskDto = {
  taskName:string;
  deadLine:string;
  importance:number;
}

type UpdateTaskDto = {
  taskName:string;
  deadLine:string;
  importance:number;
  active:boolean
}

const TaskSchema = z.object({
  id:z.string(),
  taskName:z.string(),
  active:z.boolean(),
  importance:z.number(),
  deadLine:z.string(),
})

const TaskListSchema = z.array(TaskSchema)



export function useLogin() {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationFn: async (loginDto: LoginDto) => {
      const data = await axios.post("api/signin", loginDto);
      const parseResult = LoginSchema.safeParse(data.data);
      if (!parseResult.success) {
        throw new Error("parse error");
      }
      return parseResult.data;
    },
    onSuccess: (data) => {
      setToken(data.token);
      navigate("/");
    },
    onError: (error) => {console.log(error);toast.error("cant login. try again")},
  });
  return { mutate, isPending };
}

export function useSignup(){
  const {mutate,isPending} = useMutation({
    mutationFn:async(SignupDto:SignupDto)=>{
      const data = await axios.post("api/signup",SignupDto)
      if(data.status!==200){
        throw new Error("signup error")
      }
    },
    onSuccess:()=>{
      toast.success("please login")
    },
    onError:()=>{
      toast.error("cant signup. try again later")
    }
  })
  return {mutate,isPending}
}

export function useGetTask(){
  const { token } = useAuth();
  const {data,isLoading,isError} = useQuery({
    queryFn:async()=>{
      const resp = await axios.get("api/",{headers:{Authorization:`Bearer ${token}`}})
      if(resp.status!=200){throw new Error("fail get task")}
      const parseResult = TaskListSchema.safeParse(resp.data)
      if(!parseResult.success){throw new Error("fail parsing")}
      return parseResult.data;
    },
    queryKey:['task'],
  })
  return {data,isLoading,isError}
}

export function useDelTask(){
  const { token } = useAuth();
  const queryClient = useQueryClient()
  const {mutate,isPending} = useMutation({
    mutationFn:async(id:string)=>{
      await axios.delete(`api/${id}`,{headers:{Authorization:`Bearer ${token}`}})
    },
    onSuccess:()=>{
      toast.success("task successfully removed")
      queryClient.invalidateQueries({queryKey:['task']})
    },
    onError:()=>{
      toast.error("cant delete task, try again later")
    }
  })
  return {mutate,isPending};
}

export function useAddTask(){
  const { token } = useAuth();
  const queryClient = useQueryClient()
  const {mutate,isPending} = useMutation({
    mutationFn:async(data:NewTaskDto)=>{
      const resp = await axios.post("api/",data,{headers:{Authorization:`Bearer ${token}`}})
      if(resp.status!=201){throw new Error("error")}
    },
    onError:()=>{
      toast.error("cant add task")
    },
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:['task']})
    }
  })
  return {mutate,isPending}
}

export function useUpdateTask(){
  const { token } = useAuth();
  const queryClient = useQueryClient()
  const {mutate,isPending} = useMutation({
    mutationFn:async({id,data}:{id:string,data:UpdateTaskDto})=>{
      const resp = await axios.put(`api/${id}`,data,{headers:{Authorization:`Bearer ${token}`}})
      if(resp.status!=204){throw new Error(resp.statusText)}
      return resp
    },
    onError:()=>{toast.error("cant edit task")},
    onSuccess:()=>{queryClient.invalidateQueries({queryKey:['task']})}
  })
  return {mutate,isPending}
}
