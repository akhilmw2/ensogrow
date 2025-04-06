"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSignIn } from "@clerk/nextjs";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { signIn, isLoaded } = useSignIn();
  const handleGoogleLogin = async () => {
    if (typeof signIn !== "object") {
      console.log("not object");
      return null;
    }
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/dashboard",
        redirectUrlComplete: "/dashboard",
      });
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };
  console.log({ isLoaded });
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-slate-50">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleLogin}
                  disabled={!isLoaded}
                >
                  Login with Google
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
