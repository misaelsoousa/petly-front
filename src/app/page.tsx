"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Hero from "@/components/Hero";
import PostsList from "@/components/PostsList";
import { petService } from "@/services/petService";
import { eventService } from "@/services/eventService";
import { reportService } from "@/services/reportService";
import type { Event, Pet, PetStatus } from "@/lib/types";
import { useAuth } from "@/providers/AuthProvider";

type StatusFilter = "ALL" | PetStatus;

const filterOptions: { label: string; value: StatusFilter }[] = [
  { label: "Todos", value: "ALL" },
  { label: "Disponíveis", value: "AVAILABLE" },
  { label: "Perdidos", value: "LOST" },
  { label: "Encontrados", value: "FOUND" },
  { label: "Adotados", value: "ADOPTED" },
];

export default function Home() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [reportText, setReportText] = useState("");
  const [reportFeedback, setReportFeedback] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchPets = useCallback(async () => {
    setLoading(true);
    try {
      const data = await petService.list();
      setPets(data);
      setError(null);
    } catch (err) {
      setError(
        (err as { message?: string })?.message ??
          "Não foi possível carregar os pets.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventService.list();
        setEvents(data.slice(0, 4));
        setEventsError(null);
      } catch (err) {
        setEventsError(
          (err as { message?: string })?.message ??
            "Não foi possível carregar os eventos.",
        );
      }
    };
    fetchEvents();
  }, []);

  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      const matchesSearch =
        pet.name.toLowerCase().includes(search.toLowerCase()) ||
        pet.species.toLowerCase().includes(search.toLowerCase()) ||
        pet.breed?.toLowerCase().includes(search.toLowerCase()) ||
        pet.owner?.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "ALL" ? true : pet.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [pets, search, statusFilter]);

  const stats = useMemo(
    () => ({
      totalPets: pets.length,
      available: pets.filter((pet) => pet.status === "AVAILABLE").length,
      adopted: pets.filter((pet) => pet.status === "ADOPTED").length,
    }),
    [pets],
  );

  const handleQuickReport = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!reportText.trim()) return;
    try {
      await reportService.create({ description: reportText }, token);
      setReportFeedback("Denúncia enviada!");
      setReportText("");
    } catch (err) {
      setReportFeedback(
        (err as { message?: string })?.message ??
          "Erro ao enviar denúncia. Tente novamente.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0f] flex flex-col text-white">
      <Hero
        searchValue={search}
        onSearchChange={setSearch}
        stats={stats}
      />
      <main className="flex-1 flex flex-col items-center px-4 pb-20 mt-7">
        <section className="w-full max-w-6xl -mt-16 relative z-20">
          <div className="rounded-3xl bg-[#121212] border border-white/5 p-5 flex flex-wrap gap-3 justify-between items-center shadow-2xl shadow-black/30">
            <div className="flex gap-2 flex-wrap">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setStatusFilter(option.value)}
                  className={`px-4 py-2 rounded-full text-sm transition border ${
                    statusFilter === option.value
                      ? "bg-orange-500 text-black border-orange-500 border-orange-500 text-white"
                      : "border-white/15 text-white/70 hover:border-orange-500/60 cursor-pointer"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </section>
        <PostsList
          pets={filteredPets}
          loading={loading}
          error={error}
          onRefresh={fetchPets}
        />

        <section id="eventos" className="w-full max-w-6xl mt-16 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">Eventos</h2>
          </div>
          {eventsError ? (
            <p className="text-sm text-red-400">{eventsError}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  className="rounded-2xl border border-white/10 p-5 bg-white/5 text-white"
                >
                  <p className="text-xs uppercase text-white/50">
                    {new Date(evt.date).toLocaleDateString()}
                  </p>
                  <h3 className="text-xl font-semibold">{evt.title}</h3>
                  <p className="text-white/70 text-sm line-clamp-3">{evt.description}</p>
                  <p className="text-white/60 text-xs mt-2">{evt.location}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section
          id="denuncias"
          className="w-full max-w-6xl mt-16 rounded-3xl border border-orange-500/40 bg-orange-500/10 p-6 text-white space-y-4"
        >
          <div>
            <h2 className="text-2xl font-semibold">Envie uma denúncia rápida</h2>
          </div>
          {reportFeedback && (
            <div className="text-sm text-white/80">{reportFeedback}</div>
          )}
          <form onSubmit={handleQuickReport} className="flex flex-col sm:flex-row gap-3">
            <textarea
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              placeholder="Descreva rapidamente o caso..."
              className="flex-1 px-4 py-3 rounded-2xl bg-white/20 border border-white/30 text-white focus:outline-none resize-none"
              rows={2}
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-white text-black font-semibold cursor-pointer"
            >
              Enviar
            </button>
          </form>
        </section>
      </main>
      <footer className="py-6 text-center text-white/40 text-sm">
        © {new Date().getFullYear()} Petly.
      </footer>
    </div>
  );
}
