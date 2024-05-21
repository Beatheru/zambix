"use client";

import { faTicket } from "@fortawesome/free-solid-svg-icons";
import { faHome } from "@fortawesome/free-solid-svg-icons/faHome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const Nav = () => {
  return (
    <nav className="sticky top-0 z-50 flex w-full items-center gap-3 border-b bg-background p-4">
      <Link href="/">
        <Button className="flex gap-2">
          <FontAwesomeIcon icon={faHome} className="icon" />
          <div>Home</div>
        </Button>
      </Link>

      <Button className="fixed right-4" onClick={() => signOut()}>
        Logout
      </Button>
    </nav>
  );
};

export default Nav;
