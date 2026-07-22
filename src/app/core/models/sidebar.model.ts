export interface SidebarItem {
  label: string;
  icon: string;
  route?: string;
  action?: string;
  profiles?: string[];
  permissions?: string[];
}
