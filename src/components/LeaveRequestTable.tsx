import { StatusBadge } from "@/components/StatusBadge";
import { formatDateRange } from "@/lib/format";

export interface LeaveRequestRow {
  id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string | null;
  status: string;
  employee: { name: string; email: string };
}

/**
 * GAP-A2: a table with no caption, no scope attributes on headers, and no
 * landmark wrapper. Keyboard users can reach the action buttons but have no
 * way to tell which row they belong to.
 */
export function LeaveRequestTable({
  requests,
  showEmployee = false,
}: {
  requests: LeaveRequestRow[];
  showEmployee?: boolean;
}) {
  if (requests.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500">
        No leave requests yet.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
      <table className="min-w-full divide-y divide-zinc-200 text-sm">
        <thead className="bg-zinc-50">
          <tr>
            {showEmployee && (
              <th className="px-4 py-3 text-left font-semibold text-zinc-700">
                Employee
              </th>
            )}
            <th className="px-4 py-3 text-left font-semibold text-zinc-700">Type</th>
            <th className="px-4 py-3 text-left font-semibold text-zinc-700">Dates</th>
            <th className="px-4 py-3 text-left font-semibold text-zinc-700">Days</th>
            <th className="px-4 py-3 text-left font-semibold text-zinc-700">Status</th>
            <th className="px-4 py-3 text-left font-semibold text-zinc-700">Reason</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {requests.map((request) => (
            <tr key={request.id} className="hover:bg-zinc-50">
              {showEmployee && (
                <td className="px-4 py-3 font-medium text-zinc-900">
                  {request.employee.name}
                </td>
              )}
              <td className="px-4 py-3 text-zinc-700">
                {request.leaveType.charAt(0) + request.leaveType.slice(1).toLowerCase()}
              </td>
              <td className="px-4 py-3 text-zinc-700">
                {formatDateRange(request.startDate, request.endDate)}
              </td>
              <td className="px-4 py-3 tabular-nums text-zinc-700">{request.days}</td>
              <td className="px-4 py-3">
                <StatusBadge status={request.status} />
              </td>
              <td className="max-w-xs truncate px-4 py-3 text-zinc-500">
                {request.reason ?? "none"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
