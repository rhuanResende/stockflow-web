import { Injectable } from '@angular/core';
import { SidebarItem } from '../models/sidebar.model';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private readonly MENU_ITEMS: SidebarItem[] = [
    {
      label: 'Home',
      icon: 'fa-solid fa-house',
      route: '/pages/home',
    },
    {
      label: 'Empresas',
      icon: 'fa-solid fa-building',
      route: '/pages/companies',
    },
    /*
    {
      label: 'Usuarios',
      icon: 'fa-solid fa-house',
      route: '/pages/users',
    },
    {
      label: 'Produtos',
      icon: 'fa-solid fa-barcode',
      route: '/pages/products',
      permissions: [UserPermission.PRODUCT_VIEW],
    },
    {
      label: 'Movimentações',
      icon: 'fa-solid fa-cubes',
      route: '/pages/movements',
      permissions: [UserPermission.STOCK_VIEW],
    },
    /*{
      label: 'Gestão',
      icon: 'fa-solid fa-clipboard-list',
      route: '/pages/profiles',
      profiles: ['MASTER'],
    },
    {
      label: 'Notificações',
      icon: 'fa-solid fa-bell',
      route: '/pages/notificaes',
    },*/
    {
      label: 'Sair',
      icon: 'fa-solid fa-right-from-bracket',
      action: 'logout',
    },
  ];

  public getMenyByPermission(profile: string): SidebarItem[] {
    return this.MENU_ITEMS.filter((item) => {
      return !item.profiles?.length || item.profiles.includes(profile);
    });
  }
}
