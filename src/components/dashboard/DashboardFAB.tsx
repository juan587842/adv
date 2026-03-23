"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { NewCaseModal } from "@/components/modals/NewCaseModal";

export function DashboardFAB() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-2xl shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center z-40"
      >
        <Plus size={32} />
      </button>

      {isModalOpen && <NewCaseModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}
