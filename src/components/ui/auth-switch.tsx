"use client";

import { useState, type ComponentProps } from "react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useGoogleOAuth, useLogin, useRegistration } from "@/hooks";
import { cn } from "@/lib/utils";
import { dashboardPathByRole } from "@/routes";
import type { UserRole } from "@/types";
import { loginValidationSchema, registerValidationSchema } from "@/validation";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function parseJwtRole(token: string): UserRole | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(""),
    );
    const parsed = JSON.parse(jsonPayload);
    return parsed.role ?? null;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Shared class strings                                                */
/* ------------------------------------------------------------------ */

const pillButton =
  "rounded-full font-semibold uppercase transition-all duration-500 ease-[ease] " +
  "hover:-translate-y-0.5 " +
  "hover:bg-[color-mix(in_oklch,var(--primary)_85%,black_15%)] " +
  "hover:shadow-[0_5px_15px_color-mix(in_oklch,var(--primary)_40%,transparent)]";

const solidButton = cn(pillButton, "my-2.5 h-[49px] w-[150px] text-[0.9rem]");

const ghostButton = cn(
  pillButton,
  "m-0 h-[41px] w-[130px] border-2 border-primary-foreground bg-transparent text-[0.8rem] text-primary-foreground",
  "hover:bg-[color-mix(in_oklch,var(--primary-foreground)_10%,transparent)]",
  "max-[870px]:h-[35px] max-[870px]:w-[110px] max-[870px]:text-[0.7rem]",
);

const fieldWrapper =
  "relative my-2.5 grid h-[55px] w-full max-w-[380px] grid-cols-[15%_85%] rounded-full bg-muted px-[0.4rem] " +
  "transition-all duration-300 ease-[ease] " +
  "focus-within:bg-[color-mix(in_oklch,var(--muted)_90%,var(--foreground)_10%)] " +
  "focus-within:ring-2 focus-within:ring-primary";

const fieldInput =
  "h-full w-full min-w-0 rounded-none border-0 bg-transparent p-0 text-base leading-none font-medium text-foreground shadow-none " +
  "placeholder:font-normal placeholder:text-muted-foreground " +
  "focus-visible:border-0 focus-visible:ring-0 md:text-base dark:bg-transparent";

const formLayout =
  "col-[1/2] row-[1/2] flex flex-col items-center justify-center overflow-hidden px-20 max-[570px]:px-6";

const panelBase =
  "z-6 flex flex-col items-end justify-around pt-12 pb-8 text-center " +
  "max-[870px]:col-[1/2] max-[870px]:flex-row max-[870px]:items-center max-[870px]:px-[8%] max-[870px]:py-10";

const panelContent =
  "auth-panel-content text-primary-foreground max-[870px]:pr-[15%] max-[570px]:px-4 max-[570px]:py-2";

const panelTitle =
  "mb-2.5 text-2xl leading-none font-semibold max-[870px]:text-xl";
const panelText =
  "py-[0.7rem] text-[0.95rem] max-[870px]:py-2 max-[870px]:text-[0.7rem]";

