import { Atom, AtomMiddleware } from './types';

export interface IStore {
  middleware: AtomMiddleware<any>[];
  atoms: { [key: string]: Atom<any> };
  atomCreated(atom: Atom<any>): void;
  addMiddleware(...middleware: AtomMiddleware<any>[]): void;
  removeMiddleware(middleware: AtomMiddleware<any>): void;
  subscriptions: ((msg: unknown) => void)[];
  sendMessage(msg: any): void;
  subscribe(subscription: (msg: any) => void): void;
  unsubscribe(subscription: (msg: any) => void): void;
  getAllAtoms(): { [key: string]: Atom<any> };
}

function remove(list, item) {
  for (let i = list.length - 1; i >= 0; i--) {
    if (list[i] === item) {
      list.splice(i, 1);
      break;
    }
  }
}

export class Store implements IStore {
  middleware: AtomMiddleware<any>[] = [];
  atoms: { [key: string]: Atom<any> } = {};
  subscriptions: ((msg: unknown) => void)[] = [];

  public getAllAtoms() {
    return this.atoms;
  }

  public atomCreated(atom: Atom<any>): void {
    this.atoms[atom.getId()] = atom;
  }

  public addMiddleware(...middleware: AtomMiddleware<any>[]): void {
    this.middleware.push(...middleware);
  }

  public setMiddleware(...middleware: AtomMiddleware<any>[]): void {
    this.middleware = middleware;
  }

  public removeMiddleware(middleware: AtomMiddleware<any>): void {
    remove(this.middleware, middleware);
  }

  public subscribe(subscription: (msg: any) => void): void {
    this.subscriptions.push(subscription);
  }

  public unsubscribe(subscription: (msg: any) => void): void {
    remove(this.subscriptions, subscription);
  }

  public sendMessage(msg: any): void {
    for (let i = 0; i < this.subscriptions.length; i++) {
      this.subscriptions[i](msg);
    }
  }
}

export const DEFAULT_STORE = new Store();
