import { MonoLabel } from "@/components/atoms/mono-label";
import { Card, CardContent } from "@/components/ui/card";
import type { ProfileModel } from "@/features/about/profile/view-model/get-about-view-model";

/**
 * Resumo e atuação, compartilhados entre a home e `/sobre`. O nível do título
 * depende de onde entra: `h3` dentro de uma seção da home, `h2` logo abaixo do
 * `h1` de `/sobre` (ordem de títulos sem saltos).
 */
export function ProfileSummary({
  profile,
  headingLevel = "h3",
}: {
  profile: ProfileModel;
  headingLevel?: "h2" | "h3";
}) {
  return (
    <div className="space-y-6">
      <p className="max-w-3xl text-lg text-pretty text-foreground">
        {profile.summary}
      </p>
      <div className="space-y-3">
        <MonoLabel as={headingLevel}>{profile.atuacao.title}</MonoLabel>
        <ul className="grid gap-3 md:grid-cols-2">
          {profile.atuacao.items.map((item) => (
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
