
'use client';

import { useState, useMemo } from 'react';
import { useUser, useCollection, useFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

type Review = {
    __docId: string;
    userId: string;
    userName: string;
    userImage?: string;
    rating: number;
    comment: string;
    createdAt: {
        seconds: number;
        nanoseconds: number;
    } | null;
};

export function ProductReviews({ productId }: { productId: string }) {
    const { user } = useUser();
    const { firestore } = useFirebase();
    const { toast } = useToast();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const reviewsQuery = useMemo(() => {
        if (!firestore) return null;
        return query(collection(firestore, `products/${productId}/reviews`), orderBy('createdAt', 'desc'));
    }, [firestore, productId]);

    const { data: reviews, isLoading: areReviewsLoading } = useCollection<Review>(reviewsQuery);

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !firestore) {
            toast({ variant: 'destructive', title: 'You must be logged in to leave a review.' });
            return;
        }
        if (rating === 0) {
            toast({ variant: 'destructive', title: 'Please select a star rating.' });
            return;
        }
        if (comment.trim().length < 10) {
            toast({ variant: 'destructive', title: 'Please write a comment of at least 10 characters.' });
            return;
        }

        setIsSubmitting(true);
        try {
            const reviewsCol = collection(firestore, `products/${productId}/reviews`);
            await addDoc(reviewsCol, {
                userId: user.uid,
                userName: user.displayName || 'Anonymous',
                userImage: user.photoURL || '',
                productId: productId,
                rating: rating,
                comment: comment,
                createdAt: serverTimestamp(),
            });
            setRating(0);
            setComment('');
        } catch (error) {
            console.error("Error submitting review:", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not submit your review.' });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const overallRating = useMemo(() => {
        if (!reviews || reviews.length === 0) return 0;
        const total = reviews.reduce((acc, review) => acc + review.rating, 0);
        return total / reviews.length;
    }, [reviews]);

    return (
        <div className="space-y-12">
            <div>
                <CardHeader className="px-0">
                    <CardTitle className="font-headline text-2xl">Customer Reviews ({reviews?.length || 0})</CardTitle>
                     {reviews && reviews.length > 0 && (
                        <div className="flex items-center gap-2 pt-2">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={cn(
                                            "w-5 h-5",
                                            i < Math.round(overallRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                        )}
                                    />
                                ))}
                            </div>
                            <span className="font-bold">{overallRating.toFixed(1)} out of 5</span>
                        </div>
                    )}
                </CardHeader>
                {areReviewsLoading ? (
                    <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
                ) : reviews && reviews.length > 0 ? (
                    <div className="space-y-6">
                        {reviews.map((review) => (
                            <div key={review.__docId} className="flex gap-4 items-start">
                                <Avatar>
                                    <AvatarImage src={review.userImage} alt={review.userName} />
                                    <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{review.userName}</p>
                                    <div className="flex items-center gap-2 my-1">
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={cn("w-4 h-4", i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300")} />
                                            ))}
                                        </div>
                                         <p className="text-xs text-muted-foreground">
                                            {review.createdAt ? formatDistanceToNow(new Date(review.createdAt.seconds * 1000), { addSuffix: true }) : ''}
                                        </p>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground">No reviews yet. Be the first to write one!</p>
                )}
            </div>

            <div>
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Write a Review</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {user ? (
                            <form onSubmit={handleReviewSubmit} className="space-y-4">
                                <div>
                                    <p className="font-medium mb-2">Your Rating</p>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button type="button" key={star} onClick={() => setRating(star)}>
                                                <Star className={cn("w-6 h-6 transition-colors", rating >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300 hover:text-yellow-300")} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <Textarea
                                        placeholder="Share your thoughts about the product..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        rows={4}
                                    />
                                </div>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Submit Review
                                </Button>
                            </form>
                        ) : (
                            <div className="text-center text-muted-foreground p-6">
                                <p>You must be logged in to write a review.</p>
                                <Button asChild variant="link">
                                    <Link href="/login">Login or Sign Up</Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
    
