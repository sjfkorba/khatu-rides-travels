import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

export function getAdminDb() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Firebase Admin credentials missing.");
  }

  const existingApp = getApps().find(
    (item) => item.name === "khatu-rides-admin"
  );

  const app =
    existingApp ??
    initializeApp(
      {
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      },
      "khatu-rides-admin"
    );

  return getFirestore(app);
}