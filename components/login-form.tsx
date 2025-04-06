"use client";
import { cn, setCookie } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export function LoginForm({ className, ...props }: any) {
  const { signInWithGoogle } = useAuth();
  const router = useRouter();
  const handleSignIn = async () => {
    try {
      const { idToken } = await signInWithGoogle();
      console.log("Successfully signed in. ID Token:", idToken);
      setCookie("accessToken", idToken);
      router.push("/landing");
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-slate-50">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleSignIn}
              >
                Login with Google
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
