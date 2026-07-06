// app/admin/leads/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Wallet,
  Phone,
  LogOut,
  Plus,
  User,
  Smartphone,
  EyeOff,
  Trash2,
  CheckCircle2,
  RotateCcw,
  Loader2,
  Search,
  ShieldCheck,
  MessageCircle,
  Car,
  Send,
  X,
  CalendarDays
} from "lucide-react";

type Lead = {
  id: string;
  name?: string;
  phone?: string;
  phoneLast10?: string;
  status?: "new" | "called" | "converted";
  callAgain?: boolean;
  hiddenUntil?: string | null;
  lastCalledAt?: any;
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
const OWNER_PHONE = "9244137353";

// 👑 FIXED SCOPE ORDERING: Helper utility helper placed globally before component lifecycle consumption
const extractPhoneLast10Digits = (value?: string) =>
  (value || "").replace(/\D/g, "").slice(-10);

export default function LeadsPage() {
  const router = useRouter();
  const tabRef = useRef<HTMLDivElement | null>(null);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [showAdd, setShowAdd] = useState(false);

  const [vehicleLocation, setVehicleLocation] = useState("Raipur Airport");
  const [availableFor, setAvailableFor] = useState(
    "Korba, Bilaspur, Raigarh aur nearby outstation trips"
  );

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
    setDialog({ open: false, title: "", message: "", type: "success" });
  };

  const getNextCallingSlot = () => {
    const now = new Date();
    const morningSlot = new Date(now);
    morningSlot.setHours(6, 0, 0, 0);

    const eveningSlot = new Date(now);
    eveningSlot.setHours(16, 0, 0, 0);

    if (now < morningSlot) return morningSlot;
    if (now < eveningSlot) return eveningSlot;

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
      if (isNaN(hiddenDate.getTime())) return false;
      return hiddenDate <= now;
    }
    return false;
  };

  const getLeadStatusText = (lead: Lead) => {
    if (lead.callAgain) return "Call Again";
    if (isLeadActive(lead) && lead.status !== "new") return "Active Again";
    if (lead.status === "converted") return "Converted";
    if (lead.status === "called") return "Hidden";
    return "New Lead";
  };

  const getB2BMessage = () => {
    return `Namaste ji B2B Travel Partner,

Khatu Rides Travels Co. se bol rahe hain.

Hamare paas New Ertiga VXI 2026 model available hai.

Vehicle Location: ${vehicleLocation}
Available For: ${availableFor}

Yadi aapke paas one way, round trip, airport pickup-drop ya outstation booking ho to reply karein. Hame aapke sath milke business karne me bahut khushi hogi aur aapke leads ko apna samajh ke best service provide karenge. Customer ki satisfaction se aapke aur hamare business ki image ko stable rakhenge.

Khatu Rides Travels Co.
www.khaturidescg.in
Call / WhatsApp: ${OWNER_PHONE}`;
  };

  const loadLeads = async () => {
    startProgress("Loading CRM leads...");
    try {
      const { collection, getDocs, query, orderBy } = await import("firebase/firestore");
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
    const last10Digits = extractPhoneLast10Digits(cleanPhone);

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
      const { addDoc, collection, serverTimestamp, query, where, getDocs } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");

      const duplicateQuery = query(collection(db, "leads"), where("phoneLast10", "==", last10Digits));
      const duplicateSnapshot = await getDocs(duplicateQuery);

      if (!duplicateSnapshot.empty) {
        const existingLead = duplicateSnapshot.docs[0].data() as Lead;
        openDialog(
          "Duplicate Lead Found",
          `Ye number already saved hai. Customer: ${existingLead.name || "Unknown"} | Mobile: ${existingLead.phone || last10Digits}`,
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
      setShowAdd(false);
      await loadLeads();
      openDialog("Lead Saved", "New lead successfully save ho gayi.", "success");
    } catch (error) {
      console.error(error);
      openDialog("Save Failed", "Lead save nahi ho payi.", "error");
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
      const { updateDoc, doc, serverTimestamp } = await import("firebase/firestore");
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
    startProgress("Hiding lead until next slot...");
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
      `${lead.name || "Customer"} ko Call Again list me rakhna hai?`,
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
        openDialog("Hidden", "Lead next calling slot tak hide ho gayi.", "success");
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
      startProgress("Checking CRM access...");
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
    return () => { if (unsub) unsub(); };
  }, [router]);

  const filteredLeads = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return leads;
    return leads.filter((lead) => {
      return (
        lead.name?.toLowerCase().includes(q) ||
        lead.phone?.toLowerCase().includes(q) ||
        lead.phoneLast10?.toLowerCase().includes(q)
      );
    });
  }, [leads, search]);

  const activeLeads = filteredLeads.filter((lead) => isLeadActive(lead) && !lead.callAgain);
  const callAgainLeads = filteredLeads.filter((lead) => lead.callAgain);
  const hiddenLeads = filteredLeads.filter((lead) => !isLeadActive(lead));

  const tabs = [
    { label: "Active", leads: activeLeads, empty: "Abhi koi active lead nahi hai." },
    { label: "Call Again", leads: callAgainLeads, empty: "Abhi koi call again lead nahi hai." },
    { label: "Hidden", leads: hiddenLeads, empty: "Abhi koi hidden lead nahi hai." },
  ];

  const scrollToTab = (index: number) => {
    setActiveTab(index);
    const el = tabRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-slate-950">
      {pageLoading && (
        <div className="fixed inset-0 z-[998] flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm">
          <div className="rounded-[28px] bg-white px-7 py-6 text-center shadow-2xl">
            <Loader2 className="mx-auto mb-3 h-10 w-10 animate-spin text-orange-600" />
            <p className="font-bold">{loadingText}</p>
            <p className="mt-1 text-sm text-slate-500">Please wait...</p>
          </div>
        </div>
      )}

      {dialog.open && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-[30px] bg-white p-6 shadow-2xl text-left">
            <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${
              dialog.type === "success" ? "bg-green-100 text-green-700" : dialog.type === "error" || dialog.type === "delete" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
            }`}>
              {dialog.type === "success" ? <CheckCircle2 size={28} /> : dialog.type === "delete" ? <Trash2 size={26} /> : <ShieldCheck size={26} />}
            </div>
            <h2 className="text-2xl font-black">{dialog.title}</h2>
            <p className="mt-3 text-slate-600 text-sm font-semibold">{dialog.message}</p>
            {dialog.type === "delete" && (
              <input type="password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} placeholder="Enter delete password" className="mt-5 w-full rounded-2xl border px-4 py-3 outline-none focus:border-orange-500 text-sm bg-white font-bold"/>
            )}
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              {dialog.type === "afterCall" && dialog.lead ? (
                <>
                  <button onClick={async () => { closeDialog(); await markCallAgainDirect(dialog.lead!); openDialog("Updated", "Lead Call Again me aa gayi.", "success"); }} className="rounded-full bg-orange-600 px-5 py-3 text-xs font-black text-white uppercase tracking-wider">Call Again</button>
                  <button onClick={async () => { closeDialog(); await markDoneDirect(dialog.lead!); openDialog("Hidden", "Lead next slot tak hide ho gayi.", "success"); }} className="rounded-full bg-slate-900 px-5 py-3 text-xs font-black text-white uppercase tracking-wider">Done / Hide</button>
                </>
              ) : (
                <>
                  <button onClick={closeDialog} className="rounded-full border border-slate-200 px-5 py-3 text-xs font-black text-slate-700 uppercase tracking-wider bg-white">Cancel</button>
                  {dialog.type === "confirm" ? (
                    <button onClick={dialog.confirmAction} className="rounded-full bg-orange-600 px-5 py-3 text-xs font-black text-white uppercase tracking-wider">Confirm</button>
                  ) : dialog.type === "delete" ? (
                    <button onClick={confirmDeleteLead} className="rounded-full bg-red-600 px-5 py-3 text-xs font-black text-white uppercase tracking-wider">Delete</button>
                  ) : (
                    <button onClick={closeDialog} className="rounded-full bg-slate-950 px-5 py-3 text-xs font-black text-white uppercase tracking-wider">OK</button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header Panel */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl text-left">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div>
            <h1 className="text-xl font-black tracking-tight md:text-2xl">Khatu Rides CRM</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">Leads Operations & Broadcast Desk</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => router.push("/admin/bookings")} className="flex items-center gap-1.5 rounded-full bg-slate-950 px-4 py-2.5 text-xs font-black text-white shadow-sm">
              <CalendarDays size={15} /> <span className="hidden sm:inline">BOOKINGS</span>
            </button>
            <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 rounded-full bg-orange-600 px-4 py-2.5 text-xs font-black text-white shadow-md">
              <Plus size={15} /> ADD LEAD
            </button>
            <button onClick={logout} className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 border hover:bg-slate-200 transition">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Core */}
      <div className="mx-auto max-w-6xl px-4 py-5 space-y-4">
        
        {/* Analytics Header Metrics Row */}
        <section className="grid grid-cols-3 gap-3">
          <MiniStat title="Active Leads" value={activeLeads.length} />
          <MiniStat title="Call Again" value={callAgainLeads.length} />
          <MiniStat title="Hidden Slots" value={hiddenLeads.length} />
        </section>

        {/* Dynamic Broadcast Board Panel */}
        <section className="rounded-3xl bg-slate-950 p-5 text-white shadow-xl text-left relative overflow-hidden">
          <div className="flex items-start gap-4">
            <span className="text-3xl p-2 rounded-xl bg-white/10 shrink-0">🚖</span>
            <div>
              <h2 className="text-lg font-black tracking-tight">Ertiga Availability Broadcast</h2>
              <p className="mt-0.5 text-xs font-semibold text-white/50 uppercase tracking-wider">Sync fleet parameters instantly to global B2B WhatsApp strings</p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-2.5">
              <label className="block text-[10px] font-black text-white/40 uppercase tracking-wider">Current Vehicle Location</label>
              <input value={vehicleLocation} onChange={(e) => setVehicleLocation(e.target.value)} className="w-full bg-transparent text-sm font-bold text-white outline-none mt-0.5" placeholder="Raipur Airport" />
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-2.5">
              <label className="block text-[10px] font-black text-white/40 uppercase tracking-wider">Route Availability Scope</label>
              <input value={availableFor} onChange={(e) => setAvailableFor(e.target.value)} className="w-full bg-transparent text-sm font-bold text-white outline-none mt-0.5" placeholder="Korba, Bilaspur, Raigarh..." />
            </div>
          </div>
        </section>

        {/* Live Search Interactive Filter Bar */}
        <section className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs text-left">
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200/40">
            <Search size={16} className="text-slate-400 shrink-0" />
            <input className="w-full bg-transparent text-xs font-bold text-slate-800 outline-none placeholder:text-slate-400" placeholder="Type customer name or target mobile numbers to query logs..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </section>

        {/* Tabs System Render Blocks */}
        <section className="overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col">
          <div className="grid grid-cols-3 border-b border-slate-100 bg-white">
            {tabs.map((tab, index) => (
              <button
                key={tab.label}
                type="button"
                onClick={() => scrollToTab(index)}
                className={`relative py-4 text-xs font-black uppercase tracking-wider transition ${activeTab === index ? "text-orange-600" : "text-slate-400"}`}
              >
                {tab.label} <span className="ml-1 bg-slate-100 border px-1.5 py-0.5 rounded-full text-[10px] text-slate-600 font-bold">{tab.leads.length}</span>
                {activeTab === index && <span className="absolute bottom-0 left-1/2 h-0.5 w-14 -translate-x-1/2 rounded-full bg-orange-600" />}
              </button>
            ))}
          </div>

          {/* Swipeable List Framework Layer */}
          <div ref={tabRef} className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth scrollbar-none" onScroll={(e) => {
            const w = e.currentTarget.clientWidth;
            const idx = Math.round(e.currentTarget.scrollLeft / w);
            if (activeTab !== idx) setActiveTab(idx);
          }}>
            {tabs.map((tab) => (
              <div key={tab.label} className="min-w-full snap-start p-4">
                {tab.leads.length === 0 ? (
                  <div className="rounded-2xl bg-slate-50 border border-dashed py-14 text-center text-xs font-black text-slate-400 uppercase tracking-wider">{tab.empty}</div>
                ) : (
                  <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
                    {tab.leads.map((lead) => (
                      <LeadCard
                        key={lead.id}
                        lead={lead}
                        statusText={getLeadStatusText(lead)}
                        callLead={callLead}
                        markCallAgain={markCallAgain}
                        markDone={markDone}
                        requestDeleteLead={requestDeleteLead}
                        b2bMessage={getB2BMessage()}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* Floating Modal Input Sheet Drawer */}
      {showAdd && (
        <div className="fixed inset-0 z-[997] flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl text-left">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div>
                <h2 className="text-lg font-black uppercase tracking-tight">Add New CRM Lead</h2>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Real-time anti duplicate scan engine active</p>
              </div>
              <button type="button" onClick={() => setShowAdd(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm">✕</button>
            </div>
            <div className="space-y-3">
              <input className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-white text-xs font-bold text-slate-800 outline-none focus:border-orange-500 shadow-inner" placeholder="Customer / B2B Partner Full Name" value={name} onChange={(e) => setName(e.target.value)} />
              <input type="tel" maxLength={10} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-white text-xs font-bold text-slate-800 outline-none focus:border-orange-500 shadow-inner" placeholder="10-Digit Mobile Number" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} />
              <button onClick={addLead} disabled={loading} className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 py-3.5 text-xs font-black text-white uppercase tracking-widest disabled:opacity-60 shadow-md">
                {loading ? <Loader2 className="animate-spin" size={15} /> : <Plus size={15} />}
                {loading ? "Verifying..." : "Save Log Entry"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MiniStat({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200/80 p-4 text-left shadow-xs">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">{title}</span>
      <h2 className="mt-1 text-2xl font-black text-slate-950 tracking-tight">{value}</h2>
    </div>
  );
}

function LeadCard({
  lead,
  statusText,
  callLead,
  markCallAgain,
  markDone,
  requestDeleteLead,
  b2bMessage,
}: any) {
  // 👑 SOLVED RETRIEVAL ORDER: Core global utility hook executes clean last 10 digit configurations safely
  const sanitizedLast10 = extractPhoneLast10Digits(lead.phone);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-xs hover:shadow-md transition flex flex-col gap-3 relative">
      <div className="flex items-start justify-between gap-3 w-full">
        <div className="flex gap-3">
          <span className="text-2xl p-2.5 bg-orange-50 border border-orange-100 rounded-xl shrink-0 text-center">👤</span>
          <div>
            <h3 className="text-base font-black text-slate-950 tracking-tight">{lead.name || "Unknown Partner"}</h3>
            <p className="mt-0.5 flex items-center gap-1 text-xs font-bold text-slate-500">
              📱 +91 {lead.phone || "No number"}
            </p>
            <div className="mt-2 flex flex-wrap gap-1 text-[10px] font-bold">
              <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded border border-orange-100 uppercase tracking-wide font-black">{statusText}</span>
              {lead.phoneLast10 && <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded border">ID: {lead.phoneLast10}</span>}
            </div>
          </div>
        </div>
        <button type="button" onClick={() => requestDeleteLead(lead)} className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition border border-red-100/40">
          <Trash2 size={14} />
        </button>
      </div>

      {lead.hiddenUntil && (
        <div className="w-full bg-slate-50 border text-slate-500 rounded-xl px-3 py-2 text-[11px] font-bold">
          ℹ️ Hidden target threshold: {new Date(lead.hiddenUntil).toLocaleString("en-IN")}
        </div>
      )}

      {/* Action CTA grid row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 w-full pt-1">
        <button type="button" onClick={() => callLead(lead)} className="flex items-center justify-center gap-1.5 rounded-xl bg-green-600 hover:bg-green-700 px-3 py-2.5 text-xs font-black text-white uppercase tracking-wider shadow-sm">
          <Phone size={14} /> Call
        </button>
        <a href={`https://wa.me/91${sanitizedLast10}?text=${encodeURIComponent(b2bMessage)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3 py-2.5 text-xs font-black text-white uppercase tracking-wider shadow-sm text-center">
          <Send size={14} /> Broadcast
        </a>
        <button type="button" onClick={() => markCallAgain(lead)} className="flex items-center justify-center gap-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 px-3 py-2.5 text-xs font-black text-white uppercase tracking-wider">
          <RotateCcw size={14} /> Again
        </button>
        <button type="button" onClick={() => markDone(lead)} className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-950 hover:bg-slate-900 px-3 py-2.5 text-xs font-black text-white uppercase tracking-wider">
          <EyeOff size={14} /> Hide
        </button>
        <a href={`https://wa.me/91${sanitizedLast10}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 px-3 py-2.5 text-xs font-black text-slate-700 border border-slate-200/60 tracking-wider">
          <MessageCircle size={14} /> Chat
        </a>
      </div>
    </div>
  );
}