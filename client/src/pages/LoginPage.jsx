import { useMutation } from "@tanstack/react-query";
import { EyeIcon, EyeOffIcon, LockIcon, UserIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { XSvg } from "../components/svgs/X";
import { Button } from "../components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../components/ui/input-group";
import { toast } from "../components/ui/toast";

const INITIAL_FORM_DATA = {
  username: "",
  password: "",
};

export function LoginPage() {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [showPassword, setShowPassword] = useState(false);

  const {
    mutate: login,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ username, password }) => {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
          credentials: "include",
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to login");
    },
    onSuccess: () => {
      setFormData(INITIAL_FORM_DATA);
      toast.add({
        type: "success",
        title: "Login",
        description: "Logged in successfully",
      });
    },
  });

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="max-w-7xl mx-auto flex h-screen px-10">
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <XSvg className="lg:w-2/3 fill-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form
          className="w-2xs sm:w-96 lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col"
          onSubmit={handleSubmit}
        >
          <XSvg className="w-24 lg:hidden fill-white" />
          <h1 className="text-4xl font-extrabold text-white">Let's go.</h1>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="username" className="sr-only">
                Username
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="username"
                  type="text"
                  name="username"
                  autoComplete="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                />
                <InputGroupAddon>
                  <UserIcon />
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <Field>
              <FieldLabel htmlFor="password" className="sr-only">
                Password
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <InputGroupAddon>
                  <LockIcon />
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    type="button"
                    size="icon-xs"
                    className="cursor-pointer"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <Field>
              <Button
                type="submit"
                disabled={isPending}
                className="cursor-pointer"
              >
                {isPending ? "Logging in..." : "Login"}
              </Button>
              {isError && <FieldError>{error.message}</FieldError>}
            </Field>
            <Field>
              <p className="text-white text-lg">Don't have an account?</p>
              <Button
                asChild
                type="button"
                variant={"outline"}
                className="cursor-pointer"
              >
                <Link to="/signup" className="w-full">
                  Sign in
                </Link>
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
