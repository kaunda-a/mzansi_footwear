"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IconLoader2, IconBrandGoogle } from "@tabler/icons-react";
import Link from "next/link";

export function SignUpForm() {
  const [error, setError] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    setError("");

    try {
      const result = await signIn("google", {
        callbackUrl,
        redirect: false,
      });

      if (result?.error) {
        setError("Failed to sign in with Google. Please try again.");
      } else if (result?.url) {
        router.push(result.url);
      } else {
        // Check if sign in was successful
        const session = await getSession();
        if (session) {
          router.push(callbackUrl);
          router.refresh();
        }
      }
    } catch (error) {
      setError("An error occurred with Google sign in. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Create Account
          </CardTitle>
          <CardDescription className="text-center">
            Join Mzansi Footwear and discover premium South African footwear
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Google Sign In Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignUp}
            disabled={isGoogleLoading}
          >
            {isGoogleLoading ? (
              <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <IconBrandGoogle className="mr-2 h-4 w-4" />
            )}
            Continue with Google
          </Button>

          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            <Link href="/" className="hover:underline">
              ← Back to store
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
