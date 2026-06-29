// JisrVOC API client — barrel.
// Components import from here, never from individual files.

export { overviewClient } from "./overview";
export { feedbackClient } from "./feedback";
export { themesClient } from "./themes";
export { betsClient } from "./bets";
export { customersClient } from "./customers";
export { adminClient } from "./admin";

export { ApiError } from "./client";
export type { Paginated } from "./client";
export * from "./types";
