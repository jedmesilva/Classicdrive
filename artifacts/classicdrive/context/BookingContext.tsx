import React, { createContext, useContext, useState } from "react";

type BookingState = {
  when: string;
  from: string;
  to: string;
  setWhen: (v: string) => void;
  setFrom: (v: string) => void;
  setTo: (v: string) => void;
};

const BookingContext = createContext<BookingState | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [when, setWhen] = useState("Hoje, Agora");
  const [from, setFrom] = useState("Rua Havaí 350, Centro - ...");
  const [to, setTo] = useState("");

  return (
    <BookingContext.Provider value={{ when, from, to, setWhen, setFrom, setTo }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
