export const CARD_NO_EXPAND_SELECTOR = '[data-no-card-expand="true"]';

export function shouldIgnoreCardExpand(target: EventTarget | null): boolean {
  return target instanceof Element && Boolean(target.closest(CARD_NO_EXPAND_SELECTOR));
}

export function shouldProceedWithCardExpand(input: {
  target: EventTarget | null;
  active: boolean;
  suppressNextClick: boolean;
}): boolean {
  if (!input.active) return false;
  if (input.suppressNextClick) return false;
  if (shouldIgnoreCardExpand(input.target)) return false;
  return true;
}
