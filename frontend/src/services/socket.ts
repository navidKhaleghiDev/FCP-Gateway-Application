import { io, type Socket } from "socket.io-client"; import type { Alert, Device } from "@sentinel/shared"; import { toast } from "sonner"; import { deviceApi } from "@/lib/api"; import { useDeviceStore } from "@/stores/device-store";
let socket:Socket|null=null;
export function connectSocket(){if(socket)return()=>{};const store=useDeviceStore.getState();socket=io(import.meta.env.VITE_SOCKET_URL??"http://localhost:4000",{reconnection:true,reconnectionDelay:800,reconnectionDelayMax:5000});
socket.on("connect",async()=>{store.setConnection("connected");try{const[devices,alerts]=await Promise.all([deviceApi.list(),deviceApi.alerts()]);useDeviceStore.getState().hydrate(devices,alerts);}catch{toast.error("Live connection restored, but synchronization failed");}});
socket.io.on("reconnect_attempt",()=>useDeviceStore.getState().setConnection("reconnecting"));socket.on("disconnect",()=>useDeviceStore.getState().setConnection("offline"));
for(const event of ["device:updated","device:disconnected","device:connected"])socket.on(event,(d:Device)=>useDeviceStore.getState().upsertDevice(d));
socket.on("alert:created",(a:Alert)=>{useDeviceStore.getState().upsertAlert(a);toast[a.priority==="urgent"?"error":"warning"](a.message,{description:`${a.deviceId} · View on map`,action:{label:"View",onClick:()=>useDeviceStore.getState().select(a.deviceId)}});});socket.on("alert:resolved",(a:Alert)=>useDeviceStore.getState().upsertAlert(a));
return()=>{socket?.removeAllListeners();socket?.disconnect();socket=null;};}
