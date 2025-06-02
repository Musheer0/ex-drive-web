import { Home, Search, Share2, UploadIcon } from "lucide-react";
import type { LucideIcon } from "lucide-react"; // for type safety

type SidebarLink = {
  label: string;
  path: string;
  icon: LucideIcon;
};

export const sidebarLinks: SidebarLink[] = [
  {
    label: "Home",
    path: "/dashboard",
    icon: Home,
  },
  {
    label: "Search",
    path: "/search",
    icon: Search,
  },
  {
    label: "Shared",
    path: "/shared",
    icon: Share2,
  },
  {
    label: "Upload",
    path: "/upload",
    icon: UploadIcon,
  },
];
