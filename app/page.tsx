import {Card, CardContent, List, ListItemButton, ListItemText, ListSubheader, Typography} from "@mui/material";
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";
import prisma from "@/lib/db";
import Link from "next/link";


export default async function Home() {

    const session = await getServerSession(authOptions);

    if (!session) {
        return <Typography variant="h6" textAlign="center" sx={{mt: 4,}}>Only members of the ARTCC can access the
            IDS.</Typography>
    }

    const airports = await prisma.facility.findMany({
        where: {
            airport: {
                isNot: null,
            },
        },
        orderBy: {
            id: 'asc',
        },
    });

    const radars = await prisma.facility.findMany({
        where: {
            radar: {
                isEnrouteFacility: false,
            },
        },
        orderBy: {
            id: 'asc',
        },
    });

    const enroutes = await prisma.facility.findMany({
        where: {
            radar: {
                isEnrouteFacility: true,
            },
        },
        orderBy: {
            id: 'asc',
        },
    });

    return (
        <Card sx={{mt: 2, width: '100%',}}>
            <CardContent>
                <Typography variant="h5" textAlign="center" gutterBottom>Facility Picker (select one)</Typography>
                <List
                    sx={{
                        width: '100%',
                        position: 'relative',
                        overflow: 'auto',
                        maxHeight: 500,
                        '& ul': {padding: 0},
                    }}
                    subheader={<li/>}
                >
                    <li>
                        <ul>
                            <ListSubheader>Airports</ListSubheader>
                            {airports.map((item) => (
                                <Link key={item.id} href={`/app/airport/${item.id}`}
                                      style={{color: 'inherit', textDecoration: 'none',}}>
                                    <ListItemButton>
                                        <ListItemText primary={item.id}/>
                                    </ListItemButton>
                                </Link>
                            ))}
                        </ul>
                    </li>

                    <li>
                        <ul>
                            <ListSubheader>Radars</ListSubheader>
                            {radars.map((item) => (
                                <Link key={item.id} href={`/app/radar/${item.id}`}
                                      style={{color: 'inherit', textDecoration: 'none',}}>
                                    <ListItemButton>
                                        <ListItemText primary={item.id}/>
                                    </ListItemButton>
                                </Link>
                            ))}
                        </ul>
                    </li>

                    <li>
                        <ul>
                            <ListSubheader>Enroutes</ListSubheader>
                            {enroutes.map((item) => (
                                <Link key={item.id} href={`/app/radar/${item.id}`}
                                      style={{color: 'inherit', textDecoration: 'none',}}>
                                    <ListItemButton>
                                        <ListItemText primary={item.id}/>
                                    </ListItemButton>
                                </Link>
                            ))}
                        </ul>
                    </li>
                </List>
            </CardContent>
        </Card>
    );
}