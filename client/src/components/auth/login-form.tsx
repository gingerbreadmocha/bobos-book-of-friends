import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useUser } from "@/context/user-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon, LoaderCircleIcon, LockIcon, MailIcon } from "lucide-react";

type LoginFormProps = {
  /** Called after a successful login (used to close the modal). */
  onSuccess: () => void;
};

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useUser();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        await login({ email: value.email, password: value.password });
        onSuccess();
      } catch (submitError) {
        setServerError(
          submitError instanceof Error
            ? submitError.message
            : "Something went wrong. Please try again.",
        );
      }
    },
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-col gap-4"
    >
      <form.Field
        name="email"
        validators={{
          onChange: ({ value }) =>
            !value ? "Email is required." : !value.includes("@") ? "Enter a valid email." : undefined,
        }}
      >
        {(field) => (
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Email
            <div className="relative">
              <MailIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="you@example.com"
                className="h-10 rounded-lg pr-3 pl-9 font-normal"
              />
            </div>
            {field.state.meta.errors.length > 0 && (
              <span role="alert" className="text-xs font-normal text-destructive">
                {field.state.meta.errors[0]}
              </span>
            )}
          </label>
        )}
      </form.Field>

      <form.Field
        name="password"
        validators={{
          onChange: ({ value }) => (!value ? "Password is required." : undefined),
        }}
      >
        {(field) => (
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Password
            <div className="relative">
              <LockIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="Enter your password"
                className="h-10 rounded-lg pr-10 pl-9 font-normal"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute top-1/2 right-1 size-8 -translate-y-1/2 rounded-full text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOffIcon className="size-4" />
                ) : (
                  <EyeIcon className="size-4" />
                )}
              </Button>
            </div>
            {field.state.meta.errors.length > 0 && (
              <span role="alert" className="text-xs font-normal text-destructive">
                {field.state.meta.errors[0]}
              </span>
            )}
          </label>
        )}
      </form.Field>

      <div className="flex items-center justify-between text-sm">
        <form.Field name="rememberMe">
          {(field) => (
            <label className="flex items-center gap-2 font-normal">
              <input
                type="checkbox"
                name={field.name}
                checked={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.checked)}
                className="size-4 rounded border-border accent-primary"
              />
              Remember me
            </label>
          )}
        </form.Field>
        {/* TODO: implement password reset flow. */}
        <Button type="button" variant="link" className="h-auto p-0 text-sm">
          Forgot password?
        </Button>
      </div>

      {serverError && (
        <p role="alert" className="text-sm text-destructive">
          {serverError}
        </p>
      )}

      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <Button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            size="lg"
            className="h-10 rounded-full"
          >
            {isSubmitting && <LoaderCircleIcon className="size-4 animate-spin" />}
            Log In
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
