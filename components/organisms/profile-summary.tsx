import { Card, CardContent } from "@/components/ui/card";
import { perfil } from "@/content/pt-BR/perfil";

/**
 * Resumo + atuação, compartilhado entre home e `/sobre`. O nível do título
 * depende de onde entra: `h3` dentro de uma seção da home, `h2` logo abaixo do
 * `h1` de `/sobre` (ordem de títulos sem saltos).
 */
export function ProfileSummary({
  atuacaoTitle,
  headingLevel: Heading = "h3",
}: {
  atuacaoTitle: string;
  headingLevel?: "h2" | "h3";
}) {
  return (
    <div className="space-y-6">
      <p className="max-w-3xl text-lg text-pretty text-foreground">
        {perfil.resumo}
      </p>
      <div className="space-y-3">
        <Heading className="font-mono text-xs tracking-wide text-highlight uppercase">
          {atuacaoTitle}
        </Heading>
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
