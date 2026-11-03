import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useUpdateProfile } from "../../hooks/useUpdateProfile";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export function EditProfileModal() {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const INITIAL_FORM_DATA = {
    fullName: authUser?.fullName ?? "",
    username: authUser?.username ?? "",
    email: authUser?.email ?? "",
    bio: authUser?.bio ?? "",
    link: authUser?.link ?? "",
    newPassword: "",
    currentPassword: "",
  };
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const { updateProfile, isUpdatingProfile, isSuccess } = useUpdateProfile();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData(INITIAL_FORM_DATA);
  }, [authUser]);

  function handleInputChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleUpdate = () => {
    updateProfile(formData);
    if (isSuccess) setFormData(INITIAL_FORM_DATA);
  };

  return (
    <Dialog>
      <DialogTrigger
        render={<Button className="cursor-pointer">Edit profile</Button>}
      />
      <DialogContent className="md:min-w-xl">
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
        </DialogHeader>
        <form>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-2">
              <Field>
                <FieldLabel htmlFor="fullName" className="sr-only">
                  Full Name
                </FieldLabel>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Full Name"
                  className="border border-gray-700 rounded p-2"
                  value={formData.fullName}
                  name="fullName"
                  onChange={handleInputChange}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="username" className="sr-only">
                  Username
                </FieldLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder="Username"
                  className="border border-gray-700 rounded p-2"
                  value={formData.username}
                  name="username"
                  onChange={handleInputChange}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Field>
                <FieldLabel htmlFor="email" className="sr-only">
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  className="border border-gray-700 rounded p-2"
                  value={formData.email}
                  name="email"
                  onChange={handleInputChange}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="link" className="sr-only">
                  Link
                </FieldLabel>
                <Input
                  id="link"
                  type="url"
                  placeholder="Link"
                  className="border border-gray-700 rounded p-2"
                  value={formData.link}
                  name="link"
                  onChange={handleInputChange}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Field>
                <FieldLabel htmlFor="currentPassword" className="sr-only">
                  Current Password
                </FieldLabel>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Current Password"
                  className="flex-1 border border-gray-700 rounded p-2 input-md"
                  value={formData.currentPassword}
                  name="currentPassword"
                  onChange={handleInputChange}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="newPassword" className="sr-only">
                  New Password
                </FieldLabel>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="New Password"
                  className="flex-1 input border border-gray-700 rounded p-2 input-md"
                  value={formData.newPassword}
                  name="newPassword"
                  onChange={handleInputChange}
                />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="bio" className="sr-only">
                Bio
              </FieldLabel>
              <Textarea
                id="bio"
                placeholder="Bio"
                className="border border-gray-700 rounded p-2"
                value={formData.bio}
                name="bio"
                onChange={handleInputChange}
              />
            </Field>
          </FieldGroup>
        </form>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Close</Button>} />
          <Button
            type="button"
            disabled={isUpdatingProfile}
            onClick={handleUpdate}
            className="cursor-pointer"
          >
            {isUpdatingProfile ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default EditProfileModal;
