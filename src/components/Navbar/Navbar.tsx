import Link from "next/link";
import LogoPic from "@/components/Logo/LogoPic";

const Navbar = () => {
  return (
    <div className="flex justify-between bg-slate-600 p-8 ">
      <LogoPic width="250" />
      <Link href="/">Homepage</Link>
      <Link href="/add">Add</Link>
      <Link href="/edit">Edit</Link>
    </div>
  );
};

export default Navbar;
