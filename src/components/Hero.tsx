import SearchBar from "./SearchBar";
import { motion } from "framer-motion";

interface HeroProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  stats: {
    totalPets: number;
    available: number;
    adopted: number;
  };
}

const statLabels: Record<keyof HeroProps["stats"], string> = {
  totalPets: "Pets cadastrados",
  available: "Disponíveis",
  adopted: "Adotados",
};

export default function Hero({ searchValue, onSearchChange, stats }: HeroProps) {
  return (
    <section className="relative min-h-[600px] overflow-hidden bg-gradient-to-br from-[#0f0f0f] via-[#1d0f1f] to-[#1b1b1b]">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,122,41,0.35),_transparent_60%)]" />
        <img
          src="/img/gato-com-crianca-meio.jpg"
          alt="Pets felizes"
          className="w-full h-full object-cover mix-blend-overlay"
        />
      </div>

      {/* Inline SearchBar: place within hero content so it appears below the fixed Navbar */}

      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-28 md:pt-36 pb-16 flex flex-col gap-10">
        <div className="w-full">
          <div className="max-w-6xl mx-auto">
            <SearchBar value={searchValue} onChange={onSearchChange} />
          </div>
        </div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl space-y-6"
        >
          <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm w-fit">
            <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            Plataforma ativa em tempo real
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
            Conectamos pessoas, ONGs e{" "}
            <span className="text-orange-500">pets</span> em busca de um novo lar.
          </h1>
          <p className="text-lg text-white/70">
            Publique resgates, acompanhe pedidos de adoção e participe de eventos
            da comunidade.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#posts"
              className="px-6 py-3 rounded-full bg-orange-500 text-black font-semibold hover:bg-orange-500-dark transition bg-orange-500 text-white"
            >
              Explorar animais
            </a>
            <a
              href="/cadastrar-pet"
              className="px-6 py-3 rounded-full border border-white/30 text-white hover:border-orange-500 hover:text-orange-500 transition"
            >
              Publicar pet
            </a>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(Object.keys(stats) as Array<keyof HeroProps["stats"]>).map((key) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl bg-white/5 border border-white/10 p-5 text-white backdrop-blur"
            >
              <p className="text-sm uppercase tracking-wider text-white/60">
                {statLabels[key]}
              </p>
              <p className="text-3xl font-semibold mt-2">{stats[key]}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}