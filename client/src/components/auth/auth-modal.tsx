import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoginForm } from "./login-form";
import { SignUpForm } from "./signup-form";

type AuthMode = "login" | "signup";

type AuthModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Which tab is shown initially. */
  initialMode?: AuthMode;
};

export function AuthModal({ open, onOpenChange, initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);

  const isLogin = mode === "login";

  function switchMode(next: AuthMode) {
    setMode(next);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[calc(100vh-4rem)] gap-0 overflow-hidden rounded-2xl bg-popover p-0 sm:max-w-3xl">
        <DialogTitle className="sr-only">
          {isLogin ? "Log in to CatChat" : "Sign up for CatChat"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {isLogin
            ? "Log in with your email and password."
            : "Create an account with your email and password."}
        </DialogDescription>

        {/* Left: welcome / branding panel */}
        <aside className="hidden w-[45%] flex-col justify-between p-8 md:flex bg-violet-100">
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            {/* TODO: swap for the real cat illustration asset. */}
            <img src="auth/welcomebobo.png" alt="Create cat title" />

            <h2 className="font-heading text-2xl font-semibold text-foreground">
              Welcome to CatChat!
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Create an account to save your favorite cats, chat with them, and discover
              more furry friends!
            </p>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-2 border-t pt-6 text-center text-xs text-muted-foreground">
            <div>
              <p className="mb-1 text-base">💜</p>
              Save favorite cats
            </div>
            <div>
              <p className="mb-1 text-base">💬</p>
              Chat with AI cats
            </div>
            <div>
              <p className="mb-1 text-base">🐾</p>
              Build your cat collection
            </div>
          </div>
        </aside>

        {/* Right: auth forms panel */}
        <div className="flex w-full flex-col gap-5 p-6 md:w-[55%] md:p-8">
          {/* Log In / Sign Up tabs */}
          <div className="grid grid-cols-2 gap-1 rounded-full bg-secondary p-1" role="tablist">
            {(["login", "signup"] as const).map((tab) => (
              <Button
                key={tab}
                type="button"
                role="tab"
                aria-selected={mode === tab}
                onClick={() => switchMode(tab)}
                variant={mode === tab ? "default" : "ghost"}
                className={
                  mode === tab
                    ? "rounded-full"
                    : "rounded-full text-muted-foreground hover:text-foreground "
                }
              >
                {tab === "login" ? "Log In" : "Sign Up"}
              </Button>
            ))}
          </div>

          {isLogin ? (
            <LoginForm onSuccess={() => onOpenChange(false)} />
          ) : (
            <SignUpForm onSuccess={() => onOpenChange(false)} />
          )}

          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={() => switchMode(isLogin ? "signup" : "login")}
              className="h-auto p-0"
            >
              {isLogin ? "Sign up" : "Log in"}
            </Button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

