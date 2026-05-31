import {
  collection,
  addDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import type { Invoice } from "../src/types/invoice";

export async function createInvoice(
  invoice: Invoice
) {
  try {
    const docRef = await addDoc(
      collection(db, "invoices"),
      invoice
    );

    return docRef.id;
  } catch (error) {
    console.error(error);

    throw error;
  }
}