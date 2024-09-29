import {Typography} from "@mui/material";
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";

export default async function Home() {

    const session = await getServerSession(authOptions);

    if (!session) {
        return <Typography variant="h6" textAlign="center" sx={{mt: 4,}}>Only members of the ARTCC can access the
            IDS.</Typography>
    }
  
  return (
      <Typography variant="h6" textAlign="center" sx={{mt: 4,}}>Select a facility</Typography>
  );
}