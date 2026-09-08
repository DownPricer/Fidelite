import { redirect } from "next/navigation";

import { resolveEmployeeDemo } from "@/lib/employee-demo-server";



export default async function EmployeeHomePage() {

  const { session, demo } = await resolveEmployeeDemo();

  redirect(session || demo ? "/employe/scan" : "/employe/connexion");

}