const demoAccounts: { label: string; email: string; password: string }[] = [
  { label: "Admin", email: "admin@citysense.com", password: "Admin@123" },
  {
    label: "Resolver",
    email: "resolver@citysense.com",
    password: "Resolver@123",
  },
  { label: "User", email: "citizen@citysense.com", password: "Citizen@123" },
];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function AuthSwitch() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const googleClientId = process.env.GOOGLE_CLIENT_ID;

  const { mutate: login, isPending: loginPending } = useLogin();
  const { mutate: registration, isPending: registrationPending } =
    useRegistration();
  const { mutate: googleOAuth, isPending: googlePending } = useGoogleOAuth();

  const handleAuthSuccess = (accessToken: string, defaultPath: string) => {
    const role = parseJwtRole(accessToken);
    const targetPath = (role && dashboardPathByRole[role]) || defaultPath;
    router.push(targetPath);
  };

  const handleGoogleSuccess = (idToken: string) => {
    googleOAuth(
      { idToken },
      {
        onSuccess: (res) => {
          toast.add({
            title: "Logged in Successfully",
            description: "Welcome back",
            type: "success",
          });
          const token =
            res?.data?.accessToken ??
            (res as unknown as { accessToken: string }).accessToken;
          if (token) {
            handleAuthSuccess(token, "/dashboard");
          } else {
            router.push("/dashboard");
          }
        },
        onError: (err) => {
          toast.add({
            title: "Google OAuth Failed",
            description:
              err.message || "Something went wrong. Please try again",
            type: "error",
          });
        },
      },
    );
  };

  const triggerGoogleAuth = useGoogleLogin({
    onSuccess: (credentialResponse) => {
      const idToken =
        (
          credentialResponse as unknown as {
            id_token?: string;
            credential?: string;
          }
        ).id_token ??
        (credentialResponse as unknown as { credential?: string }).credential;
      if (idToken) {
        handleGoogleSuccess(idToken);
      } else {
        toast.add({
          title: "Google OAuth Failed",
          description: "Missing ID token from Google",
          type: "error",
        });
      }
    },
    onError: () => {
      toast.add({
        title: "Google OAuth Failed",
        description: "Google sign in was unsuccessful. Please try again",
        type: "error",
      });
    },
  });

  const loginForm = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginValidationSchema,
    },
    onSubmit: ({ value }) => {
      login(
        {
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: (res) => {
            toast.add({
              title: "Login Success",
              description: "Welcome back",
              type: "success",
            });
            const token =
              res?.data?.accessToken ??
              (res as unknown as { accessToken: string }).accessToken;
            if (token) {
              handleAuthSuccess(token, "/dashboard");
            } else {
              router.push("/dashboard");
            }
          },
          onError: (err) => {
            toast.add({
              title: "Authorization failure",
              description:
                err.message || "Invalid credentials. Please try again.",
              type: "error",
            });
          },
        },
      );
    },
  });

  const registerForm = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: registerValidationSchema,
    },
    onSubmit: ({ value }) => {
      registration(
        {
          name: value.name,
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: () => {
            toast.add({
              title: "Registration Successful",
              description: "Your account has been created successfully.",
              type: "success",
            });
            router.push("/");
          },
          onError: (err) => {
            toast.add({
              title: "Registration failure",
              description:
                err.message || "Something went wrong. Please try again",
              type: "error",
            });
          },
        },
      );
    },
  });

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-linear-135 from-primary to-secondary p-5 font-sans">
      {/*
        Animation-coupled rules stay as custom CSS: the sliding circle, the
        form cross-fade/slide, and the panel content slide-ins. Colors still
        come from theme variables.
      */}
      <style>{`
        .auth-container::before {
          content: "";
          position: absolute;
          height: 2000px;
          width: 2000px;
          top: -10%;
          right: 48%;
          transform: translateY(-50%);
          background: linear-gradient(-45deg, var(--primary) 0%, var(--secondary) 100%);
          transition: 1.8s ease-in-out;
          border-radius: 50%;
          z-index: 6;
        }

        .auth-container[data-mode="signup"]::before {
          transform: translate(100%, -50%);
          right: 52%;
        }

        .auth-forms {
          position: absolute;
          top: 50%;
          left: 75%;
          width: 50%;
          transform: translate(-50%, -50%);
          transition: 1s 0.7s ease-in-out;
        }

        .auth-container[data-mode="signup"] .auth-forms {
          left: 25%;
        }

        .auth-form {
          transition: all 0.2s 0.7s;
        }

        .auth-form-signin {
          z-index: 2;
        }

        .auth-form-signup {
          opacity: 0;
          z-index: 1;
        }

        .auth-container[data-mode="signup"] .auth-form-signup {
          opacity: 1;
          z-index: 2;
        }

        .auth-container[data-mode="signup"] .auth-form-signin {
          opacity: 0;
          z-index: 1;
        }

        .auth-panel-content {
          transition: transform 0.9s ease-in-out 0.6s;
        }

        .auth-panel-right .auth-panel-content {
          transform: translateX(800px);
        }

        .auth-container[data-mode="signup"] .auth-panel-left .auth-panel-content {
          transform: translateX(-800px);
        }

        .auth-container[data-mode="signup"] .auth-panel-right .auth-panel-content {
          transform: translateX(0%);
        }

        @media (max-width: 870px) {
          .auth-container::before {
            width: 1500px;
            height: 1500px;
            transform: translateX(-50%);
            left: 30%;
            bottom: 68%;
            right: initial;
            top: initial;
            transition: 2s ease-in-out;
          }

          .auth-container[data-mode="signup"]::before {
            transform: translate(-50%, 100%);
            bottom: 32%;
            right: initial;
          }

          .auth-forms {
            width: 100%;
            top: 95%;
            transform: translate(-50%, -100%);
            transition: 1s 0.8s ease-in-out;
          }

          .auth-forms,
          .auth-container[data-mode="signup"] .auth-forms {
            left: 50%;
          }

          .auth-container[data-mode="signup"] .auth-forms {
            top: 5%;
            transform: translate(-50%, 0);
          }

          .auth-panel-content {
            transition: transform 0.9s ease-in-out 0.8s;
          }

          .auth-panel-right .auth-panel-content {
            transform: translateY(300px);
          }

          .auth-container[data-mode="signup"] .auth-panel-left .auth-panel-content {
            transform: translateY(-300px);
          }

          .auth-container[data-mode="signup"] .auth-panel-right .auth-panel-content {
            transform: translateY(0px);
          }
        }
      `}</style>

      <div
        data-mode={isSignUp ? "signup" : "signin"}
        className={cn(
          "auth-container group relative h-[550px] w-full max-w-[900px] overflow-hidden bg-card",
          "rounded-[calc(var(--radius)*2)] shadow-[0_25px_50px_rgba(0,0,0,0.2)]",
          "max-[870px]:h-screen max-[870px]:min-h-[800px]",
        )}
      >
        <div className="absolute inset-0">
          <div className="auth-forms z-5 grid grid-cols-1">
            <form
              className={cn("auth-form auth-form-signin", formLayout)}
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                loginForm.handleSubmit();
              }}
            >
              <h2 className="mb-2.5 text-[2.2rem] font-bold text-foreground">
                Sign in
              </h2>
              <loginForm.Field name="email">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <AuthField
                      icon=" "
                      type="email"
                      placeholder="Email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="email"
                    />
                  );
                }}
              </loginForm.Field>
              <loginForm.Field name="password">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <AuthField
                      icon=" "
                      type="password"
                      placeholder="Password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="current-password"
                    />
                  );
                }}
              </loginForm.Field>
              <Button
                type="submit"
                disabled={loginPending}
                className={solidButton}
              >
                {loginPending ? (
                  <>
                    <Spinner className="mr-2" /> Loading...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
              <div className="my-2 w-full max-w-95">
                <p className="mb-2 text-center text-sm text-muted-foreground">
                  Demo login
                </p>
                <div className="flex justify-center gap-2">
                  {demoAccounts.map((account) => (
                    <Button
                      key={account.label}
                      type="button"
                      variant="outline"
                      disabled={
                        loginPending || !account.email || !account.password
                      }
                      className="h-9 flex-1 rounded-full text-xs"
                      onClick={() => {
                        loginForm.setFieldValue("email", account.email);
                        loginForm.setFieldValue("password", account.password);
                        loginForm.handleSubmit();
                      }}
                    >
                      {account.label}
                    </Button>
                  ))}
                </div>
              </div>
              {googleClientId && (
                <>
                  <p className="py-[0.7rem] text-base text-muted-foreground">
                    Or sign in with Google
                  </p>
                  <div className="flex justify-center gap-[15px]">
                    <SocialIcons onGoogleClick={() => triggerGoogleAuth()} />
                  </div>
                </>
              )}
            </form>

            <form
              className={cn("auth-form auth-form-signup", formLayout)}
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                registerForm.handleSubmit();
              }}
            >
              <h2 className="mb-2.5 text-[2.2rem] font-bold text-foreground">
                Sign up
              </h2>
              <registerForm.Field name="name">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <AuthField
                      icon=" "
                      type="text"
                      placeholder="Username"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="name"
                    />
                  );
                }}
              </registerForm.Field>
              <registerForm.Field name="email">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <AuthField
                      icon=" "
                      type="email"
                      placeholder="Email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="email"
                    />
                  );
                }}
              </registerForm.Field>
              <registerForm.Field name="password">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <AuthField
                      icon=" "
                      type="password"
                      placeholder="Password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="new-password"
                    />
                  );
                }}
              </registerForm.Field>
              <registerForm.Field name="confirmPassword">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <AuthField
                      icon=" "
                      type="password"
                      placeholder="Confirm Password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="new-password"
                    />
                  );
                }}
              </registerForm.Field>
              <Button
                type="submit"
                disabled={registrationPending}
                className={solidButton}
              >
                {registrationPending ? (
                  <>
                    <Spinner className="mr-2" /> Loading...
                  </>
                ) : (
                  "Sign up"
                )}
              </Button>
              {googleClientId && (
                <>
                  <p className="py-[0.7rem] text-base text-muted-foreground">
                    Or sign up with Google
                  </p>
                  <div className="flex justify-center gap-[15px]">
                    <SocialIcons onGoogleClick={() => triggerGoogleAuth()} />
                  </div>
                </>
              )}
            </form>
          </div>
        </div>

        <div className="absolute inset-0 grid grid-cols-2 max-[870px]:grid-cols-1 max-[870px]:grid-rows-[1fr_2fr_1fr]">
          <div
            className={cn(
              "auth-panel-left pointer-events-auto group-data-[mode=signup]:pointer-events-none",
              panelBase,
              "pr-[17%] pl-[12%] max-[870px]:row-[1/2]",
            )}
          >
            <div className={panelContent}>
              <h3 className={panelTitle}>New here?</h3>
              <p className={panelText}>
                Join us today and discover a world of possibilities. Create your
                account in seconds!
              </p>
              <Button
                type="button"
                className={ghostButton}
                onClick={() => setIsSignUp(true)}
              >
                Sign up
              </Button>
            </div>
          </div>

          <div
            className={cn(
              "auth-panel-right pointer-events-none group-data-[mode=signup]:pointer-events-auto",
              panelBase,
              "pr-[12%] pl-[17%] max-[870px]:row-[3/4]",
            )}
          >
            <div className={panelContent}>
              <h3 className={panelTitle}>One of us?</h3>
              <p className={panelText}>
                Welcome back! Sign in to continue your journey with us.
              </p>
              <Button
                type="button"
                className={ghostButton}
                onClick={() => setIsSignUp(false)}
              >
                Sign in
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                      */
/* ------------------------------------------------------------------ */

function AuthField({
  icon,
  ...props
}: ComponentProps<typeof Input> & { icon?: string }) {
  return (
    <div className={fieldWrapper}>
      {icon && (
        <i className="text-center text-[1.1rem] leading-[55px] text-muted-foreground transition-all duration-500">
          {icon}
        </i>
      )}
      <Input className={fieldInput} {...props} />
    </div>
  );
}

const socialIcon =
  "flex size-[46px] cursor-pointer items-center justify-center rounded-full border border-border text-[1.2rem] text-primary " +
  "transition-all duration-300 ease-[ease] " +
  "hover:-translate-y-[3px] hover:border-secondary hover:shadow-[0_5px_15px_rgba(0,0,0,0.1)]";

function SocialIcons({ onGoogleClick }: { onGoogleClick?: () => void }) {
  return (
    <>
      <button
        type="button"
        onClick={onGoogleClick}
        aria-label="Continue with Google"
        className={socialIcon}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          role="img"
          aria-label="Google"
        >
          <title>Google</title>
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
      </button>
    </>
  );
}
