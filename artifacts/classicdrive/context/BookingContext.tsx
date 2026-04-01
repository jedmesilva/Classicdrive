import React, { createContext, useContext, useState } from "react";

export type Modality = "transfer" | "exposicao" | "rota";

export type Duration = { label: string; hours: number };

export type Route = {
  id: number;
  name: string;
  duration: string;
  stops: number;
  distance: string;
  author: string;
};

type BookingState = {
  modality: Modality;
  when: string;
  from: string;
  to: string;
  location: string;
  duration: Duration | null;
  route: Route | null;
  setModality: (v: Modality) => void;
  setWhen: (v: string) => void;
  setFrom: (v: string) => void;
  setTo: (v: string) => void;
  setLocation: (v: string) => void;
  setDuration: (v: Duration | null) => void;
  setRoute: (v: Route | null) => void;
};

const BookingContext = createContext<BookingState | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [modality, setModality] = useState<Modality>("transfer");
  const [when, setWhen] = useState("Hoje, Agora");
  const [from, setFrom] = useState("Rua Havaí 350, Centro");
  const [to, setTo] = useState("");
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState<Duration | null>(null);
  const [route, setRoute] = useState<Route | null>(null);

  return (
    <BookingContext.Provider
      value={{
        modality, when, from, to, location, duration, route,
        setModality, setWhen, setFrom, setTo, setLocation, setDuration, setRoute,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
