import { Card, CardContent } from "@/components/ui/card";
import { perfil } from "@/content/pt-BR/perfil";

/** Resumo + atuação, compartilhado entre home e `/sobre`. */
export function ProfileSummary({ atuacaoTitle }: { atuacaoTitle: string }) {
  return (
    <div className="space-y-6">
      <p className="max-w-3xl text-lg text-pretty text-foreground">
        {perfil.resumo}
      </p>
      <div className="space-y-3">
        <h3 className="font-mono text-xs tracking-wide text-highlight uppercase">
          {atuacaoTitle}
        </h3>
        <ul className="grid gap-3 md:grid-cols-2">
          {perfil.atuacao.map((item) => (
            <li key={item}>
              <Card className="h-full">
                <CardContent className="text-base text-pretty text-foreground">
                  {item}
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
