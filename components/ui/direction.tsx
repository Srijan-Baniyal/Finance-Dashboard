"use client";

import {
  DirectionProvider as BaseDirectionProvider,
  useDirection as useBaseDirection,
} from "@base-ui/react/direction-provider";

const DirectionProvider = BaseDirectionProvider;

function useDirection() {
  return useBaseDirection();
}

export { DirectionProvider, useDirection };
