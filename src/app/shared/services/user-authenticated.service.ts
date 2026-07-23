import { Injectable } from '@angular/core';
import { UserResponse } from '../models/users.model';

@Injectable({
  providedIn: 'root',
})
export class UserAuthenticatedService {

  protected user: UserResponse;
  /*protected id: string;
  protected name: string;
  protected document: string;
  protected email: string;
  protected phone: string;
  protected company: string;
  protected roles: string[];*/

  setUser(user: UserResponse) {
    this.user = user;
  }

  getUser(): UserResponse {
    return this.user;
  }

  /*setId(id: string): void {
    this.id = id;
  }

  setName(name: string): void {
    this.name = name;
  }

  setDocument(document: string): void {
    this.document = document;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  setPhone(phone: string): void {
    this.phone = phone;
  }

  setCompany(company: string): void {
    this.company = company;
  }

  setRoles(roles: string[]): void {
    this.roles = roles;
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getDocument() {
    return this.document;
  }

  getEmail() {
    return this.email;
  }

  getPhone() {
    return this.phone;
  }

  getCompany() {
    return this.company;
  }

  getRoles() {
    return this.roles;
  }*/
}
