import { Atom } from 'redab-core';

export type ACTION_COMPLETED = {
  type: 'ACTION_COMPLETED';
  id: string;
  arguments: any[];
  returnVal: any;
  updates: {
    atom: Atom<any>;
    value: any;
  };
};

export type ASYNC_ACTION_STARTED = {
  type: 'ASYNC_ACTION_STARTED';
  id: string;
  arguments: any[];
  callId: string;
};

export type ASYNC_ACTION_ENDED = {
  type: 'ASYNC_ACTION_ENDED';
  id: string;
  callId: string;
  cancelled: boolean;
  hasError: boolean;
  returnVal: any;
  updates: {
    atom: Atom<any>;
    value: any;
  };
};
