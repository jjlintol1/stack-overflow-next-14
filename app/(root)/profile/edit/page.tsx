import ProfileForm from "@/components/forms/ProfileForm";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

const EditProfilePage = async () => {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const mongoUser = await getUserById({ userId });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>
      <div className="mt-9">
        <ProfileForm
          clerkId={userId}
          profileDetails={JSON.stringify(mongoUser)}
        />
      </div>
    </>
  );
};

export default EditProfilePage;
