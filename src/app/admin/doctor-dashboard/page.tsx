
'use client';

import { useState, useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar as CalendarIcon, Clock, Users, Video, Loader2, History, CalendarDays } from 'lucide-react';
import { useCollection, useFirebase, useUser } from '@/firebase';
import { collection, query, DocumentData, doc, updateDoc, where } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Consultation extends DocumentData {
    __docId: string;
    id: string;
    patientId: string;
    doctorId?: string; 
    patient: {
        name: string;
        avatar: string;
        phone?: string;
    };
    consultationDate: string;
    status: 'Upcoming' | 'Completed' | 'Cancelled' | 'Live';
    type: string;
    healthIssue?: string;
}

export default function DoctorDashboardPage() {
    const { firestore } = useFirebase();
    const { user } = useUser();
    const router = useRouter();
    const { toast } = useToast();
    const [claimingId, setClaimingId] = useState<string | null>(null);

    const appointmentsQuery = useMemo(() => {
        if (!firestore) return null;
        // Query all consultations, filtering will happen client-side
        return query(collection(firestore, 'consultations'));
    }, [firestore]);

    const { data: allAppointments, isLoading } = useCollection<Consultation>(appointmentsQuery);

    const categorizedAppointments = useMemo(() => {
        const now = new Date();
        const todayStr = now.toDateString();
        
        if (!allAppointments) {
            return { today: [], upcoming: [], past: [] };
        }

        // Show appointments that are either unassigned OR already claimed by the current doctor
        const myAppointments = allAppointments.filter(appt => !appt.doctorId || appt.doctorId === user?.uid);

        const sortedAppointments = [...myAppointments].sort((a, b) => new Date(a.consultationDate).getTime() - new Date(b.consultationDate).getTime());

        return {
            today: sortedAppointments.filter(a => new Date(a.consultationDate).toDateString() === todayStr),
            upcoming: sortedAppointments.filter(a => new Date(a.consultationDate) > now && new Date(a.consultationDate).toDateString() !== todayStr),
            past: allAppointments.filter(a => new Date(a.consultationDate) < now || a.status === 'Completed' || a.status === 'Cancelled')
        };
    }, [allAppointments, user]);

    const handleClaimAndJoin = async (appt: Consultation) => {
        if (!firestore || !user || !user.displayName) return;
        
        setClaimingId(appt.__docId);
        
        const appointmentRef = doc(firestore, `consultations`, appt.__docId);

        try {
            // Claim the appointment if it's not already claimed by this doctor
            if (appt.doctorId !== user.uid) {
                const updatePayload = {
                    doctorId: user.uid,
                    doctor: {
                        name: user.displayName,
                        specialty: 'General Ayurveda',
                        id: user.uid
                    },
                    status: 'Upcoming' // Ensure status is 'Upcoming'
                };
                await updateDoc(appointmentRef, updatePayload);
                toast({ title: "Appointment Claimed", description: `You are now assigned to ${appt.patient.name}.` });
            }
            
            // Navigate to the video call
            router.push(`/consultations/${appt.__docId}`);

        } catch (error) {
            console.error("Failed to claim/join consultation:", error);
            toast({ variant: "destructive", title: "Operation Failed", description: "Could not claim or join the session." });
        } finally {
            setClaimingId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }
    
    const AppointmentTable = ({ appointments }: { appointments: Consultation[] }) => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Scheduled Date & Time</TableHead>
                    <TableHead>Health Issue</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {appointments.map(appt => (
                    <TableRow key={appt.__docId}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={appt.patient?.avatar} />
                                    <AvatarFallback>{appt.patient?.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium leading-none">{appt.patient?.name}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{appt.patient?.phone || 'No phone'}</p>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">
                                    {new Date(appt.consultationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {new Date(appt.consultationDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </TableCell>
                        <TableCell className="max-w-[180px] truncate text-sm">
                            {appt.healthIssue || <span className="text-muted-foreground italic">No notes</span>}
                        </TableCell>
                        <TableCell>
                             <Badge variant={!appt.doctorId ? 'outline' : (appt.doctorId === user?.uid ? 'default' : 'secondary')}>
                                {!appt.doctorId ? 'Unclaimed' : (appt.doctorId === user?.uid ? 'Claimed by you' : 'Claimed')}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                             <Button 
                                size="sm"
                                onClick={() => handleClaimAndJoin(appt)} 
                                disabled={claimingId === appt.__docId || (!!appt.doctorId && appt.doctorId !== user?.uid)}
                            >
                                {claimingId === appt.__docId ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Video className="mr-2 h-4 w-4"/>}
                                {appt.doctorId === user?.uid ? 'Join Call' : 'Claim & Join'}
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );

     const PastAppointmentTable = ({ appointments }: { appointments: Consultation[] }) => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {appointments.map(appt => (
                    <TableRow key={appt.__docId}>
                        <TableCell>
                            <div className="font-medium">{appt.patient.name}</div>
                        </TableCell>
                        <TableCell>{new Date(appt.consultationDate).toLocaleDateString()}</TableCell>
                        <TableCell><Badge variant="outline">{appt.status}</Badge></TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="sm">View Details</Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );

    return (
        <div className="container mx-auto py-8 space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline text-primary">Doctor's Dashboard</h1>
                    <p className="text-muted-foreground">Manage your video consultations and patient records.</p>
                </div>
                <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full border">
                    <CalendarIcon className="w-4 h-4 text-primary"/>
                    <span className="text-sm font-semibold text-primary">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </span>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card className="border-l-4 border-l-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Today's Sessions</CardTitle>
                        <Clock className="w-4 h-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{categorizedAppointments.today.length}</div>
                    </CardContent>
                </Card>
                 <Card className="border-l-4 border-l-orange-500">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Future Bookings</CardTitle>
                        <CalendarDays className="w-4 h-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{categorizedAppointments.upcoming.length}</div>
                    </CardContent>
                </Card>
                 <Card className="border-l-4 border-l-slate-400">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Completed</CardTitle>
                        <History className="w-4 h-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{categorizedAppointments.past.length}</div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="today" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                    <TabsTrigger value="today">Today</TabsTrigger>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="past">History</TabsTrigger>
                </TabsList>

                <Card className="mt-6">
                    <CardContent className="p-0">
                        <TabsContent value="today" className="m-0">
                            {categorizedAppointments.today.length > 0 ? (
                                <AppointmentTable appointments={categorizedAppointments.today} />
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">No sessions scheduled for today.</div>
                            )}
                        </TabsContent>
                        
                        <TabsContent value="upcoming" className="m-0">
                            {categorizedAppointments.upcoming.length > 0 ? (
                                <AppointmentTable appointments={categorizedAppointments.upcoming} />
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">No future appointments found.</div>
                            )}
                        </TabsContent>

                        <TabsContent value="past" className="m-0">
                            {categorizedAppointments.past.length > 0 ? (
                                <PastAppointmentTable appointments={categorizedAppointments.past} />
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">No past history found.</div>
                            )}
                        </TabsContent>
                    </CardContent>
                </Card>
            </Tabs>
        </div>
    );
}
