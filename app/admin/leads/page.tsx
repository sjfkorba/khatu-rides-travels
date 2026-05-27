"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

type Lead = {
  id: string;
  name: string;
  phone: string;
  status: "new" | "called";
  callAgain: boolean;
};

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const loadLeads = async () => {
    const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Lead, "id">),
    }));

    setLeads(data);
  };

  const addLead = async () => {
    if (!name.trim() || !phone.trim()) {
      alert("Name aur mobile number fill karo");
      return;
    }

    await addDoc(collection(db, "leads"), {
      name: name.trim(),
      phone: phone.trim(),
      status: "new",
      callAgain: false,
      createdAt: serverTimestamp(),
      lastCalledAt: null,
    });

    setName("");
    setPhone("");
    loadLeads();
  };

  const callLead = async (lead: Lead) => {
    await updateDoc(doc(db, "leads", lead.id), {
      status: "called",
      callAgain: false,
      lastCalledAt: serverTimestamp(),
    });

    window.location.href = `tel:${lead.phone}`;
    loadLeads();
  };

  const markCallAgain = async (lead: Lead) => {
    await updateDoc(doc(db, "leads", lead.id), {
      callAgain: true,
      status: "new",
    });

    loadLeads();
  };

  const markDone = async (lead: Lead) => {
    await updateDoc(doc(db, "leads", lead.id), {
      status: "called",
      callAgain: false,
    });

    loadLeads();
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/admin/login");
      } else {
        loadLeads();
      }
    });

    return () => unsub();
  }, [router]);

  const activeLeads = leads.filter(
    (lead) => lead.status === "new" || lead.callAgain
  );

  const calledLeads = leads.filter(
    (lead) => lead.status === "called" && !lead.callAgain
  );

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold">Lead Call Dashboard</h1>
            <p className="text-gray-500">
              Customer follow-up list for Khatu Rides Travels Co.
            </p>
          </div>

          <button
            onClick={() => signOut(auth)}
            className="bg-gray-900 text-white px-5 py-2 rounded-full font-bold"
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-3xl border shadow-sm p-5 mb-8">
          <h2 className="text-xl font-bold mb-4">Add New Lead</h2>

          <div className="grid md:grid-cols-3 gap-3">
            <input
              className="border rounded-xl px-4 py-3"
              placeholder="Customer Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              className="border rounded-xl px-4 py-3"
              placeholder="Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <button
              onClick={addLead}
              className="bg-orange-600 text-white rounded-xl font-bold py-3"
            >
              Add Lead
            </button>
          </div>
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-extrabold mb-4">
            Active Leads ({activeLeads.length})
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {activeLeads.length === 0 ? (
              <div className="bg-white rounded-2xl p-5 border text-gray-500">
                Abhi koi active lead nahi hai.
              </div>
            ) : (
              activeLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="bg-white rounded-3xl border shadow-sm p-5"
                >
                  <h3 className="text-xl font-bold">{lead.name}</h3>
                  <p className="text-gray-600 mb-4">{lead.phone}</p>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => callLead(lead)}
                      className="bg-green-600 text-white px-5 py-2 rounded-full font-bold"
                    >
                      Call
                    </button>

                    <button
                      onClick={() => markCallAgain(lead)}
                      className="bg-orange-600 text-white px-5 py-2 rounded-full font-bold"
                    >
                      Call Again
                    </button>

                    <button
                      onClick={() => markDone(lead)}
                      className="bg-gray-900 text-white px-5 py-2 rounded-full font-bold"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-extrabold mb-4">
            Called / Hidden Leads ({calledLeads.length})
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {calledLeads.length === 0 ? (
              <div className="bg-white rounded-2xl p-5 border text-gray-500">
                Abhi koi hidden lead nahi hai.
              </div>
            ) : (
              calledLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="bg-white rounded-3xl border p-5 opacity-60"
                >
                  <h3 className="text-xl font-bold">{lead.name}</h3>
                  <p className="text-gray-600">{lead.phone}</p>
                  <p className="text-sm text-green-700 font-bold mt-2">
                    Called - Hidden from active list
                  </p>

                  <button
                    onClick={() => markCallAgain(lead)}
                    className="mt-3 bg-orange-600 text-white px-5 py-2 rounded-full font-bold"
                  >
                    Call Again
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}