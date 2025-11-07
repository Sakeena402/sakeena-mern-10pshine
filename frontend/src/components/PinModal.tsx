// components/PinModal.tsx
import React, { useState } from "react";

interface PinModalProps {
  title?: string;
  open: boolean;
  onClose: () => void;
  onSubmit: (pin: string) => void;
  mode: "enter" | "set"; // enter = unlock, set = lock/set PIN
}

export default function PinModal({ open, onClose, onSubmit, title, mode }: PinModalProps) {
  const [pin, setPin] = useState("");

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold mb-3">{title || (mode === "set" ? "Set PIN" : "Enter PIN")}</h3>
        <p className="text-sm text-gray-600 mb-4">
          {mode === "set" ? "Choose a 4-digit PIN to lock this note." : "Enter the 4-digit PIN to unlock."}
        </p>

        <input
          type="password"
          value={pin}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, "").slice(0, 4);
            setPin(v);
          }}
          className="w-full border px-3 py-2 rounded mb-4 text-xl tracking-wider"
          placeholder="••••"
        />

        <div className="flex justify-end gap-3">
          <button onClick={() => { setPin(""); onClose(); }} className="px-4 py-2 rounded border">Cancel</button>
          <button
            onClick={() => {
              if (pin.length !== 4) return alert("PIN must be 4 digits");
              onSubmit(pin);
              setPin("");
            }}
            className="px-4 py-2 rounded bg-amber-600 text-white"
          >
            {mode === "set" ? "Set PIN" : "Unlock"}
          </button>
        </div>
      </div>
    </div>
  );
}
