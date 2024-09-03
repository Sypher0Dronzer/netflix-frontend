import { useState } from "react";
import { Link } from "react-router-dom";
import { LogOut, Menu, Search, X } from "lucide-react";
import { useAuthStore } from "../../store/authUser";
import { useContentStore } from "../../store/content";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const { setContentType } = useContentStore();

  return (
    <header className="max-w-6xl mx-auto flex flex-wrap relative items-center justify-between p-4 h-20">
      <div className="flex items-center gap-10 z-50">
        <Link to="/">
          <img
            src="/netflix-logo.png"
            alt="Netflix Logo"
            className="w-32 sm:w-40"
          />
        </Link>

        {/* desktop navbar items */}
        <div className="hidden sm:flex gap-2 items-center">
          <Link
            to="/"
            className="hover:underline"
            onClick={() => setContentType("movie")}
          >
            Movies
          </Link>
          <Link
            to="/"
            className="hover:underline"
            onClick={() => setContentType("tv")}
          >
            Tv Shows
          </Link>
          <Link to="/history" className="hover:underline">
            Search History
          </Link>
        </div>
      </div>

      <div className="flex gap-2 items-center z-50">
        <Link to={"/search"}>
          <Search className="size-6 cursor-pointer" />
        </Link>
        <img
          src={user.image}
          alt="Avatar"
          className="h-8 rounded cursor-pointer"
        />
        <LogOut className="size-6 cursor-pointer" onClick={logout} />
        <div className="sm:hidden">
          {isMobileMenuOpen ? (
            <X className="size-6 cursor-pointer" onClick={toggleMobileMenu} />
          ) : (
            <Menu
              className="size-6 cursor-pointer"
              onClick={toggleMobileMenu}
            />
          )}
        </div>
      </div>

{/* Mobile nav items */}
      <div
        className={`sm:hidden absolute top-[90%] w-1/2 right-0 z-50 bg-black border rounded border-gray-600/50 border-t-0 text-right px-4 transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "max-h-screen opacity-100"
            : "max-h-0 border-0 overflow-hidden opacity-0"
        }`}
      >
        <Link
          to={"/"}
          className="block hover:underline py-2 boder-white mt-2"
          onClick={() => {
            toggleMobileMenu();
            setContentType("movie");
          }}
        >
          Movies
        </Link>
        <Link
          to={"/"}
          className="block hover:underline py-2"
          onClick={() => {
            toggleMobileMenu();
            setContentType("tv");
          }}
        >
          Tv Shows
        </Link>
        <Link
          to={"/history"}
          className="block hover:underline py-2 mb-2"
          onClick={toggleMobileMenu}
        >
          Search History
        </Link>
      </div>
    </header>
  );
};
export default Navbar;
