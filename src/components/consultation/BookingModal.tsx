'use client';

import { useState, useMemo, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, ShieldCheck, Zap } from 'lucide-react';
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

// Optimized Email Template Logic (Brown Theme #72392F)
function generateAppointmentConfirmationEmail(apptData: any): string {
    const consultationDate = new Date(apptData.consultationDate);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://shreevarma.org';
    const profileUrl = `${appUrl}/profile?tab=appointments`;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: sans-serif; background-color: #f9f5f1; padding: 20px; }
          .card { max-width: 500px; margin: auto; background: white; border-radius: 12px; padding: 30px; border: 1px solid #eee; }
          .header { text-align: center; margin-bottom: 20px; }
          .btn { display: block; text-align: center; background: #72392F; color: white !important; padding: 12px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 20px; }
          .detail { margin-bottom: 10px; border-bottom: 1px solid #f0f0f0; padding-bottom: 10px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1 style="color: #72392F;">Appointment Confirmed!</h1>
            <p>Your instant video consultation is ready.</p>
          </div>
          <div class="detail"><strong>Patient:</strong> ${apptData.patient.name}</div>
          <div class="detail"><strong>Date:</strong> ${consultationDate.toLocaleDateString()}</div>
          <div class="detail"><strong>Type:</strong> Instant Video Call</div>
          <a href="${profileUrl}" class="btn">Join Consultation Now</a>
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
        
        // Use optimized email logic
        const emailHtml = generateAppointmentConfirmationEmail(consultationData);
        await setDoc(doc(collection(firestore, 'mail')), {
            to: [user.email],
            message: {
                subject: "Instant Consultation Confirmed - Shreevarma",
                html: emailHtml,
            },
        });

        toast({ title: 'Successfully Booked!', description: "Redirecting to your consultation..." });
        onOpenChange(false);
        router.push('/profile?tab=appointments');
      
    } catch (error: any) {
        console.error("Booking Error:", error);
        toast({ variant: 'destructive', title: 'Booking Failed', description: 'Please try again.' });
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-[95vw] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
        {/* Decorative Header */}
        <div className="bg-[#6f3a2f] p-8 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Instant Access</span>
          </div>
          <DialogTitle className="font-headline text-3xl leading-tight">Quick Consultation</DialogTitle>
          <p className="text-white/60 text-sm mt-2 italic">Join the next available specialist in minutes.</p>
        </div>

        <ScrollArea className="max-h-[60vh] px-8 pt-8">
            <div className="space-y-6">
                <div className="space-y-2">
                    <Label className="text-[11px] font-black uppercase tracking-widest text-[#6f3a2f]">Patient Name</Label>
                    <Input 
                      value={patientName} 
                      onChange={e => setPatientName(e.target.value)} 
                      className="rounded-xl border-slate-100 focus:border-[#6f3a2f] focus:ring-[#6f3a2f]/10 h-12 font-bold"
                      placeholder="Enter full name"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-[11px] font-black uppercase tracking-widest text-[#6f3a2f]">Contact Number</Label>
                    <Input 
                      value={patientPhone} 
                      onChange={e => setPatientPhone(e.target.value)} 
                      className="rounded-xl border-slate-100 focus:border-[#6f3a2f] focus:ring-[#6f3a2f]/10 h-12 font-bold"
                      placeholder="+91 00000 00000"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-[11px] font-black uppercase tracking-widest text-[#6f3a2f]">Health Concern (Optional)</Label>
                    <Textarea 
                      value={healthIssue} 
                      onChange={e => setHealthIssue(e.target.value)} 
                      className="rounded-xl border-slate-100 focus:border-[#6f3a2f] focus:ring-[#6f3a2f]/10 min-h-[100px] font-medium"
                      placeholder="Tell us briefly about your issue..."
                    />
                </div>
            </div>

            <div className="mt-8 mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex space-x-3 items-start">
                    <Checkbox 
                      id="terms" 
                      checked={agreedToTerms} 
                      onCheckedChange={(c) => setAgreedToTerms(c as boolean)} 
                      className="mt-1 data-[state=checked]:bg-[#6f3a2f] data-[state=checked]:border-[#6f3a2f]"
                    />
                    <Label htmlFor="terms" className="text-[11px] leading-relaxed text-slate-500 font-medium cursor-pointer">
                      I agree to the <span className="text-[#6f3a2f] font-bold underline">No-Refund Policy</span> for instant calls and consent to recording for quality purposes.
                    </Label>
                </div>
            </div>
        </ScrollArea>

        <DialogFooter className="p-8 pt-4">
          <Button 
            onClick={handleBooking} 
            className="w-full h-14 rounded-full bg-[#6f3a2f] hover:bg-[#5a2e25] text-white font-black uppercase tracking-widest text-xs shadow-xl transition-all active:scale-95 disabled:opacity-50" 
            disabled={isProcessing || !agreedToTerms}
          >
            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
            Confirm & Start Call
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}