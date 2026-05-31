"use client";

export default function InvoicePreview() {
  return (
    <div
      id="invoice"
      className="bg-white w-[794px] min-h-[1123px] mx-auto p-10"
    >
      <div className="border-b pb-4">

        <h1 className="text-4xl font-bold text-center">
          KHATU RIDES & TRAVELS
        </h1>

        <p className="text-center text-gray-600">
          Professional Car Rental Service
        </p>
      </div>

      <div className="flex justify-between mt-8">

        <div>
          <h3 className="font-bold">
            Invoice No:
          </h3>

          <p>KRT-2026-001</p>
        </div>

        <div>
          <h3 className="font-bold">
            Date
          </h3>

          <p>01-06-2026</p>
        </div>

      </div>

      <div className="mt-10">
        <h2 className="font-bold text-xl">
          Customer Details
        </h2>

        <div className="border mt-3">
          <div className="grid grid-cols-2">

            <div className="border p-3">
              Customer Name
            </div>

            <div className="border p-3">
              Rahul Sharma
            </div>

            <div className="border p-3">
              Mobile
            </div>

            <div className="border p-3">
              9876543210
            </div>

          </div>
        </div>
      </div>

      <div className="mt-8">

        <h2 className="font-bold text-xl">
          Booking Details
        </h2>

        <table className="w-full border mt-3">

          <thead>

            <tr>
              <th className="border p-3">
                Vehicle
              </th>

              <th className="border p-3">
                Route
              </th>

              <th className="border p-3">
                Remarks
              </th>

              <th className="border p-3">
                Amount
              </th>
            </tr>

          </thead>

          <tbody>

            <tr>
              <td className="border p-3">
                Sedan
              </td>

              <td className="border p-3">
                Raipur → Korba
              </td>

              <td className="border p-3">
                Including Toll Tax
              </td>

              <td className="border p-3">
                ₹3200
              </td>
            </tr>

          </tbody>

        </table>
      </div>

      <div className="flex justify-end mt-8">

        <div className="w-72 border">

          <div className="flex justify-between p-3">
            <span>Total Amount</span>
            <span>₹3200</span>
          </div>

        </div>

      </div>

      <div className="mt-12">

        <h3 className="font-bold">
          Terms & Conditions
        </h3>

        <ul className="list-disc ml-6 mt-2 text-sm">

          <li>
            Fare includes agreed charges only.
          </li>

          <li>
            Additional charges applicable if route changes.
          </li>

          <li>
            Toll tax included if mentioned in remarks.
          </li>

          <li>
            Subject to Khatu Rides & Travels policies.
          </li>

        </ul>

      </div>

      <div className="mt-16 text-center text-gray-500 text-sm">

        This is a computer generated invoice and does not require signature.

      </div>

    </div>
  );
}