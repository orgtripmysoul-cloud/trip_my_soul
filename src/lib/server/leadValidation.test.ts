import { describe, it, expect } from "vitest";
import { LEAD_STATUSES, OPEN_LEAD_STATUSES, PIPELINE_STATUSES, LEAD_STATUS_LABELS } from "@/lib/types/crm";

/**
 * The pipeline rules the CRM plan depends on. These are enforced in three
 * places (DB check constraints, the PATCH route, the admin UI) and these
 * tests pin down the shared definitions all three read from.
 */
describe("lead status model", () => {
  it("requires a follow-up only for statuses that are still open", () => {
    // A closed lead has no next action, so it must not demand a follow-up date.
    for (const closed of ["converted", "lost", "junk"] as const) {
      expect(OPEN_LEAD_STATUSES).not.toContain(closed);
    }
    // 'new' is excluded too: it is the SLA's job to chase an uncontacted lead,
    // not the salesperson's, so capture is never blocked on a date.
    expect(OPEN_LEAD_STATUSES).not.toContain("new");
  });

  it("only shows open and won stages on the Kanban board", () => {
    expect(PIPELINE_STATUSES).not.toContain("lost");
    expect(PIPELINE_STATUSES).not.toContain("junk");
    expect(PIPELINE_STATUSES).not.toContain("on_hold");
    expect(PIPELINE_STATUSES).toContain("converted");
  });

  it("labels every status", () => {
    for (const status of LEAD_STATUSES) {
      expect(LEAD_STATUS_LABELS[status]).toBeTruthy();
    }
  });

  it("keeps every open status inside the full status list", () => {
    for (const status of OPEN_LEAD_STATUSES) {
      expect(LEAD_STATUSES).toContain(status);
    }
  });
});
