// ===============================next APP props types ========================//

import { AnyMongoAbility } from "@casl/ability";
import { NextComponentType, NextPageContext } from "next";
import { ReactElement, ReactNode } from "react";

export interface AclGuardProps {
  children: ReactNode;
  aclAbilities: ACLObj | undefined;
}

export type Actions = "manage" | "create" | "read" | "update" | "delete";

export interface ACLObj {
  action: Actions;
  subject: string;
}

export type NextPage<P = {}, IP = P> = NextComponentType<
  NextPageContext,
  IP,
  P
> & {
  acl?: ACLObj;
  setConfig?: () => void;
  contentHeightFixed?: boolean;
  getLayout?: (page: ReactElement) => ReactNode;
};

// ==================== Authcontext types =========================== //

export type ErrCallbackType = (err: { [key: string]: string }) => void;

export type LoginParams = {
  email: string;
  password: string;
};

export type RegisterParams = {
  email: string;
  username: string;
  password: string;
};

interface Option {
  id: string;
  name: string;
  value: string;
}

interface Role {
  id: string;
  name: string;
  value: string;
  _id?: string;
  options: Option[];
  createdAt: string; // or Date if you parse it
  updatedAt: string; // or Date if you parse it
}

export type UserDataType = {
  id: string;
  role: Role;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
  phone?: string;
};

export type AuthValuesType = {
  logout: () => void;
  user: UserDataType | null;
  setUser: (value: UserDataType | null) => void;
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void;
  register: (params: RegisterParams, errorCallback?: ErrCallbackType) => void;
  authLoading: boolean;
  setAuthLoading: (value: boolean) => void;
};

export type AbilityContextvalue = {
  ability: AnyMongoAbility | undefined;
  setAbility: (updatedSettings: AnyMongoAbility | undefined) => void;
};

//=============================== grid===========================//

export type GridSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface Staff {
  _id: string;
  fullName: string;
  role: Role;
  email: string;
  phone: string;
  specialization: string;
  gymId: string;
  isActive: boolean;
  createdAt: string; // or Date if you parse it
  updatedAt: string; // or Date if you parse it
}
