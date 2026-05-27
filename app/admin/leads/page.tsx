"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Lead = {
  id: string;
  name?: string;
  phone?: string;
  phoneLast10?: string;
  status?: "new" | "called" | "converted";
  callAgain?: boolean;
  hiddenUntil?: string | null;
};

type DialogState = {
  open: boolean;
  title: string;
  message: string;
  type: "success" | "error" | "confirm" | "delete" | "afterCall";
  confirmAction?: () => void;
  lead?: Lead;
};

const DELETE_PASSWORD = "989369";

export default function LeadsPage() {
  const router = useRouter();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [deletePassword, setDeletePassword] = useState("");

  const [dialog, setDialog] = useState<DialogState>({
    open: false,
    title: "",
    message: "",
    type: "success",
  });

  const startProgress = (text: string) => {
    setPageLoading(true);
    setLoadingText(text);
  };

  const stopProgress = () => {
    setPageLoading(false);
    setLoadingText("");
  };

  const openDialog = (
    title: string,
    message: string,
    type: DialogState["type"],
    confirmAction?: () => void,
    lead?: Lead
  ) => {
    setDialog({ open: true, title, message, type, confirmAction, lead });
  };

  const closeDialog = () => {
    setDeletePassword("");
    setDialog({
      open: false,
      title: "",
      message: "",
      type: "success",
    });
  };

  const getLast10Digits = (value?: string) => {
    return (value || "").replace(/\D/g, "").slice(-10);
  };

  const getNextCallingSlot = () => {
    const now = new Date();

    const morningSlot = new Date(now);
    morningSlot.setHours(6, 0, 0, 0);

    const eveningSlot = new Date(now);
    eveningSlot.setHours(16, 0, 0, 0);

    if (now < morningSlot) {
      return morningSlot;
    }

    if (now < eveningSlot) {
      return eveningSlot;
    }

    const nextMorning = new Date(now);
    nextMorning.setDate(nextMorning.getDate() + 1);
    nextMorning.setHours(6, 0, 0, 0);

    return nextMorning;
  };

  const isLeadActive = (lead: Lead) => {
    const now = new Date();

    if (lead.callAgain) return true;

    if (!lead.status || lead.status === "new") return true;

    if (lead.hiddenUntil) {
      const hiddenDate = new Date(lead.hiddenUntil);

      if (isNaN(hiddenDate.getTime())) {
        return false;
      }

      return hiddenDate <= now;
    }

    return false;
  };

  const getLeadStatusText = (lead: Lead) => {
    if (isLeadActive(lead) && lead.status !== "new") {
      return "Auto Active for Next Calling Slot";
    }

    if (lead.status === "converted") {
      return "Converted / Done";
    }

    if (lead.status === "called") {
      return "Hidden until next calling slot";
    }

    return "New Lead";
  };

  const loadLeads = async () => {
    startProgress("Loading leads...");

    try {
      const { collection, getDocs, query, orderBy } = await import(
        "firebase/firestore"
      );
      const { db } = await import("@/lib/firebase");

      const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Lead, "id">),
      }));

      setLeads(data);
    } catch (error) {
      console.error(error);
      openDialog("Error", "Leads load nahi ho payi.", "error");
    } finally {
      stopProgress();
    }
  };

  const addLead = async () => {
    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const last10Digits = getLast10Digits(cleanPhone);

    if (!cleanName || last10Digits.length !== 10) {
      openDialog(
        "Invalid Details",
        "Customer name aur valid 10 digit mobile number enter karein.",
        "error"
      );
      return;
    }

    setLoading(true);
    startProgress("Checking duplicate lead...");

    try {
      const {
        addDoc,
        collection,
        serverTimestamp,
        query,
        where,
        getDocs,
      } = await import("firebase/firestore");

      const { db } = await import("@/lib/firebase");

      const duplicateQuery = query(
        collection(db, "leads"),
        where("phoneLast10", "==", last10Digits)
      );

      const duplicateSnapshot = await getDocs(duplicateQuery);

      if (!duplicateSnapshot.empty) {
        const existingLead = duplicateSnapshot.docs[0].data() as Lead;

        openDialog(
          "Duplicate Lead Found",
          `Ye number already saved hai. Customer: ${
            existingLead.name || "Unknown"
          } | Mobile: ${existingLead.phone || last10Digits}`,
          "error"
        );

        return;
      }

      await addDoc(collection(db, "leads"), {
        name: cleanName,
        phone: cleanPhone,
        phoneLast10: last10Digits,
        status: "new",
        callAgain: false,
        hiddenUntil: null,
        createdAt: serverTimestamp(),
        lastCalledAt: null,
      });

      setName("");
      setPhone("");

      await loadLeads();

      openDialog("Lead Saved", "New lead successfully save ho gayi.", "success");
    } catch (error) {
      console.error(error);
      openDialog(
        "Save Failed",
        "Lead save nahi ho payi. Internet ya Firebase setting check karein.",
        "error"
      );
    } finally {
      setLoading(false);
      stopProgress();
    }
  };

  const callLead = async (lead: Lead) => {
    if (!lead.phone) {
      openDialog("Missing Number", "Is lead me mobile number missing hai.", "error");
      return;
    }

    startProgress("Updating call status...");

    try {
      const { updateDoc, doc, serverTimestamp } = await import(
        "firebase/firestore"
      );
      const { db } = await import("@/lib/firebase");

      await updateDoc(doc(db, "leads", lead.id), {
        status: "called",
        callAgain: false,
        lastCalledAt: serverTimestamp(),
      });

      await loadLeads();

      stopProgress();

      window.location.href = `tel:${lead.phone}`;

      setTimeout(() => {
        openDialog(
          "Call Completed?",
          `${lead.name || "Customer"} se call ke baad kya karna hai?`,
          "afterCall",
          undefined,
          lead
        );
      }, 1200);
    } catch (error) {
      console.error(error);
      stopProgress();
      openDialog("Error", "Call status update nahi ho paya.", "error");
    }
  };

  const markCallAgainDirect = async (lead: Lead) => {
    startProgress("Moving lead to Call Again...");

    try {
      const { updateDoc, doc } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");

      await updateDoc(doc(db, "leads", lead.id), {
        status: "new",
        callAgain: true,
        hiddenUntil: null,
      });

      await loadLeads();
    } catch (error) {
      console.error(error);
      openDialog("Error", "Lead Call Again me move nahi ho payi.", "error");
    } finally {
      stopProgress();
    }
  };

  const markDoneDirect = async (lead: Lead) => {
    const nextSlot = getNextCallingSlot();

    startProgress("Hiding lead until next calling slot...");

    try {
      const { updateDoc, doc } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");

      await updateDoc(doc(db, "leads", lead.id), {
        status: "called",
        callAgain: false,
        hiddenUntil: nextSlot.toISOString(),
      });

      await loadLeads();
    } catch (error) {
      console.error(error);
      openDialog("Error", "Lead hide nahi ho payi.", "error");
    } finally {
      stopProgress();
    }
  };

  const markCallAgain = (lead: Lead) => {
    openDialog(
      "Call Again?",
      `${lead.name || "Customer"} ko active list me dobara rakhna hai?`,
      "confirm",
      async () => {
        closeDialog();
        await markCallAgainDirect(lead);
        openDialog("Updated", "Lead Call Again list me add ho gayi.", "success");
      }
    );
  };

  const markDone = (lead: Lead) => {
    const nextSlot = getNextCallingSlot();

    openDialog(
      "Hide Until Next Slot?",
      `${lead.name || "Customer"} ko ${nextSlot.toLocaleString()} tak hide karna hai?`,
      "confirm",
      async () => {
        closeDialog();
        await markDoneDirect(lead);
        openDialog(
          "Hidden",
          "Lead next calling slot tak hide ho gayi hai.",
          "success"
        );
      }
    );
  };

  const requestDeleteLead = (lead: Lead) => {
    openDialog(
      "Delete Lead?",
      `${lead.name || "Customer"} ka lead permanently delete karna hai?`,
      "delete",
      undefined,
      lead
    );
  };

  const confirmDeleteLead = async () => {
    if (deletePassword !== DELETE_PASSWORD) {
      openDialog("Wrong Password", "Delete password galat hai.", "error");
      return;
    }

    if (!dialog.lead) return;

    startProgress("Deleting lead...");

    try {
      const { deleteDoc, doc } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");

      await deleteDoc(doc(db, "leads", dialog.lead.id));

      closeDialog();
      await loadLeads();

      openDialog("Deleted", "Lead permanently delete ho gayi.", "success");
    } catch (error) {
      console.error(error);
      openDialog("Error", "Lead delete nahi ho payi.", "error");
    } finally {
      stopProgress();
    }
  };

  const logout = async () => {
    startProgress("Logging out...");

    try {
      const { signOut } = await import("firebase/auth");
      const { auth } = await import("@/lib/firebase");
      await signOut(auth);
      router.push("/admin/login");
    } catch (error) {
      console.error(error);
      openDialog("Error", "Logout nahi ho paya.", "error");
    } finally {
      stopProgress();
    }
  };

  useEffect(() => {
    let unsub: undefined | (() => void);

    async function checkAuth() {
      startProgress("Checking login access...");

      try {
        const { onAuthStateChanged } = await import("firebase/auth");
        const { auth } = await import("@/lib/firebase");

        unsub = onAuthStateChanged(auth, (user) => {
          if (!user) {
            stopProgress();
            router.push("/admin/login");
          } else {
            loadLeads();
          }
        });
      } catch (error) {
        console.error(error);
        stopProgress();
        router.push("/admin/login");
      }
    }

    checkAuth();

    return () => {
      if (unsub) unsub();
    };
  }, [router]);

  const activeLeads = leads.filter((lead) => isLeadActive(lead));
  const hiddenLeads = leads.filter((lead) => !isLeadActive(lead));

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6">
      {pageLoading && (
        <>
          <div className="fixed left-0 top-0 z-[1000] h-1 w-full overflow-hidden bg-orange-100">
            <div className="h-full w-1/3 animate-progressBar bg-orange-600" />
          </div>

          <div className="fixed inset-0 z-[998] flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm">
            <div className="rounded-3xl bg-white px-6 py-5 text-center shadow-2xl">
              <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600" />
              <p className="font-bold text-gray-900">{loadingText}</p>
              <p className="mt-1 text-sm text-gray-500">Please wait...</p>
            </div>
          </div>
        </>
      )}

      {dialog.open && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div
              className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full text-2xl font-bold ${
                dialog.type === "success"
                  ? "bg-green-100 text-green-700"
                  : dialog.type === "error"
                  ? "bg-red-100 text-red-700"
                  : dialog.type === "delete"
                  ? "bg-red-100 text-red-700"
                  : "bg-orange-100 text-orange-700"
              }`}
            >
              {dialog.type === "success"
                ? "✓"
                : dialog.type === "error" || dialog.type === "delete"
                ? "!"
                : "?"}
            </div>

            <h2 className="text-2xl font-extrabold">{dialog.title}</h2>
            <p className="mt-3 text-gray-600">{dialog.message}</p>

            {dialog.type === "delete" && (
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Enter delete password"
                className="mt-5 w-full rounded-xl border px-4 py-3"
              />
            )}

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              {dialog.type === "afterCall" && dialog.lead ? (
                <>
                  <button
                    onClick={async () => {
                      closeDialog();
                      await markCallAgainDirect(dialog.lead!);
                      openDialog(
                        "Updated",
                        "Lead active list me Call Again ke liye aa gayi.",
                        "success"
                      );
                    }}
                    className="rounded-full bg-orange-600 px-5 py-2 font-bold text-white"
                  >
                    Call Again
                  </button>

                  <button
                    onClick={async () => {
                      closeDialog();
                      await markDoneDirect(dialog.lead!);
                      openDialog(
                        "Hidden",
                        "Lead next calling slot tak hide ho gayi.",
                        "success"
                      );
                    }}
                    className="rounded-full bg-green-600 px-5 py-2 font-bold text-white"
                  >
                    Done / Hide
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={closeDialog}
                    className="rounded-full border px-5 py-2 font-bold text-gray-700"
                  >
                    Cancel
                  </button>

                  {dialog.type === "confirm" ? (
                    <button
                      onClick={dialog.confirmAction}
                      className="rounded-full bg-orange-600 px-5 py-2 font-bold text-white"
                    >
                      Confirm
                    </button>
                  ) : dialog.type === "delete" ? (
                    <button
                      onClick={confirmDeleteLead}
                      className="rounded-full bg-red-600 px-5 py-2 font-bold text-white"
                    >
                      Delete
                    </button>
                  ) : (
                    <button
                      onClick={closeDialog}
                      className="rounded-full bg-gray-900 px-5 py-2 font-bold text-white"
                    >
                      OK
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold">Lead Call Dashboard</h1>
            <p className="text-gray-500">
              Duplicate-free customer follow-up system with 6 AM & 4 PM calling slots.
            </p>
          </div>

          <button
            onClick={logout}
            className="rounded-full bg-gray-900 px-5 py-2 font-bold text-white"
          >
            Logout
          </button>
        </div>

        <div className="mb-8 rounded-3xl border bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-bold">Add New Lead</h2>

          <div className="grid gap-3 md:grid-cols-3">
            <input
              className="rounded-xl border px-4 py-3"
              placeholder="Customer Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              className="rounded-xl border px-4 py-3"
              placeholder="Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <button
              onClick={addLead}
              disabled={loading}
              className="rounded-xl bg-orange-600 py-3 font-bold text-white disabled:opacity-60"
            >
              {loading ? "Checking..." : "Add Lead"}
            </button>
          </div>
        </div>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-extrabold">
            Active Leads ({activeLeads.length})
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {activeLeads.length === 0 ? (
              <div className="rounded-2xl border bg-white p-5 text-gray-500">
                Abhi koi active lead nahi hai.
              </div>
            ) : (
              activeLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="rounded-3xl border bg-white p-5 shadow-sm"
                >
                  <h3 className="text-xl font-bold">
                    {lead.name || "Unknown Customer"}
                  </h3>
                  <p className="mb-2 text-gray-600">
                    {lead.phone || "No number"}
                  </p>

                  <p className="mb-4 text-sm font-bold text-green-700">
                    {getLeadStatusText(lead)}
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => callLead(lead)}
                      className="rounded-full bg-green-600 px-5 py-2 font-bold text-white"
                    >
                      Call
                    </button>

                    <button
                      onClick={() => markCallAgain(lead)}
                      className="rounded-full bg-orange-600 px-5 py-2 font-bold text-white"
                    >
                      Call Again
                    </button>

                    <button
                      onClick={() => markDone(lead)}
                      className="rounded-full bg-gray-900 px-5 py-2 font-bold text-white"
                    >
                      Done / Hide
                    </button>

                    <button
                      onClick={() => requestDeleteLead(lead)}
                      className="rounded-full bg-red-600 px-5 py-2 font-bold text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-extrabold">
            Hidden Until Next Slot ({hiddenLeads.length})
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {hiddenLeads.length === 0 ? (
              <div className="rounded-2xl border bg-white p-5 text-gray-500">
                Abhi koi hidden lead nahi hai.
              </div>
            ) : (
              hiddenLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="rounded-3xl border bg-white p-5 opacity-70"
                >
                  <h3 className="text-xl font-bold">
                    {lead.name || "Unknown Customer"}
                  </h3>
                  <p className="text-gray-600">{lead.phone || "No number"}</p>

                  <p className="mt-2 text-sm font-bold text-orange-700">
                    {getLeadStatusText(lead)}
                  </p>

                  {lead.hiddenUntil && (
                    <p className="mt-1 text-sm text-gray-500">
                      Active again: {new Date(lead.hiddenUntil).toLocaleString()}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-3">
                    <button
                      onClick={() => markCallAgain(lead)}
                      className="rounded-full bg-orange-600 px-5 py-2 font-bold text-white"
                    >
                      Call Again Now
                    </button>

                    <button
                      onClick={() => requestDeleteLead(lead)}
                      className="rounded-full bg-red-600 px-5 py-2 font-bold text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}