import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { appUsers } from "@/lib/mock-data";
import { useAuth, AuthProvider } from "@/lib/auth-context";
import { Sparkles, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in · JisrVOC" }] }),
  component: LoginPageWrapper,
});

function LoginPageWrapper() {
  return (
    <AuthProvider>
      <LoginPage />
    </AuthProvider>
  );
}

function LoginPage() {
  const { isAuthed, signIn } = useAuth();
  const navigate = useNavigate();

  if (isAuthed) return <Navigate to="/" />;

  const handleSso = (userId: string, _provider: string) => {
    signIn(userId);
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
            J
          </div>
          <div>
            <div className="text-lg font-semibold">JisrVOC</div>
            <div className="text-xs text-muted-foreground">Voice of Customer Intelligence</div>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Sign in to your workspace</CardTitle>
            <CardDescription className="text-xs">
              Internal tool. SSO only — backed by your corporate identity provider.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 h-10"
              onClick={() => handleSso(appUsers[0].id, "google")}
            >
              <GoogleMark />
              Continue with Google Workspace
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 h-10"
              onClick={() => handleSso(appUsers[3].id, "microsoft")}
            >
              <MicrosoftMark />
              Continue with Microsoft Entra ID
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 h-10"
              onClick={() => handleSso(appUsers[1].id, "saml")}
            >
              <ShieldCheck className="h-4 w-4" />
              SAML SSO (Okta)
            </Button>

            <Separator className="my-2" />

            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
                <Sparkles className="h-3 w-3" /> Demo personas — pick a role
              </div>
              <div className="grid grid-cols-2 gap-2">
                {appUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleSso(u.id, "demo")}
                    className="rounded-md border bg-background hover:bg-accent/40 transition-colors p-2.5 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[10px] font-semibold">
                        {u.initials}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-medium leading-tight truncate">{u.name}</div>
                        <div className="text-[10px] text-muted-foreground leading-tight">{u.role}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-[11px] text-muted-foreground">
          Prototype · session persists in localStorage only. Production will use OIDC + JWT.
        </p>
      </div>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.4-1.6 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.5 14.6 2.5 12 2.5 6.7 2.5 2.4 6.8 2.4 12.1S6.7 21.7 12 21.7c6.9 0 9.5-4.8 9.5-7.4 0-.5-.1-.9-.1-1.3H12z"/>
    </svg>
  );
}

function MicrosoftMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <rect width="10" height="10" x="2" y="2" fill="#F25022" />
      <rect width="10" height="10" x="12" y="2" fill="#7FBA00" />
      <rect width="10" height="10" x="2" y="12" fill="#00A4EF" />
      <rect width="10" height="10" x="12" y="12" fill="#FFB900" />
    </svg>
  );
}
