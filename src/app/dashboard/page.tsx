"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth, useHasRole } from "@/providers/AuthProvider";
import { petService } from "@/services/petService";
import { adoptionService } from "@/services/adoptionService";
import { eventService } from "@/services/eventService";
import { reportService } from "@/services/reportService";
import { userService } from "@/services/userService";
import { statusLabel } from "@/lib/statusLabels";
import type {
  AdoptionRequest,
  Event,
  Pet,
  Report,
  RequestStatus,
  User,
} from "@/lib/types";

import { useRouter } from "next/navigation";

const tabs = [
  { id: "pets", label: "Meus pets" },
  { id: "adocoes", label: "Solicitações" },
  { id: "eventos", label: "Eventos" },
  { id: "denuncias", label: "Denúncias" },
  { id: "usuarios", label: "Usuários" },
] as const;

export default function DashboardPage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const isAdmin = useHasRole(["ADMIN"]);
  const isOng = useHasRole(["ONG", "ADMIN"]);
  const [activeTab, setActiveTab] =
    useState<(typeof tabs)[number]["id"]>("pets");

  const [pets, setPets] = useState<Pet[]>([]);
  const [adoptions, setAdoptions] = useState<AdoptionRequest[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [dashboardMessage, setDashboardMessage] = useState<string | null>(null);

  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
  });

  const [reportForm, setReportForm] = useState({
    description: "",
    photoUrl: "",
    videoUrl: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  const fetchPets = useCallback(async () => {
    try {
      const data = await petService.list();
      setPets(data);
    } catch (error) {
      setDashboardMessage(
        (error as { message?: string })?.message ??
          "Não foi possível carregar os pets.",
      );
    }
  }, []);

  const fetchAdoptions = useCallback(async () => {
    if (!token) return;
    try {
      const data = await adoptionService.list(token);
      setAdoptions(data);
    } catch (error) {
      setDashboardMessage(
        (error as { message?: string })?.message ??
          "Não foi possível carregar as solicitações.",
      );
    }
  }, [token]);

  const fetchEvents = useCallback(async () => {
    try {
      const data = await eventService.list();
      setEvents(data);
    } catch (error) {
      setDashboardMessage(
        (error as { message?: string })?.message ??
          "Não foi possível carregar os eventos.",
      );
    }
  }, []);

  const fetchReports = useCallback(async () => {
    if (!token) return;
    try {
      const data = await reportService.list(token);
      setReports(data);
    } catch (error) {
      setDashboardMessage(
        (error as { message?: string })?.message ??
          "Não foi possível carregar as denúncias.",
      );
    }
  }, [token]);

  const fetchUsers = useCallback(async () => {
    if (!token || !isAdmin) return;
    try {
      const data = await userService.getUsers(token);
      setUsers(data);
    } catch (error) {
      setDashboardMessage(
        (error as { message?: string })?.message ??
          "Não foi possível carregar usuários.",
      );
    }
  }, [token, isAdmin]);

  useEffect(() => {
    if (user) {
      fetchPets();
      fetchEvents();
      fetchAdoptions();
      fetchReports();
      fetchUsers();
    }
  }, [
    user,
    fetchPets,
    fetchEvents,
    fetchAdoptions,
    fetchReports,
    fetchUsers,
  ]);

  const myPets = useMemo(
    () => pets.filter((pet) => pet.ownerId === user?.id),
    [pets, user?.id],
  );

  const handlePetStatusChange = async (petId: number, status: Pet["status"]) => {
    if (!token) return;
    try {
      await petService.update(petId, { status }, token);
      setDashboardMessage("Status do pet atualizado!");
      fetchPets();
    } catch (error) {
      setDashboardMessage(
        (error as { message?: string })?.message ?? "Falha ao atualizar pet.",
      );
    }
  };

  const handlePetDelete = async (petId: number) => {
    if (!token) return;
    try {
      await petService.remove(petId, token);
      setDashboardMessage("Pet removido.");
      fetchPets();
    } catch (error) {
      setDashboardMessage(
        (error as { message?: string })?.message ?? "Falha ao remover pet.",
      );
    }
  };

  const handleAdoptionUpdate = async (
    requestId: number,
    status: RequestStatus,
  ) => {
    if (!token) return;
    try {
      await adoptionService.updateStatus(requestId, { status }, token);
      setDashboardMessage("Solicitação atualizada.");
      fetchAdoptions();
    } catch (error) {
      setDashboardMessage(
        (error as { message?: string })?.message ??
          "Falha ao atualizar solicitação.",
      );
    }
  };

  const handleEventCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) {
      setDashboardMessage("Faça login para criar eventos.");
      return;
    }
    try {
      await eventService.create(eventForm, token);
      setDashboardMessage("Evento enviado!");
      setEventForm({ title: "", description: "", date: "", location: "" });
      fetchEvents();
    } catch (error) {
      setDashboardMessage(
        (error as { message?: string })?.message ??
          "Falha ao criar evento.",
      );
    }
  };

  const handleEventApprove = async (eventId: number) => {
    if (!token) return;
    try {
      await eventService.approve(eventId, token);
      setDashboardMessage("Evento aprovado!");
      fetchEvents();
    } catch (error) {
      setDashboardMessage(
        (error as { message?: string })?.message ??
          "Falha ao aprovar evento.",
      );
    }
  };

  const handleReportCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await reportService.create(reportForm, token);
      setDashboardMessage("Denúncia enviada!");
      setReportForm({ description: "", photoUrl: "", videoUrl: "" });
      fetchReports();
    } catch (error) {
      setDashboardMessage(
        (error as { message?: string })?.message ??
          "Erro ao enviar denúncia.",
      );
    }
  };

  const renderPets = () => (
    <div className="space-y-4">
      {myPets.length === 0 ? (
        <p className="text-white/60 text-sm">
          Você ainda não cadastrou pets. Use a página principal para criar um.
        </p>
      ) : (
        myPets.map((pet) => (
          <div
            key={pet.id}
            className="rounded-2xl border border-white/10 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <h3 className="font-semibold text-white">{pet.name}</h3>
                <p className="text-white/60 text-sm">
                {pet.species} • Status: {statusLabel(pet.status)}
              </p>
            </div>
            <div className="flex gap-2">
              <select
                value={pet.status}
                onChange={(e) =>
                  handlePetStatusChange(pet.id, e.target.value as Pet["status"])
                }
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white"
              >
                <option value="AVAILABLE">Disponível</option>
                <option value="ADOPTED">Adotado</option>
                <option value="LOST">Perdido</option>
                <option value="FOUND">Encontrado</option>
              </select>
              <button
                onClick={() => handlePetDelete(pet.id)}
                className="px-3 py-2 rounded-xl bg-red-500/10 text-red-200 border border-red-500/30 text-xs"
              >
                Remover
              </button>
            </div>
.
          </div>
        ))
      )}
    </div>
  );

  const renderAdoptions = () => (
    <div className="space-y-3">
      {token ? (
        adoptions.length ? (
          adoptions.map((request) => (
            <div
              key={request.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-white/10 p-4 gap-3"
            >
              <div>
                <p className="text-white font-semibold">
                  Pet #{request.petId} • Usuário #{request.userId}
                </p>
                <p className="text-white/60 text-sm">
                  Status: {request.status}
                </p>
              </div>
              <div className="flex gap-2">
                {(["APPROVED", "REJECTED", "PENDING"] as RequestStatus[]).map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => handleAdoptionUpdate(request.id, status)}
                      className={`px-3 py-2 rounded-xl text-xs ${
                        request.status === status
                          ? "bg-orange-500 text-black"
                          : "bg-white/5 text-white/70"
                      }`}
                    >
                      {status}
                    </button>
                  ),
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-white/60 text-sm">
            Nenhuma solicitação disponível para o seu perfil.
          </p>
        )
      ) : (
        <p className="text-white/60 text-sm">
          Faça login para visualizar solicitações.
        </p>
      )}
    </div>
  );

  const renderEvents = () => (
    <div className="space-y-6">
      <form onSubmit={handleEventCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Título"
          value={eventForm.title}
          onChange={(e) =>
            setEventForm((prev) => ({ ...prev, title: e.target.value }))
          }
          className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white"
          required
        />
        <input
          type="text"
          placeholder="Local"
          value={eventForm.location}
          onChange={(e) =>
            setEventForm((prev) => ({ ...prev, location: e.target.value }))
          }
          className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white"
          required
        />
        <input
          type="date"
          value={eventForm.date}
          onChange={(e) =>
            setEventForm((prev) => ({ ...prev, date: e.target.value }))
          }
          className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white"
          required
        />
        <input
          type="text"
          placeholder="Descrição"
          value={eventForm.description}
          onChange={(e) =>
            setEventForm((prev) => ({ ...prev, description: e.target.value }))
          }
          className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white"
          required
        />
        <button
          type="submit"
          className="md:col-span-2 px-4 py-3 rounded-2xl bg-orange-500 text-black font-semibold"
        >
          Criar evento
        </button>
      </form>

      <div className="space-y-3">
        {events.map((event) => (
          <div
            key={event.id}
            className="rounded-2xl border border-white/10 p-4 flex flex-col gap-2 text-white"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{event.title}</h3>
              <span className="text-xs text-white/60">{event.status}</span>
            </div>
            <p className="text-white/70 text-sm">{event.description}</p>
            <p className="text-white/50 text-xs">
              {new Date(event.date).toLocaleDateString()} • {event.location}
            </p>
            {isAdmin && event.status !== "APPROVED" && (
              <button
                onClick={() => handleEventApprove(event.id)}
                className="self-start px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-200 text-xs border border-emerald-500/30"
              >
                Aprovar
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <form onSubmit={handleReportCreate} className="grid grid-cols-1 gap-4">
        <textarea
          placeholder="Descreva a denúncia"
          required
          value={reportForm.description}
          onChange={(e) =>
            setReportForm((prev) => ({ ...prev, description: e.target.value }))
          }
          className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white"
        />
        <input
          type="url"
          placeholder="Foto (URL)"
          value={reportForm.photoUrl}
          onChange={(e) =>
            setReportForm((prev) => ({ ...prev, photoUrl: e.target.value }))
          }
          className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white"
        />
        <input
          type="url"
          placeholder="Vídeo (URL)"
          value={reportForm.videoUrl}
          onChange={(e) =>
            setReportForm((prev) => ({ ...prev, videoUrl: e.target.value }))
          }
          className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white"
        />
        <button
          type="submit"
          className="px-4 py-3 rounded-2xl bg-orange-500 text-black font-semibold"
        >
          Enviar denúncia
        </button>
      </form>

      {reports.length > 0 && (
        <div className="space-y-3">
          {reports.map((report) => (
            <div
              key={report.id}
              className="rounded-2xl border border-white/10 p-4 text-white"
            >
              <p className="font-semibold text-sm">#{report.id}</p>
              <p className="text-white/70 text-sm">{report.description}</p>
              <p className="text-white/50 text-xs mt-1">Status: {report.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderUsers = () =>
    isAdmin ? (
      <div className="space-y-3">
        {users.map((userItem) => (
          <div
            key={userItem.id}
            className="rounded-2xl border border-white/10 p-4 flex items-center justify-between text-white"
          >
            <div>
              <p className="font-semibold">{userItem.name}</p>
              <p className="text-white/60 text-sm">{userItem.email}</p>
            </div>
            <span className="text-xs uppercase tracking-wide text-white/50">
              {userItem.role}
            </span>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-white/60 text-sm">
        Apenas administradores podem listar usuários.
      </p>
    );

  const renderContent = () => {
    switch (activeTab) {
      case "pets":
        return renderPets();
      case "adocoes":
        return renderAdoptions();
      case "eventos":
        return renderEvents();
      case "denuncias":
        return renderReports();
      case "usuarios":
        return renderUsers();
      default:
        return null;
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white px-4 py-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col gap-2 mt-10">
          <h1 className="text-3xl font-bold">Central Petly</h1>
        </header>

        {dashboardMessage && (
          <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm">
            {dashboardMessage}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm ${
                activeTab === tab.id
                  ? "bg-orange-500 text-black font-semibold"
                  : "bg-white/5 text-white/70"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <section className="rounded-3xl border border-white/10 p-6">
          {renderContent()}
        </section>
      </div>
    </div>
  );
}

