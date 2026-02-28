"use client";

import * as React from "react";
import {
  DirectionProvider as RadixDirectionProvider,
  useDirection as useRadixDirection,
} from "@radix-ui/react-direction";

const DirectionProvider = RadixDirectionProvider;
const useDirection = useRadixDirection;

export { DirectionProvider, useDirection };
