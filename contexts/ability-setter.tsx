import { AbilityBuilder, createMongoAbility } from "@casl/ability";
export const defineRulesFor = (role: string, options?: string[]) => {
  const { can, build } = new AbilityBuilder(createMongoAbility);
  if (role === "super-admin") {
    can("manage", "all");
  } else {
    if (options) {
      can("read", [...options]);
    }
  }
  return build();
};