import { useRef } from 'react';
import useWebSocket from 'react-use-websocket';
import { SERVICE_CONFIG } from '@/services/config';
import { invalidateLiveQueries } from '@/services/queryClient';
import { handleSocketMessage } from '@/services/socket';
import { useDeviceStore } from '@/stores/deviceStore';

/** Keeps one application-wide WebSocket subscription and resynchronizes REST state on reconnect. */
export function useSocketEvent() {
  const hasConnected = useRef(false);

  useWebSocket(SERVICE_CONFIG.socketUrl, {
    share: true,
    shouldReconnect: () => true,
    reconnectAttempts: SERVICE_CONFIG.socketReconnectAttempts,
    reconnectInterval: (attempt) =>
      Math.min(
        SERVICE_CONFIG.socketReconnectBaseMs * 2 ** attempt,
        SERVICE_CONFIG.socketReconnectMaxMs
      ),
    retryOnError: true,
    onOpen: () => {
      useDeviceStore.getState().setConnection('connected');
      if (hasConnected.current) invalidateLiveQueries();
      hasConnected.current = true;
    },
    onClose: () => useDeviceStore.getState().setConnection('reconnecting'),
    onError: () => useDeviceStore.getState().setConnection('reconnecting'),
    onMessage: (event) => handleSocketMessage(event.data),
  });
}
