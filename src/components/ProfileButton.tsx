"use client";

import { useAccount } from "wagmi";
const ProfileButton = () => {
  const { address } = useAccount();

  if (!address) return null;

  return (
    <a
      href={`/profile/${address}`}
      className="text-white text-xs border border-white/30 rounded px-2 py-1"
    >
      Profile
    </a>
  );
};

export default ProfileButton;
