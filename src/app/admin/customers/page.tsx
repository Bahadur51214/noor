import { customerService } from "@/services/customer.service";
import Link from "next/link";
import { requireAuth } from "@/lib/auth";

export const metadata = {
  title: "Customers | NOOR Admin",
};

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  await requireAuth();
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search || "";
  const { customers, total, pages } = await customerService.getAll({
    page,
    limit: 10,
    search,
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 font-serif text-[#0D0D0D]">
        Customers
      </h1>

      <form className="mb-6 max-w-md" method="get">
        <input
          type="text"
          name="search"
          defaultValue={search}
          placeholder="Search by name or phone..."
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-[#C9A96E] focus:outline-none"
        />
      </form>

      <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden">
        {customers && customers.length > 0 ? (
          <>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">City</th>
                  <th className="px-4 py-3 font-medium text-right">Orders</th>
                  <th className="px-4 py-3 font-medium text-right">Total Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-[#0D0D0D]">
                      {c.name}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{c.phone}</td>
                    <td className="px-4 py-3 text-gray-500">{c.email || "—"}</td>
                    <td className="px-4 py-3 text-gray-500">{c.city}</td>
                    <td className="px-4 py-3 text-right text-gray-500">
                      {c.orderCount}
                    </td>
                    <td className="px-4 py-3 text-right text-[#0D0D0D] font-medium">
                      Rs {Number(c.totalSpent).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {pages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                <span className="text-sm text-gray-500">
                  Page {page} of {pages} ({total} customers)
                </span>
                <div className="flex gap-2">
                  {page > 1 && (
                    <Link
                      href={`/admin/customers?page=${page - 1}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                      className="px-3 py-1 text-sm border border-gray-200 rounded-md hover:bg-gray-50"
                    >
                      Previous
                    </Link>
                  )}
                  {page < pages && (
                    <Link
                      href={`/admin/customers?page=${page + 1}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                      className="px-3 py-1 text-sm border border-gray-200 rounded-md hover:bg-gray-50"
                    >
                      Next
                    </Link>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500 font-sans p-6">No customers found.</p>
        )}
      </div>
    </div>
  );
}
