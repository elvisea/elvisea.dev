import { FileTextIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ResumeFileModel } from "@/features/resume/files/view-model/get-resume-view-model";
import { cn } from "cn";

/** Card de um PDF do currículo, com o botão de download (abre em nova aba). */
export function ResumeFileCard({ file }: { file: ResumeFileModel }) {
  return (
    <Card className="h-full">
      <CardHeader className="gap-3">
        <FileTextIcon aria-hidden className="size-6 text-primary" />
        <CardTitle className="text-lg font-semibold text-heading">
          <h2>{file.title}</h2>
        </CardTitle>
        <CardDescription className="text-base text-pretty">
          {file.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto">
        <a
          className={cn(
            buttonVariants({ size: "lg" }),
            "h-11 w-full px-5 sm:w-auto",
          )}
          href={file.href}
          rel="noopener"
          target="_blank"
        >
          {file.download}
        </a>
      </CardFooter>
    </Card>
  );
}
