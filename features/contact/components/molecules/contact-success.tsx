import { CheckCircle2Icon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ContactSuccessProps {
  title: string;
  description: string;
  again: string;
  onRestart: () => void;
}

/** Confirmação depois do envio, com o botão para mandar outra mensagem. */
export function ContactSuccess({
  title,
  description,
  again,
  onRestart,
}: ContactSuccessProps) {
  return (
    <Alert className="gap-2 p-6" role="status">
      <CheckCircle2Icon aria-hidden className="size-6! text-primary!" />
      <AlertTitle className="text-lg text-heading">{title}</AlertTitle>
      <AlertDescription className="space-y-4">
        <p>{description}</p>
        <Button
          className="h-11 px-5"
          type="button"
          variant="outline"
          onClick={onRestart}
        >
          {again}
        </Button>
      </AlertDescription>
    </Alert>
  );
}
