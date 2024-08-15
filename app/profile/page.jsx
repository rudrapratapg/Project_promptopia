"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Profile from "@components/Profile";

const MyProfile = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [myPosts, setMyPosts] = useState([]);

  useEffect(() => {
    // Check if the session is loading
    if (status === "loading") return;

    // Redirect to home page if not authenticated
    if (!session) {
      router.push('/');
      return;
    }

    // Fetch posts if authenticated
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${session.user.id}/posts`);
      const data = await response.json();
      setMyPosts(data);
    };

    if (session?.user?.id) fetchPosts();
  }, [session, status, router]);

  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  };

  const handleDelete = async (post) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this prompt?"
    );

    if (hasConfirmed) {
      try {
        await fetch(`/api/prompt/${post._id.toString()}`, {
          method: "DELETE",
        });

        const filteredPosts = myPosts.filter((item) => item._id !== post._id);
        setMyPosts(filteredPosts);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Optionally return a loading indicator while redirecting
  if (status === "loading" || !session) {
    return <div>Loading...</div>; // or any other loading indicator
  }

  return (
    <Profile
      name='My'
      desc='Welcome to your personalized profile page. Share your exceptional prompts and inspire others with the power of your imagination'
      data={myPosts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default MyProfile;
