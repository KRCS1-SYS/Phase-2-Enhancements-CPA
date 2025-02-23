import React from "react";
import { ParameterContext } from "../ParameterContext";

export function useParameter() {
  return React.useContext(ParameterContext);
}
