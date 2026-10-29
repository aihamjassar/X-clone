import {
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
  PencilLineIcon,
  UserIcon,
} from "lucide-react";
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

const INITIAL_FORM_DATA = {
  fullName: "",
  username: "",
  email: "",
  password: "",
};

export function SignupPage() {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [showPassword, setShowPassword] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ formData });
    setFormData(INITIAL_FORM_DATA);
  };

  return (
    <div className="max-w-7xl mx-auto flex h-screen px-10">
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <XSvg className="lg:w-2/3 fill-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form
          className="w-2xs sm:w-96 lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col"
          onSubmit={handleSubmit}
        >
          <XSvg className="w-24 lg:hidden fill-white" />
          <h1 className="text-4xl font-extrabold text-white">Join today.</h1>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="fullName" className="sr-only">
                Full Name
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="fullName"
                  autoComplete="name"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
                <InputGroupAddon>
                  <PencilLineIcon />
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <Field>
              <FieldLabel htmlFor="username" className="sr-only">
                Username
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="username"
                  autoComplete="username"
                  name="username"
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
              <FieldLabel htmlFor="email" className="sr-only">
                Email
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="email"
                  autoComplete="email"
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                <InputGroupAddon>
                  <MailIcon />
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
                  autoComplete="new-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
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
                disabled={isSubmitting}
                className="cursor-pointer"
              >
                {isSubmitting ? "Signing up..." : "Sign up"}
              </Button>
              {isError && <FieldError>Something went wrong</FieldError>}
            </Field>
            <Field>
              <p className="text-white text-md">Already have an account?</p>
              <Button
                type="button"
                variant={"outline"}
                className="cursor-pointer"
                asChild
              >
                <Link to="/login" className="w-full">
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
