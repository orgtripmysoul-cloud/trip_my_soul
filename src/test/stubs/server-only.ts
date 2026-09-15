// Test stub for the "server-only" package. Its real implementation throws
// unconditionally when resolved outside Next.js's "react-server" bundler
// condition (which is how it normally guards client bundles) — that
// condition isn't set under Vitest/Node, so tests alias it to this no-op.
export {};
