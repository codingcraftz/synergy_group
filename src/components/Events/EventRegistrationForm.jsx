"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/utils/supabase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function EventRegistrationForm({
  open,
  onOpenChange,
  event,
  onRegistrationComplete,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      setIsSubmitting(true);

      // 참가 신청 데이터 준비
      const registrationData = {
        event_id: event.id,
        name: values.name,
        email: values.email,
        phone: values.phone,
        company: values.company || "", // 회사명은 선택 사항
        registration_type: "web", // 웹 신청
        registered_at: new Date().toISOString(),
      };

      // Supabase에 참가 신청 저장
      const { error } = await supabase.from("event_participants").insert([registrationData]);

      if (error) throw error;

      // 성공 메시지 표시
      toast({
        title: "신청 완료",
        description: "행사 참가 신청이 성공적으로 완료되었습니다.",
      });

      // 폼 리셋 & 다이얼로그 닫기
      form.reset();
      onOpenChange(false);

      // 완료 콜백 호출
      if (onRegistrationComplete) {
        onRegistrationComplete();
      }
    } catch (error) {
      console.error("행사 참가 신청 중 오류가 발생했습니다:", error);
      toast({
        title: "오류",
        description: "행사 참가 신청 중 문제가 발생했습니다. 다시 시도해 주세요.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>행사 참가 신청</DialogTitle>
          <DialogDescription>
            {event?.title}에 참가 신청합니다. 필요한 정보를 입력해 주세요.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="name"
              rules={{ required: "이름을 입력해주세요" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    이름 <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="이름을 입력하세요" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              rules={{
                required: "이메일을 입력해주세요",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "유효한 이메일 주소를 입력해주세요",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    이메일 <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="이메일을 입력하세요" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              rules={{
                required: "연락처를 입력해주세요",
                pattern: {
                  value: /^[0-9]{2,3}-?[0-9]{3,4}-?[0-9]{4}$/,
                  message: "올바른 연락처 형식이 아닙니다 (예: 010-1234-5678)",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    연락처 <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="연락처를 입력하세요 (예: 010-1234-5678)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>소속/회사</FormLabel>
                  <FormControl>
                    <Input placeholder="소속이나 회사명을 입력하세요" {...field} />
                  </FormControl>
                  <FormDescription>선택 사항입니다.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                취소
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    신청 중...
                  </>
                ) : (
                  "신청하기"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
