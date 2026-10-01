import { createContext, useContext, useState, type ReactNode } from 'react';

interface AlertsContextValue {
  alertsOpen: boolean;
  alertsOpenSession: number;
  openAlerts: () => void;
  closeAlerts: () => void;
}
const AlertsContext = createContext<AlertsContextValue | null>(null);

/** Owns alert panel visibility within the React tree. */
export function AlertsProvider({ children }: { children: ReactNode }) {
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [alertsOpenSession, setAlertsOpenSession] = useState(0);
  const openAlerts = () => {
    setAlertsOpen(true);
    setAlertsOpenSession((session) => session + 1);
  };
  const closeAlerts = () => setAlertsOpen(false);
  return (
    <AlertsContext.Provider value={{ alertsOpen, alertsOpenSession, openAlerts, closeAlerts }}>
      {children}
    </AlertsContext.Provider>
  );
}
export function useAlertsPanel() {
  const context = useContext(AlertsContext);
  if (!context) throw new Error('useAlertsPanel requires AlertsProvider');
  return context;
}
