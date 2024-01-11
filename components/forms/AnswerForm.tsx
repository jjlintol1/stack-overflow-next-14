"use client";

import * as z from "zod";

import { useTheme } from "@/context/ThemeProvider";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { AnswersSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Editor } from "@tinymce/tinymce-react";
import { createAnswer } from "@/lib/actions/answer.action";
import { toast } from "../ui/use-toast";

interface IAnswerFormProps {
  mongoUserId: string;
  questionId: string;
}

const AnswerForm = ({ mongoUserId, questionId }: IAnswerFormProps) => {
  const editorRef = useRef(null);

  const { mode } = useTheme();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  //   const router = useRouter();
  const pathname = usePathname();

  const form = useForm<z.infer<typeof AnswersSchema>>({
    resolver: zodResolver(AnswersSchema),
    defaultValues: {
      content: "",
    },
  });

  async function onSubmit(values: z.infer<typeof AnswersSchema>) {
    setIsSubmitting(true);
    try {
      await createAnswer({
        content: values.content,
        author: JSON.parse(mongoUserId),
        question: JSON.parse(questionId),
        path: pathname,
      });
      form.reset();

      if (editorRef.current) {
        const editor = editorRef.current as any;
        editor.setContent("");
      }

      toast({
        title: "Answer creation successful"
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Answer creation failed",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="flex w-full flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">
          Write your answer here
        </h4>
        <Button
          className="background-light800_dark300 flex w-full justify-center gap-1 rounded-[5px] border border-light-700 px-4 py-2.5 dark:border-dark-400 sm:w-fit"
          onClick={() => {}}
          disabled
        >
          <Image
            src="/assets/icons/stars.svg"
            width={12}
            height={12}
            alt="stars"
            className="object-contain"
          />
          <p className="small-medium primary-text-gradient">
            Generate AI Answer
          </p>
        </Button>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-6 flex w-full flex-col gap-10"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl className="">
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                    onInit={(evt, editor) => {
                      // @ts-ignore
                      editorRef.current = editor;
                    }}
                    onBlur={field.onBlur}
                    onEditorChange={(content) => field.onChange(content)}
                    init={{
                      height: 350,
                      menubar: false,
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "codesample",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                      ],
                      toolbar:
                        "undo redo | " +
                        "codesample | bold italic forecolor | alignleft aligncenter | " +
                        "alignright alignjustify | bullist numlist",
                      content_style:
                        "body { font-family:Inter; font-size:16px; }",
                      skin: mode === "dark" ? "oxide-dark" : "oxide",
                      content_css: mode === "dark" ? "dark" : "light",
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex w-full justify-end">
            <Button
              type="submit"
              className="primary-gradient w-fit !text-light-900"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Posting..." : "Post Answer"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default AnswerForm;
