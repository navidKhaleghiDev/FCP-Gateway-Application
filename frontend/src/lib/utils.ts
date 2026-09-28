import { clsx, type ClassValue } from "clsx"; import { twMerge } from "tailwind-merge";
export const cn=(...inputs:ClassValue[])=>twMerge(clsx(inputs));
export const relativeTime=(iso:string)=>{const seconds=Math.max(0,Math.floor((Date.now()-new Date(iso).getTime())/1000));if(seconds<5)return"just now";if(seconds<60)return`${seconds}s ago`;if(seconds<3600)return`${Math.floor(seconds/60)}m ago`;return`${Math.floor(seconds/3600)}h ago`;};
