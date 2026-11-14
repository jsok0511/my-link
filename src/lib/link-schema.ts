import * as z from "zod";

export const linkSchema = z.object({
  title: z.string().trim().min(2, "제목은 2자 이상 입력해 주세요."),
  url: z
    .string()
    .trim()
    .url("올바른 URL 형식(http:// 또는 https:// 포함)으로 입력해 주세요."),
  description: z.string().trim().optional(),
  icon: z.string().trim().optional(),
});

export type LinkFormValues = z.infer<typeof linkSchema>;
