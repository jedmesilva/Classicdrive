import React, { createContext, useContext, useState } from "react";

export type PaymentMethod = {
  id: string;
  label: string;
  detail: string;
  icon: string;
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "cc1", label: "Mastercard", detail: "•••• 4521", icon: "💳" },
  { id: "cc2", label: "Visa",       detail: "•••• 8834", icon: "💳" },
  { id: "pix", label: "Pix",        detail: "Chave CPF", icon: "⚡" },
];

export type Modality = "rotalivre" | "exposicao" | "rota";

export type Duration = { label: string; hours: number };

export type RouteCoordinate = {
  latitude: number;
  longitude: number;
};

export type Route = {
  id: number;
  name: string;
  duration: string;
  stops: number;
  distance: string;
  author: string;
  coordinates: RouteCoordinate[];
  stopNames: string[];
};

export type Waypoint = {
  id: string;
  address: string;
  minutes: number;
};

type BookingState = {
  modality: Modality;
  when: string;
  from: string;
  to: string;
  location: string;
  duration: Duration | null;
  route: Route | null;
  waypoints: Waypoint[];
  activeVehicleIndex: number;
  payment: PaymentMethod;
  setModality: (v: Modality) => void;
  setWhen: (v: string) => void;
  setFrom: (v: string) => void;
  setTo: (v: string) => void;
  setLocation: (v: string) => void;
  setDuration: (v: Duration | null) => void;
  setRoute: (v: Route | null) => void;
  setWaypoints: (v: Waypoint[]) => void;
  setWaypointAddress: (id: string, address: string) => void;
  setActiveVehicleIndex: (v: number) => void;
  setPayment: (v: PaymentMethod) => void;
};

const BookingContext = createContext<BookingState | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [modality, setModality] = useState<Modality>("rotalivre");
  const [when, setWhen] = useState("Hoje, Agora");
  const [from, setFrom] = useState("Rua Havaí 350, Centro");
  const [to, setTo] = useState("");
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState<Duration | null>(null);
  const [route, setRoute] = useState<Route | null>(null);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [activeVehicleIndex, setActiveVehicleIndex] = useState(0);
  const [payment, setPayment] = useState<PaymentMethod>(PAYMENT_METHODS[0]);

  function setWaypointAddress(id: string, address: string) {
    setWaypoints(ws => ws.map(w => w.id === id ? { ...w, address } : w));
  }

  return (
    <BookingContext.Provider
      value={{
        modality, when, from, to, location, duration, route, waypoints,
        activeVehicleIndex, payment,
        setModality, setWhen, setFrom, setTo, setLocation, setDuration, setRoute,
        setWaypoints, setWaypointAddress, setActiveVehicleIndex, setPayment,
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
