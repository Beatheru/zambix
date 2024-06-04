"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const Nav = () => {
  return (
    <nav className="sticky top-0 z-50 flex w-full items-center justify-end gap-3 border-b bg-background p-4">
      <Button onClick={() => signOut()}>Logout</Button>
    </nav>
  );
};

export default Nav;
