"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";

const signInSchema = z.object({
  username: z.string(),
  password: z.string(),
});

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {

  const { register, handleSubmit, formState } = useForm({
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (value: FieldValues) => {
    const res = await fetch("/api/v1/accounts/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...value,
      }),
    });

    const data = await res.json();
    console.log(data);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">로그인</CardTitle>
          <CardDescription>
            사용자 이름과 비밀번호를 입력하세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">사용자 이름</Label>
                <Input
                  id="username"
                  type="username"
                  className="bg-background border-None"
                  {...register("username")}
                  placeholder="StudyMAIT"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">비밀번호</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  className="bg-background border-None"
                  {...register("password")}
                  placeholder="password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                로그인
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              처음이신가요?{" "}
              <a href="/register" className="underline underline-offset-4">
                회원가입하기
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
