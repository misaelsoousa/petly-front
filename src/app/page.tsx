import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import PostsList from "../components/PostsList";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#212121] flex flex-col">
      <Hero/>
      <main className="flex-1 flex flex-col items-center px-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary mt-8 mb-2 text-center">Encontre, adote e ajude pets!</h1>
        <p className="text-gray-600 dark:text-gray-300 text-center max-w-2xl mb-6">
          Uma rede social para conectar pessoas e pets: encontre animais perdidos, adote um novo amigo ou ajude a encontrar lares para pets.
        </p>
        <PostsList />
      </main>
      <footer className="py-6 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} Petly.
      </footer>
    </div>
  );
}
