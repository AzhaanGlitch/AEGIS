"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Role = "Founder" | "Sales Mgr" | "Marketing Mgr" | "HR" | "Finance" | "Support" | "Admin";

interface User {
  email: string;
  role: Role;
  organization: string;
}

interface AppContextType {
  user: User | null;
  login: (email: string, role: Role) => void;
  logout: () => void;
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  documents: Array<{ id: string; name: string; size: string; status: string; progress: number }>;
  addDocument: (name: string, size: string) => void;
  updateDocStatus: (id: string, status: string, progress: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [currentRole, setCurrentRole] = useState<Role>("Founder");
  const [currentTab, setCurrentTab] = useState<string>("dashboard");
  const [documents, setDocuments] = useState<any[]>([
    { id: "1", name: "AEGIS_PRD.md", size: "2.1 KB", status: "Indexed", progress: 100 },
    { id: "2", name: "AEGIS_AppFlow.pdf", size: "538 KB", status: "Indexed", progress: 100 },
    { id: "3", name: "AEGIS_TRD.pdf", size: "511 KB", status: "Indexed", progress: 100 }
  ]);

  // Load from local storage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("aegis_user");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      setCurrentRole(parsed.role);
    }
  }, []);

  const login = (email: string, role: Role) => {
    const newUser = { email, role, organization: "Acme Enterprise Corp" };
    setUser(newUser);
    setCurrentRole(role);
    localStorage.setItem("aegis_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("aegis_user");
  };

  const addDocument = (name: string, size: string) => {
    const newDoc = {
      id: Math.random().toString(),
      name,
      size,
      status: "Uploading...",
      progress: 10
    };
    setDocuments(prev => [newDoc, ...prev]);
    return newDoc.id;
  };

  const updateDocStatus = (id: string, status: string, progress: number) => {
    setDocuments(prev =>
      prev.map(doc => (doc.id === id ? { ...doc, status, progress } : doc))
    );
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        currentRole,
        setCurrentRole,
        currentTab,
        setCurrentTab,
        documents,
        addDocument,
        updateDocStatus
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
