"use client";

import React, { useState } from "react";
import { Logo } from "../../../public/icons";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";

type AuthMode = "login" | "register" | "forgot";

interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const initialState: FormState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function LoginPage() {
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [formData, setFormData] = useState<FormState>(initialState);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register } = useAuth();
  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetFeedback = () => setFeedback(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    resetFeedback();
    setIsSubmitting(true);
    try {
      if (authMode === "login") {
        await login(formData.email, formData.password);
        setFeedback({ type: "success", message: "Login efetuado!" });
        router.push("/");
      } else if (authMode === "register") {
        if (formData.password !== formData.confirmPassword) {
          setFeedback({ type: "error", message: "As senhas não conferem." });
          setIsSubmitting(false);
          return;
        }
        await register(formData.name, formData.email, formData.password);
        setFeedback({ type: "success", message: "Cadastro realizado! Você já está logado." });
        router.push("/");
      } else {
        setFeedback({
          type: "success",
          message: "Função em desenvolvimento. Em breve você poderá redefinir a senha no sistema.",
        });
        setIsSubmitting(false);
      }
    } catch (error) {
      const apiError = error as { message?: string; details?: { message?: string; field?: string; errors?: unknown } };
      // Prioriza a mensagem do backend, depois tenta extrair dos detalhes
      let errorMessage = apiError?.details?.message || apiError?.message || "Não foi possível autenticar. Verifique os dados.";
      
      setFeedback({
        type: "error",
        message: errorMessage,
      });
      setIsSubmitting(false);
    }
  };

  const renderInput = (
    label: string,
    name: keyof FormState,
    type = "text",
    placeholder?: string,
    required = true,
  ) => (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-white/70 mb-2"
      >
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        onFocus={resetFeedback}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] px-4 flex items-center justify-center">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 border border-white/5 rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
        <div className="relative hidden md:block bg-gradient-to-br from-orange-500/30 to-transparent p-10">
          <div className="absolute inset-0 bg-[url('/img/gato-com-crianca-meio.jpg')] opacity-30 bg-cover bg-center" />
          <div className="relative z-10 text-white space-y-6">
            <Logo className="h-14" />
            <h2 className="text-3xl font-bold">Equipe seus resgates com o Petly.</h2>
            <p className="text-white/70">
              A autenticação é processada pelo servidor.
              Faça login, registre uma nova conta ou acompanhe pedidos de adoção.
            </p>
            <ul className="space-y-3 text-white/80">
              <li>• Tokens JWT armazenados com segurança</li>
              <li>• Suporte a papéis como ADMIN, ONG e VET</li>
              <li>• Pronto para uso em ambiente de desenvolvimento</li>
            </ul>
          </div>
        </div>

        <div className="bg-[#111] p-8 sm:p-10 flex flex-col gap-6">
          <div className="flex items-center justify-between text-white">
            <div>
              <p className="text-sm uppercase tracking-wide text-white/60">
                Acesse o ecossistema Petly
              </p>
              <h1 className="text-2xl font-semibold mt-1">
                {authMode === "login" ? "Bem-vindo de volta" : authMode === "register" ? "Crie sua conta" : "Recuperar acesso"}
              </h1>
            </div>
            <Link href="/" className="text-sm text-white/60 hover:text-white">
              ← Voltar
            </Link>
          </div>

          <div className="flex bg-white/5 rounded-full p-1">
            {(["login", "register"] as AuthMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setAuthMode(mode)}
                className={`flex-1 py-2 text-sm rounded-full transition ${
                  authMode === mode
                    ? "bg-orange-500 text-black font-semibold"
                    : "text-white/60"
                }`}
              >
                {mode === "login" ? "Login" : "Cadastrar"}
              </button>
            ))}
            <button
              onClick={() => setAuthMode("forgot")}
              className={`flex-1 py-2 text-sm rounded-full transition ${
                authMode === "forgot"
                  ? "bg-white/10 text-white font-semibold"
                  : "text-white/60"
              }`}
            >
              Recuperar
            </button>
          </div>

          {feedback && (
            <div
              className={`rounded-2xl px-4 py-3 text-sm ${
                feedback.type === "success"
                  ? "bg-emerald-500/10 text-emerald-200 border border-emerald-500/30"
                  : "bg-red-500/10 text-red-200 border border-red-500/30"
              }`}
            >
              {feedback.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === "register" && renderInput("Nome completo", "name", "text", "Ex: Ana Silva")}
            {(authMode === "login" || authMode === "register" || authMode === "forgot") &&
              renderInput("Email", "email", "email", "seu@email.com")}
            {(authMode === "login" || authMode === "register") &&
              renderInput("Senha", "password", "password", "Min. 6 caracteres")}
            {authMode === "register" &&
              renderInput("Confirmar senha", "confirmPassword", "password")}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-2xl bg-orange-500 text-black font-semibold hover:bg-primary-dark transition disabled:opacity-60"
            >
              {isSubmitting ? "Enviando..." : "Continuar"}
            </button>
          </form>

          <p className="text-center text-white/60 text-xs">
            Ao continuar, você concorda com os termos de uso e política de privacidade da Petly.
          </p>
        </div>
      </div>
    </div>
  );
}

