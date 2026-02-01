
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useUser, useFirebase, useDoc } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { doc, setDoc, collection } from 'firebase/firestore';
import { Checkbox } from '../ui/checkbox';
import { ScrollArea } from '../ui/scroll-area';

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function generateAppointmentConfirmationEmail(apptData: any, userEmail: string): string {
    const consultationDate = new Date(apptData.consultationDate);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://shreevarma.org';
    const profileUrl = `${appUrl}/profile?tab=appointments`;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Confirmation</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');
          body { font-family: 'Montserrat', sans-serif; margin: 0; padding: 0; background-color: #f9f5f1; }
          .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e0e0e0; }
          .header { background-color: #72392F; padding: 30px; text-align: center; }
          .header img { max-width: 180px; }
          .content { padding: 30px; }
          .footer { background-color: #f1f1f1; padding: 20px; text-align: center; font-size: 12px; color: #888; }
          p { line-height: 1.6; }
          .button { display: inline-block; padding: 12px 25px; background-color: #72392F; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: bold; }
          .details-box { background-color: #f9f9f9; border: 1px solid #eee; padding: 20px; border-radius: 8px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://firebasestorage.googleapis.com/v0/b/studio-7312981180-d37fd.firebasestorage.app/o/Icons%20%26%20Logos%2FLOGO.png?alt=media&token=7193bfde-a319-49ee-8a77-2bcf1af97553" alt="Shreevarma's Wellness">
          </div>
          <div class="content">
            <h1 style="color: #72392F; text-align: center; font-size: 24px;">Appointment Confirmed!</h1>
            <p style="text-align: center; color: #555;">Hi ${apptData.patient.name}, your consultation is booked.</p>
            
            <div class="details-box">
                <h2 style="color: #333; font-size: 18px; margin-top: 0;">Appointment Details</h2>
                <p style="color: #555;"><strong>Date:</strong> ${consultationDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p style="color: #555;"><strong>Time:</strong> Just Now (Please join the call shortly)</p>
                <p style="color: #555;"><strong>Type:</strong> ${apptData.type}</p>
                ${apptData.healthIssue ? `<p style="color: #555;"><strong>Health Concern:</strong> ${apptData.healthIssue}</p>` : ''}
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <a href="${profileUrl}" class="button">View My Appointments</a>
            </div>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Shreevarma's Wellness. All Rights Reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
}

export function BookingModal({ open, onOpenChange }: BookingModalProps) {
  const { user } = useUser();
  const { firestore } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();
  
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [healthIssue, setHealthIssue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const userRef = useMemo(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userProfile } = useDoc(userRef);

  useEffect(() => {
    if (open && user) {
        setPatientName(user.displayName || userProfile?.name || '');
        setPatientPhone(user.phoneNumber || userProfile?.phone || '');
    }
  }, [user, userProfile, open]);
  
  
  const handleBooking = async () => {
    if (!user || !firestore || !user.email) {
        toast({ variant: 'destructive', title: "Login Required", description: "Please log in to book." });
        router.push('/login?redirect=/consultation');
        return;
    }
    if (!patientName || !patientPhone) {
      toast({ variant: 'destructive', title: "Missing Information", description: "Please enter your name and phone number." });
      return;
    }
    setIsProcessing(true);
    
    try {
        const consultationRef = doc(collection(firestore, 'consultations'));
        const consultationId = consultationRef.id;

        const consultationData = {
            id: consultationId,
            patientId: user.uid,
            doctorId: null,
            patient: { 
              name: patientName, 
              phone: patientPhone, 
              email: user.email,
              avatar: user.photoURL || '' 
            },
            healthIssue,
            consultationDate: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            status: 'Upcoming',
            type: 'Video Consultation',
            roomName: consultationId,
        };
        
        await setDoc(consultationRef, consultationData);
        
        const emailHtml = generateAppointmentConfirmationEmail(consultationData, user.email);
        await setDoc(doc(collection(firestore, 'mail')), {
            to: [user.email],
            message: {
                subject: "Appointment Confirmed - Shreevarma's Wellness",
                html: emailHtml,
            },
        });

        toast({ title: 'Appointment Booked!', description: "You can join the call from your profile." });
        onOpenChange(false);
        router.push('/profile?tab=appointments');
      
    } catch (error: any) {
        console.error("Booking Error:", error);
        toast({ variant: 'destructive', title: 'Booking Failed', description: 'Could not complete the booking. Please try again.' });
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-[90vw] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="font-headline text-2xl">Book an Instant Consultation</DialogTitle>
          <DialogDescription>
            Confirm your details to join the video call queue.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 px-6">
            <div className="space-y-4">
                <div className="space-y-2"><Label>Name</Label><Input value={patientName} onChange={e => setPatientName(e.target.value)} /></div>
                <div className="space-y-2"><Label>Phone</Label><Input value={patientPhone} onChange={e => setPatientPhone(e.target.value)} /></div>
                <div className="space-y-2"><Label>Health Issue (Optional)</Label><Textarea value={healthIssue} onChange={e => setHealthIssue(e.target.value)} /></div>
            </div>
            <div className="py-4">
                <div className="flex space-x-2 items-start">
                    <Checkbox id="terms" checked={agreedToTerms} onCheckedChange={(c) => setAgreedToTerms(c as boolean)} className="mt-1"/>
                    <Label htmlFor="terms" className="text-xs text-muted-foreground">I consent to the session being recorded for quality and training purposes and agree to the no-refund policy for instant consultations.</Label>
                </div>
            </div>
        </ScrollArea>
        <DialogFooter className="p-6 pt-4 border-t mt-auto">
          <Button onClick={handleBooking} className="w-full" disabled={isProcessing || !agreedToTerms}>
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm & Book Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
