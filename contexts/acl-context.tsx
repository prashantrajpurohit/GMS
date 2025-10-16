"use client";
import { useState } from "react";
import { createContext } from "react";
import { AnyMongoAbility } from "@casl/ability";
import { AbilityContextvalue, AclGuardProps, ACLObj } from "@/types/types";
import { useAuth } from "@/hooks/use-auth";
import { defineRulesFor } from "./ability-setter";
import NotAuthorized from "@/components/not-authorized";
import { usePathname } from "next/navigation";

const defaultACLObj: ACLObj = {
  action: "manage",
  subject: "all",
};

const AbilityContext = createContext<AbilityContextvalue>({
  ability: undefined,
  setAbility: () => null,
});

const AbilityProvider = (props: AclGuardProps) => {
  if (props.aclAbilities === undefined) {
    props.aclAbilities = defaultACLObj;
  }
  const auth = useAuth();
  const pathname = usePathname();
  const { aclAbilities, children } = props;
  const [ability, setAbility] = useState<AnyMongoAbility | undefined>(
    undefined
  );

  if (
    pathname === "/404" ||
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register"
  ) {
    return <>{children}</>;
  } else if (!!auth.user && !!auth.user.role.value && !ability) {
    const options = auth?.user?.role?.options?.map((ele) => ele.value);
    setAbility(defineRulesFor(auth.user.role?.value, options));
  } else if (
    ability &&
    ability.can(aclAbilities.action ?? "read", aclAbilities.subject)
  ) {
    const values = {
      ability,
      setAbility,
    };

    return (
      <AbilityContext.Provider value={values}>
        {children}
      </AbilityContext.Provider>
    );
  } else {
    return <NotAuthorized />;
  }
};

export { AbilityProvider, AbilityContext, defaultACLObj };

export const AbilityConsumer = AbilityContext.Consumer;
