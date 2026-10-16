export type ResultKind = "F" | "EF" | "EE";
export interface Point { approval: "ask" | "auto"; n: 2 | 3; results: ResultKind[]; scores: number[]; verdicts: string }
export interface Prediction {
  launches: number; candidateFailures: number; dropped: number; status: "drafted" | "failed"; failReason: "no_candidates" | "not_verified" | null;
  walkover: boolean; judges: number; graft: boolean; verdicts: number; fixes: number;
}
export interface FakeScenario {
  name: string; idea: string; approval: "ask" | "auto"; n: number; results: Record<string, Array<"error" | "finish">>;
  scores: Record<string, number>; verdicts: Array<"NOT_VERIFIED" | "INCONCLUSIVE" | "VERIFIED">; expect: "drafted" | "failed";
}
export const CANDS: readonly string[];
export const RESULT_KINDS: Readonly<Record<ResultKind, readonly string[]>>;
export const SCORE_LEVELS: readonly number[];
export const VERDICT_LETTERS: Readonly<Record<"V" | "N" | "I", string>>;
export const TERMINAL: readonly string[];
export const ALIAS_STATUSES: readonly string[];
export const BUDGET: { launchesPerCand: number; judgePasses: number; verdicts: number; fixes: number };
export function verdictSequences(): string[];
export function scenarioSpace(options?: { quick?: boolean }): Generator<Point>;
export function scenarioId(point: Point): string;
export function toScenario(point: Point): FakeScenario;
export function predict(point: Point): Prediction;
export const SEQUENCES: readonly { name: string; steps: readonly string[] }[];
export const TRANSITION_ROWS: readonly (readonly [string, string, string, string])[];
export function tripleKey(t: readonly string[] | { from: string; event: string; to: string }): string;
