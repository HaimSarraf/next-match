import { Button, Navbar, NavbarBrand, NavbarContent } from "@nextui-org/react";
import Link from "next/link";
import { GiMatchTip } from "react-icons/gi";
import NavLink from "./NavLink";
import { auth } from "@/auth";
import UserMenu from "./UserMenu";

const TopNav = async () => {
  const session = await auth();

  return (
    <Navbar
      maxWidth="2xl"
      className="bg-gradient-to-r from-orange-200 to-red-800"
      classNames={{
        item: [
          "text-l",
          "text-white",
          "uppercase",
          "data-[active=true]:bg-yellow-400",
          "data-[active=true]:rounded",
          "data-[active=true]:text-slate-600",
          "data-[active=true]:font-bold",
          "data-[active=true]:p-1",
        ],
      }}
    >
      <NavbarBrand as={Link} href="/">
        <GiMatchTip size={40} className="text-red-700" />
        <div className="font-bold text-3xl flex">
          <span className="text-gray-400">Next</span>
          <span className="text-red-900">Match</span>
        </div>
      </NavbarBrand>
      <NavbarContent justify="center">
        <NavLink href="/members" label="Members" />
        <NavLink href="/lists" label="Lists" />
        <NavLink href="/messages" label="Messages" />
      </NavbarContent>
      <NavbarContent justify="end">
        {session?.user ? (
          <UserMenu user={session.user} />
        ) : (
          <>
            <Button
              as={Link}
              href="/login"
              variant="bordered"
              className="text-white"
            >
              Login
            </Button>
            <Button
              as={Link}
              href="/register"
              variant="bordered"
              className="text-white"
            >
              Register
            </Button>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
};

export default TopNav;
