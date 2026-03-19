import { useMemo } from "react";
import { calculateAge } from "../utils/calculateAge";

export const useAge = (birthDate) => {
  return useMemo(() => calculateAge(birthDate), [birthDate]);
};