'use client';

import { useState, useMemo, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
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
import { cn } from '@/lib/utils';

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ... keep generateAppointmentConfirmationEmail function exactly as it was

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
        
        await setDoc(doc(collection(firestore, 'mail')), {
            to: [user.email],
            message: {
                subject: "Instant Consultation Confirmed - Shreevarma",
                html: generateAppointmentConfirmationEmail(consultationData),
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
      <DialogContent 
        className={cn(
          "max-w-md w-[92vw] p-0 overflow-hidden border-none shadow-2xl",
          // Fix: 75% height on mobile, auto on desktop
          "flex flex-col h-[75vh] md:h-auto rounded-[2rem] md:rounded-[2.5rem]"
        )}
      >
        {/* 1. FIXED HEADER - Stays at top */}
        <div className="bg-[#6f3a2f] p-6 md:p-8 text-white shrink-0 relative">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80">Instant Access</span>
          </div>
          <DialogTitle className="font-headline text-2xl md:text-3xl leading-tight">
            Quick Consultation
          </DialogTitle>
          <p className="text-white/60 text-[11px] md:text-sm mt-1 italic">
            Join the next available specialist in minutes.
          </p>
        </div>

        {/* 2. SCROLLABLE CONTENT - Takes up flexible middle space */}
        <ScrollArea className="flex-1 bg-white">
          <div className="px-6 md:px-8 py-6 space-y-5 md:space-y-6">
            <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#6f3a2f]">Patient Name</Label>
                <Input 
                  value={patientName} 
                  onChange={e => setPatientName(e.target.value)} 
                  className="rounded-xl border-slate-100 focus:border-[#6f3a2f] h-12 font-bold"
                  placeholder="Enter full name"
                />
            </div>
            <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#6f3a2f]">Contact Number</Label>
                <Input 
                  value={patientPhone} 
                  onChange={e => setPatientPhone(e.target.value)} 
                  className="rounded-xl border-slate-100 focus:border-[#6f3a2f] h-12 font-bold"
                  placeholder="+91 00000 00000"
                />
            </div>
            <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#6f3a2f]">Health Concern (Optional)</Label>
                <Textarea 
                  value={healthIssue} 
                  onChange={e => setHealthIssue(e.target.value)} 
                  className="rounded-xl border-slate-100 focus:border-[#6f3a2f] min-h-[80px] md:min-h-[100px] font-medium"
                  placeholder="Tell us briefly..."
                />
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex space-x-3 items-start">
                    <Checkbox 
                      id="terms" 
                      checked={agreedToTerms} 
                      onCheckedChange={(c) => setAgreedToTerms(c as boolean)} 
                      className="mt-1 data-[state=checked]:bg-[#6f3a2f] data-[state=checked]:border-[#6f3a2f]"
                    />
                    <Label htmlFor="terms" className="text-[10px] leading-relaxed text-slate-500 font-medium cursor-pointer">
                      I agree to the <span className="text-[#6f3a2f] font-bold underline">No-Refund Policy</span> for instant calls.
                    </Label>
                </div>
            </div>
          </div>
        </ScrollArea>

        {/* 3. FIXED FOOTER - Stays at bottom */}
        <DialogFooter className="p-6 md:p-8 bg-white border-t border-slate-50 shrink-0">
          <Button 
            onClick={handleBooking} 
            className="w-full h-12 md:h-14 rounded-full bg-[#6f3a2f] hover:bg-[#5a2e25] text-white font-black uppercase tracking-widest text-[10px] md:text-xs shadow-xl transition-all active:scale-95" 
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